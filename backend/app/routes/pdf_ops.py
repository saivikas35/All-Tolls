"""
PDF Operations: Merge, Split, Remove Pages, Compress
Uses pypdf (pure Python, no external tools needed).
"""
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from pypdf import PdfReader, PdfWriter
import fitz  # PyMuPDF — used for thumbnail generation
import os
import uuid
import zipfile
import base64
import pdfplumber
import pandas as pd
from typing import List, Optional
from app.utils import get_file_or_url, save_upload

router = APIRouter()
UPLOAD_DIR = "uploads"


def _parse_page_ranges(page_str: str, total: int) -> List[int]:
    """Parse '1,3-5,7' into 0-indexed page list."""
    pages = []
    for part in page_str.split(","):
        part = part.strip()
        if "-" in part:
            start, end = part.split("-", 1)
            pages.extend(range(int(start) - 1, int(end)))
        elif part.isdigit():
            pages.append(int(part) - 1)
    return [p for p in pages if 0 <= p < total]


# ─── PAGE THUMBNAILS (for visual page selector) ───────────────────────────────

@router.post("/pdf-split/preview")
def pdf_split_preview(
    file: Optional[UploadFile] = File(default=None),
    url: Optional[str] = Form(default=None)
):
    """
    Accept a PDF and return base64-encoded JPEG thumbnails for every page.
    Used by the custom PDF Split UI to show an interactive preview grid.
    """
    in_path = get_file_or_url(file, url)
    doc = fitz.open(in_path)
    thumbnails = []

    # Render at 0.4x scale → small ~170px wide thumbnails (fast, low bandwidth)
    mat = fitz.Matrix(0.4, 0.4)
    for i, page in enumerate(doc):
        pix = page.get_pixmap(matrix=mat)
        img_bytes = pix.tobytes("jpeg")
        b64 = base64.b64encode(img_bytes).decode("utf-8")
        thumbnails.append({
            "page": i + 1,          # 1-indexed
            "dataUrl": f"data:image/jpeg;base64,{b64}",
        })

    doc.close()
    return {
        "success": True,
        "pageCount": len(thumbnails),
        "thumbnails": thumbnails,
        # Save the path so the execute endpoint can reuse it (saves re-upload)
        "pdfToken": os.path.basename(in_path),
    }


# ─── MERGE ───────────────────────────────────────────────────────────────────

@router.post("/pdf-merge")
def pdf_merge(
    files: Optional[List[UploadFile]] = File(default=None),
    url: Optional[str] = Form(default=None)
):
    """Merge multiple PDF files into one."""
    writer = PdfWriter()
    temp_paths = []
    
    if files and len(files) >= 2:
        for f in files:
            if not f.filename.lower().endswith(".pdf"):
                raise HTTPException(status_code=400, detail=f"{f.filename} is not a PDF.")
            path = save_upload(f)
            temp_paths.append(path)
            reader = PdfReader(path)
            for page in reader.pages:
                writer.add_page(page)
    else:
        raise HTTPException(status_code=400, detail="Please upload at least 2 PDF files via browser payload.")

    out_name = f"merged_{uuid.uuid4().hex[:8]}_AllTools.pdf"
    out_path = os.path.join(UPLOAD_DIR, out_name)
    with open(out_path, "wb") as out_f:
        writer.write(out_f)

    return {"success": True, "downloadUrl": f"/uploads/{out_name}"}


# ─── SPLIT EXECUTION ───────────────────────────────────────────────────────────

