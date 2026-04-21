"""
PDF ↔ Image conversions.
- pdf-to-jpg: uses PyMuPDF (fitz) — already in requirements, no external deps
- jpg-to-pdf: uses Pillow — already in requirements
- pdf-ocr: uses PyMuPDF text extraction to build a text-layer PDF (no Tesseract)
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from PIL import Image
import fitz  # PyMuPDF
import os
import uuid
import zipfile
from typing import List, Optional
from app.utils import get_file_or_url, save_upload

router = APIRouter()
UPLOAD_DIR = "uploads"


# ─── PDF → JPG ──────────────────────────────────────────────────────────────

@router.post("/pdf-to-jpg")
def pdf_to_jpg(
    file: Optional[UploadFile] = File(default=None),
    url: Optional[str] = Form(default=None)
):
    """Convert each page of a PDF to a JPG. Returns a ZIP file if multiple pages."""
    in_path = get_file_or_url(file, url, suffix=".pdf")
    doc = fitz.open(in_path)

    if len(doc) == 0:
        raise HTTPException(status_code=400, detail="PDF has no pages.")

    image_paths = []
    for i, page in enumerate(doc):
        # 2x scale for good quality
        mat = fitz.Matrix(2.0, 2.0)
        pix = page.get_pixmap(matrix=mat)
        img_name = f"{uuid.uuid4().hex}_page_{i + 1}.jpg"
        img_path = os.path.join(UPLOAD_DIR, img_name)
        pix.save(img_path)
        image_paths.append((img_name, img_path))

    doc.close()

    if len(image_paths) == 1:
        # Single page — return image directly
        img_name, img_path = image_paths[0]
        return {"success": True, "downloadUrl": f"/uploads/{img_name}"}
    else:
        # Multiple pages — return ZIP
        zip_name = f"pdf_images_{uuid.uuid4().hex[:8]}_AllTools.zip"
        zip_path = os.path.join(UPLOAD_DIR, zip_name)
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
            for img_name, img_path in image_paths:
                zf.write(img_path, arcname=img_name)
        return {"success": True, "downloadUrl": f"/uploads/{zip_name}"}


# ─── JPG / IMAGE → PDF ───────────────────────────────────────────────────────

@router.post("/jpg-to-pdf")
def jpg_to_pdf(
    files: Optional[List[UploadFile]] = File(default=None),
    url: Optional[str] = Form(default=None)
):
    """Convert one or more images (JPG, PNG, WEBP) to a single PDF."""
    allowed = (".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff")
    images = []

    if files and files[0].filename:
        for f in files:
            if not any(f.filename.lower().endswith(ext) for ext in allowed):
                raise HTTPException(
                    status_code=400,
                    detail=f"{f.filename} is not a supported image format."
                )
            ext = os.path.splitext(f.filename)[1].lower()
            path = save_upload(f, suffix=ext)
            img = Image.open(path).convert("RGB")
            images.append(img)
    elif url and url.strip():
        # URL case - only 1 image provided via link
        path = get_file_or_url(None, url, suffix=".jpg") # Fallback to .jpg
        img = Image.open(path).convert("RGB")
        images.append(img)
    else:
        raise HTTPException(status_code=400, detail="Provide valid image files or a URL.")

    if not images:
        raise HTTPException(status_code=400, detail="No valid images provided.")

    out_name = f"images_to_pdf_{uuid.uuid4().hex[:8]}_AllTools.pdf"
    out_path = os.path.join(UPLOAD_DIR, out_name)

    # Save as PDF: first image is the base, rest are appended
    images[0].save(
        out_path,
        format="PDF",
        save_all=True,
        append_images=images[1:],
    )

    return {"success": True, "downloadUrl": f"/uploads/{out_name}"}


# ─── PDF OCR ─────────────────────────────────────────────────────────────────

@router.post("/pdf-ocr")
def pdf_ocr(
    file: Optional[UploadFile] = File(default=None),
    url: Optional[str] = Form(default=None)
):
    """
    Extract text from PDF using PyMuPDF's built-in text layer.
    Returns a plain-text .txt file with all extracted text.
    Works without Tesseract for digitally-created PDFs.
    """
    in_path = get_file_or_url(file, url, suffix=".pdf")
    doc = fitz.open(in_path)

    all_text = []
    for i, page in enumerate(doc):
        text = page.get_text("text")
        all_text.append(f"--- Page {i + 1} ---\n{text}")

    doc.close()

    full_text = "\n\n".join(all_text)
    if not full_text.strip():
        full_text = "[No text could be extracted. The PDF may be image-based. Consider a scanned PDF OCR tool.]"

    out_name = f"ocr_text_{uuid.uuid4().hex[:8]}_AllTools.txt"
    out_path = os.path.join(UPLOAD_DIR, out_name)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(full_text)

    return {"success": True, "downloadUrl": f"/uploads/{out_name}"}


# ─── EXTRACT TEXT (for ATS Score) ────────────────────────────────────────────

@router.post("/extract-text")
def extract_text(
    file: Optional[UploadFile] = File(default=None),
    url: Optional[str] = Form(default=None)
):
    """
    Extract raw text from PDF or DOCX files.
    Returns JSON with the 'text' content, not a file download.
    Useful for ATS parsing in the browser.
    """
    if file and file.filename:
        ext = os.path.splitext(file.filename)[1].lower()
    else:
        # Fallback if no file (url provided)
        ext = ".pdf"
        
    if ext not in (".pdf", ".docx"):
        raise HTTPException(status_code=400, detail="Only .pdf and .docx files are supported for text extraction.")

    in_path = get_file_or_url(file, url, suffix=ext)
    
    extracted_text = ""
    try:
        if ext == ".pdf":
            doc = fitz.open(in_path)
            for page in doc:
                extracted_text += page.get_text("text") + "\n"
            doc.close()
        elif ext == ".docx":
            import docx
            doc = docx.Document(in_path)
            extracted_text = "\n".join([para.text for para in doc.paragraphs])
            
        if not extracted_text.strip():
            raise ValueError("No text could be found in the document.")
            
        return {
            "success": True,
            "text": extracted_text.strip()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text extraction failed: {str(e)}")
