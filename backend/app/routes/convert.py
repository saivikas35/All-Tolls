from fastapi import APIRouter, UploadFile, File, HTTPException
import subprocess
import os
import uuid
import shutil
import platform
from pdf2docx import Converter
from app.pymupdf_converter import convert_pdf_to_word_pymupdf
from app.pdf_cleaner import clean_docx_paragraphs
from docx import Document
from app.header_fixer import fix_header_formatting

router = APIRouter()

UPLOAD_DIR = "uploads"


def get_soffice_path():
    # 1. Environment variable (Docker / Linux servers)
    env_path = os.getenv("SOFFICE_PATH")
    if env_path:
        return env_path

    # 2. Windows fallback paths
    if platform.system() == "Windows":
        possible_paths = [
            r"C:\Program Files\LibreOffice\program\soffice.exe",
            r"C:\Program Files (x86)\LibreOffice\program\soffice.exe",
        ]
        for path in possible_paths:
            if os.path.exists(path):
                return path

    # 3. Linux default
    return "soffice"


@router.post("/pdf-to-word")
async def pdf_to_word(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # ---------- Filename handling ----------
    original_name = os.path.splitext(file.filename)[0]
    safe_name = original_name.replace(" ", "_") + "_AllTools"

    input_pdf = os.path.join(
        UPLOAD_DIR,
        f"{uuid.uuid4()}_{safe_name}.pdf"
    )

    output_docx = os.path.join(
        UPLOAD_DIR,
        f"{safe_name}_AllTools.docx"
    )

    # ---------- Save uploaded file ----------
    with open(input_pdf, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # ========== PDF2DOCX APPROACH (No LibreOffice Required) ==========
    print("[DEBUG] === PDF Conversion Starting ===")
    print(f"[DEBUG] Input: {input_pdf}")
    print(f"[DEBUG] Output: {output_docx}")
    
    # ---------- Using pdf2docx library ----------
    print("[DEBUG] Attempting pdf2docx conversion...")
    try:
        converter = Converter(input_pdf)
        converter.convert(output_docx)
        converter.close()
        print("[DEBUG] ✅ pdf2docx conversion succeeded!")
        
        # Apply smart header formatting (only fixes name capitalization)
        if os.path.exists(output_docx):
            try:
                print("[DEBUG] Applying header formatting fixes...")
                doc = Document(output_docx)
                doc = fix_header_formatting(doc)
                doc.save(output_docx)
                print("[DEBUG] ✅ Header formatting complete!")
            except Exception as e:
                print(f"[DEBUG] Header formatting failed (non-critical): {e}")
        
        if os.path.exists(output_docx):
            return {
                "success": True,
                "engine": "pdf2docx",
                "downloadUrl": f"/uploads/{os.path.basename(output_docx)}",
            }
    except Exception as e:
        print(f"[DEBUG] pdf2docx failed with exception: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"PDF conversion failed: {str(e)}"
        )