@router.post("/pdf-split")
def pdf_split(
    file: Optional[UploadFile] = File(default=None),
    url: Optional[str] = Form(default=None),
    pdfToken: Optional[str] = Form(default=None),
    pages: str = Form(default=""),
    split_mode: str = Form(default="separate"), # "separate", "merge", or "custom"
):
    """
    Execute a PDF split operation.
    - `pdfToken`: Can be passed from the `/preview` endpoint to avoid re-uploading.
    - `pages`: Comma separated ranges (e.g. '1-3,5', or '1,2,4,5').
    - `split_mode`: 
       - "separate": Each selected page becomes its own PDF (returns ZIP)
       - "merge": All selected pages combine into ONE new PDF
       - "custom": Splits exactly by the provided ranges (each comma group is one PDF, returns ZIP)
    """
    if pdfToken:
        in_path = os.path.join(UPLOAD_DIR, os.path.basename(pdfToken))
        if not os.path.exists(in_path):
            raise HTTPException(status_code=400, detail="Preview session expired. Please re-upload.")
    else:
        in_path = get_file_or_url(file, url)
        
    reader = PdfReader(in_path)
    total = len(reader.pages)

    if split_mode == "merge":
        # Merge all selected pages into a single PDF
        writer = PdfWriter()
        if not pages.strip():
             # Selected nothing? Return empty or error
             raise HTTPException(status_code=400, detail="No pages selected.")
        page_nums = _parse_page_ranges(pages, total)
        for pn in page_nums:
             writer.add_page(reader.pages[pn])
             
        out_name = f"split_merged_{uuid.uuid4().hex[:8]}_AllTools.pdf"
        out_path = os.path.join(UPLOAD_DIR, out_name)
        with open(out_path, "wb") as pf:
            writer.write(pf)
        return {"success": True, "downloadUrl": f"/uploads/{out_name}"}

    # Otherwise, it returns a ZIP of multiple files
    zip_name = f"split_{uuid.uuid4().hex[:8]}_AllTools.zip"
    zip_path = os.path.join(UPLOAD_DIR, zip_name)

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        if split_mode == "separate":
            if not pages.strip():
                 # All pages
                 selected_nums = range(total)
            else:
                 selected_nums = _parse_page_ranges(pages, total)
            
            for i, p_num in enumerate(selected_nums):
                writer = PdfWriter()
                writer.add_page(reader.pages[p_num])
                part_name = f"page_{p_num + 1}.pdf"
                part_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4().hex}_{part_name}")
                with open(part_path, "wb") as pf:
                    writer.write(pf)
                zf.write(part_path, arcname=part_name)

        elif split_mode == "custom":
            # Split by provided ranges, each range is a separate PDF file in the zip
            range_parts = [r.strip() for r in pages.split(",") if r.strip()]
            for idx, rng in enumerate(range_parts):
                writer = PdfWriter()
                page_nums = _parse_page_ranges(rng, total)
                if not page_nums:
                    continue
                for pn in page_nums:
                    writer.add_page(reader.pages[pn])
                part_name = f"part_{idx + 1}_pages_{rng.replace(' ', '')}.pdf"
                part_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4().hex}_{part_name}")
                with open(part_path, "wb") as pf:
                    writer.write(pf)
                zf.write(part_path, arcname=part_name)

    return {"success": True, "downloadUrl": f"/uploads/{zip_name}"}


# ─── REMOVE PAGES ────────────────────────────────────────────────────────────

@router.post("/pdf-remove-pages")
def pdf_remove_pages(
    file: Optional[UploadFile] = File(default=None),
    url: Optional[str] = Form(default=None),
    pages: str = Form(...),
):
    """Remove specified pages. 'pages' is comma-separated 1-indexed, e.g. '2,4-6'."""
    if not pages.strip():
        raise HTTPException(status_code=400, detail="Please specify pages to remove.")

    in_path = get_file_or_url(file, url)
    reader = PdfReader(in_path)
    total = len(reader.pages)

    remove_set = set(_parse_page_ranges(pages, total))

    writer = PdfWriter()
    for i, page in enumerate(reader.pages):
        if i not in remove_set:
            writer.add_page(page)

    if len(writer.pages) == 0:
        raise HTTPException(status_code=400, detail="Cannot remove all pages from PDF.")

    out_name = f"removed_{uuid.uuid4().hex[:8]}_AllTools.pdf"
    out_path = os.path.join(UPLOAD_DIR, out_name)
    with open(out_path, "wb") as f:
        writer.write(f)

    return {"success": True, "downloadUrl": f"/uploads/{out_name}"}


# ─── COMPRESS ────────────────────────────────────────────────────────────────

@router.post("/pdf-compress")
def pdf_compress(
    file: Optional[UploadFile] = File(default=None),
    url: Optional[str] = Form(default=None)
):
    """Compress a PDF using pypdf's built-in optimization."""
    in_path = get_file_or_url(file, url)
    reader = PdfReader(in_path)
    writer = PdfWriter()

    for page in reader.pages:
        writer.add_page(page)
        
    for page in writer.pages:
        page.compress_content_streams()

    # Copy metadata
    if reader.metadata:
        writer.add_metadata(reader.metadata)

    out_name = f"compressed_{uuid.uuid4().hex[:8]}_AllTools.pdf"
    out_path = os.path.join(UPLOAD_DIR, out_name)
    with open(out_path, "wb") as f:
        writer.write(f)

    orig_size = os.path.getsize(in_path)
    new_size = os.path.getsize(out_path)
    saved_pct = round((1 - new_size / orig_size) * 100, 1) if orig_size > 0 else 0

    return {
        "success": True,
        "downloadUrl": f"/uploads/{out_name}",
        "originalSize": orig_size,
        "compressedSize": new_size,
        "savedPercent": saved_pct,
    }

