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
from app.utils import get_file_or_url, save_upload, clean_param

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
    split_mode: str = Form(default="separate"),
):
    pdfToken = clean_param(pdfToken, None, str)
    pages = clean_param(pages, "", str)
    split_mode = clean_param(split_mode, "separate", str)

    if pdfToken:
        in_path = os.path.join(UPLOAD_DIR, os.path.basename(pdfToken))
        if not os.path.exists(in_path):
            raise HTTPException(status_code=400, detail="Preview session expired. Please re-upload.")
    else:
        in_path = get_file_or_url(file, url)
        
    reader = PdfReader(in_path)
    total = len(reader.pages)

    if split_mode == "merge":
        writer = PdfWriter()
        if not pages.strip():
             raise HTTPException(status_code=400, detail="No pages selected.")
        page_nums = _parse_page_ranges(pages, total)
        for pn in page_nums:
             writer.add_page(reader.pages[pn])
             
        out_name = f"split_merged_{uuid.uuid4().hex[:8]}_AllTools.pdf"
        out_path = os.path.join(UPLOAD_DIR, out_name)
        with open(out_path, "wb") as pf:
            writer.write(pf)
        return {"success": True, "downloadUrl": f"/uploads/{out_name}"}

    zip_name = f"split_{uuid.uuid4().hex[:8]}_AllTools.zip"
    zip_path = os.path.join(UPLOAD_DIR, zip_name)

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        if split_mode == "separate":
            if not pages.strip():
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
    pages: str = Form(default=""),
):
    pages = clean_param(pages, "", str)
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
    in_path = get_file_or_url(file, url)
    reader = PdfReader(in_path)
    writer = PdfWriter()

    for page in reader.pages:
        writer.add_page(page)
        
    for page in writer.pages:
        page.compress_content_streams()

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
    in_path = get_file_or_url(file, url, suffix=".pdf")
    out_name = f"excel_{uuid.uuid4().hex[:8]}_AllTools.xlsx"
    out_path = os.path.join(UPLOAD_DIR, out_name)

    extracted_tables = []
    with pdfplumber.open(in_path) as pdf:
        for page_num, page in enumerate(pdf.pages):
            tables = page.extract_tables()
            for table_idx, table in enumerate(tables):
                if not table:
                    continue
                sheet_name = f"Page {page_num + 1} - Tbl {table_idx + 1}"[:31]
                extracted_tables.append((sheet_name, table))

    if not extracted_tables:
        # Fallback: Extract text lines page-by-page into spreadsheet rows
        extracted_tables = []
        doc = fitz.open(in_path)
        for page_num, page in enumerate(doc):
            lines = [line.strip() for line in page.get_text("text").split("\n") if line.strip()]
            if lines:
                table_data = [["Line Content"]] + [[line] for line in lines]
                sheet_name = f"Page {page_num + 1}"[:31]
                extracted_tables.append((sheet_name, table_data))
        doc.close()

    if not extracted_tables:
        # Final fallback: create empty sheet with note
        extracted_tables = [("Sheet1", [["Content"], ["No text or tables found in PDF"]])]

    with pd.ExcelWriter(out_path, engine="openpyxl") as writer:
        for sheet_name, table in extracted_tables:
            df = pd.DataFrame(table)
            df.to_excel(writer, sheet_name=sheet_name, index=False, header=False)

    return {"success": True, "downloadUrl": f"/uploads/{out_name}"}


# ─── PDF PASSWORD PROTECT ────────────────────────────────────────────────────

@router.post("/pdf-protect")
def pdf_protect(
    file: Optional[UploadFile] = File(default=None),
    url: Optional[str] = Form(default=None),
    password: str = Form(default="")
):
    password = clean_param(password, "", str)
    if not password or not password.strip():
        raise HTTPException(status_code=400, detail="Password is required.")
        
    in_path = get_file_or_url(file, url, suffix=".pdf")
    
    reader = PdfReader(in_path)
    if reader.is_encrypted:
        raise HTTPException(status_code=400, detail="Document is already encrypted.")
        
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
        
    if reader.metadata:
        writer.add_metadata(reader.metadata)
        
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
    password: str = Form(default="")
):
    password = clean_param(password, "", str)
    in_path = get_file_or_url(file, url, suffix=".pdf")
    
    reader = PdfReader(in_path)
    if not reader.is_encrypted:
        # Document is not password protected — return copy as unlocked
        writer = PdfWriter()
        for page in reader.pages:
            writer.add_page(page)
        out_name = f"unlocked_{uuid.uuid4().hex[:8]}_AllTools.pdf"
        out_path = os.path.join(UPLOAD_DIR, out_name)
        with open(out_path, "wb") as f:
            writer.write(f)
        return {"success": True, "downloadUrl": f"/uploads/{out_name}", "note": "Document was not password protected."}
        
    if not password or not password.strip():
        raise HTTPException(status_code=400, detail="Password is required to unlock.")

    decrypt_result = reader.decrypt(password)
    
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