# ─── PDF TO EXCEL ────────────────────────────────────────────────────────────

@router.post("/pdf-to-excel")
def pdf_to_excel(
    file: Optional[UploadFile] = File(default=None),
    url: Optional[str] = Form(default=None)
):
    """
    Extract tables from a PDF using pdfplumber and convert them to an Excel (.xlsx) file.
    Each table is placed on a separate sheet.
    """
    in_path = get_file_or_url(file, url, suffix=".pdf")
    out_name = f"excel_{uuid.uuid4().hex[:8]}_AllTools.xlsx"
    out_path = os.path.join(UPLOAD_DIR, out_name)

    tables_found = 0
    
    with pdfplumber.open(in_path) as pdf:
        # Use pandas ExcelWriter to write multiple sheets
        with pd.ExcelWriter(out_path, engine="openpyxl") as writer:
            for page_num, page in enumerate(pdf.pages):
                # Extract all tables on the current page
                tables = page.extract_tables()
                for table_idx, table in enumerate(tables):
                    if not table:
                        continue
                        
                    # Clean up the table (remove empty rows/cols if needed, but keeping structure is preferred)
                    # Convert to pandas DataFrame
                    # We assume the first row might be a header. If we want to be safe, we just write it raw.
                    df = pd.DataFrame(table)
                    
                    sheet_name = f"Page {page_num + 1} - Tbl {table_idx + 1}"
                    # Ensure sheet name is <= 31 chars as per Excel limits
                    sheet_name = sheet_name[:31]
                    
                    df.to_excel(writer, sheet_name=sheet_name, index=False, header=False)
                    tables_found += 1

    if tables_found == 0:
        # Prevent returning an empty malformed Excel file if no tables exist
        if os.path.exists(out_path):
            os.remove(out_path)
        raise HTTPException(
            status_code=400, 
            detail="No structural tables were detected in this PDF. Ensure the document contains actual grid tables, not just aligned text."
        )

    return {"success": True, "downloadUrl": f"/uploads/{out_name}"}


# ─── PDF PASSWORD PROTECT ────────────────────────────────────────────────────

@router.post("/pdf-protect")
def pdf_protect(
    file: Optional[UploadFile] = File(default=None),
    url: Optional[str] = Form(default=None),
    password: str = Form(...)
):
    """
    Encrypt a PDF with a user password.
    """
    if not password or not password.strip():
        raise HTTPException(status_code=400, detail="Password is required.")
        
    in_path = get_file_or_url(file, url, suffix=".pdf")
    
    # Read the original PDF
    reader = PdfReader(in_path)
    if reader.is_encrypted:
        raise HTTPException(status_code=400, detail="Document is already encrypted.")
        
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
        
    if reader.metadata:
        writer.add_metadata(reader.metadata)
        
    # Encrypt with AES-256
    writer.encrypt(user_password=password, owner_password=None, algorithm="AES-256")
    
    out_name = f"protected_{uuid.uuid4().hex[:8]}_AllTools.pdf"
    out_path = os.path.join(UPLOAD_DIR, out_name)
    with open(out_path, "wb") as f:
        writer.write(f)
        
    return {"success": True, "downloadUrl": f"/uploads/{out_name}"}


# ─── PDF PASSWORD UNLOCK ─────────────────────────────────────────────────────

@router.post("/pdf-unlock")
def pdf_unlock(
    file: Optional[UploadFile] = File(default=None),
    url: Optional[str] = Form(default=None),
    password: str = Form(...)
):
    """
    Remove password protection from an encrypted PDF.
    """
    if not password or not password.strip():
        raise HTTPException(status_code=400, detail="Password is required to unlock.")
        
    in_path = get_file_or_url(file, url, suffix=".pdf")
    
    reader = PdfReader(in_path)
    if not reader.is_encrypted:
        raise HTTPException(status_code=400, detail="Document is not encrypted.")
        
    # Attempt to decrypt
    decrypt_result = reader.decrypt(password)
    
    # decrypt() returns 0 for failure, 1 for user password match, 2 for owner password match
    if decrypt_result == 0:
        raise HTTPException(status_code=401, detail="Incorrect password. Cannot unlock PDF.")
        
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
        
    if reader.metadata:
        writer.add_metadata(reader.metadata)
        
    out_name = f"unlocked_{uuid.uuid4().hex[:8]}_AllTools.pdf"
    out_path = os.path.join(UPLOAD_DIR, out_name)
    with open(out_path, "wb") as f:
        writer.write(f)
        
    return {"success": True, "downloadUrl": f"/uploads/{out_name}"}


