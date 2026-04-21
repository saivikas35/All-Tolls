"""
Office document → PDF conversion using LibreOffice.
Supports: Word (.docx/.doc), PowerPoint (.pptx/.ppt), Excel (.xlsx/.xls)
Falls back to a helpful error if LibreOffice is not installed.
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
import subprocess
import os
import uuid
import shutil
import platform
from typing import Optional
from app.utils import get_file_or_url, save_upload

router = APIRouter()
UPLOAD_DIR = "uploads"


def get_soffice_path():
    """Find LibreOffice executable path."""
    env_path = os.getenv("SOFFICE_PATH")
    if env_path and os.path.exists(env_path):
        return env_path

    if platform.system() == "Windows":
        possible_paths = [
            r"C:\Program Files\LibreOffice\program\soffice.exe",
            r"C:\Program Files (x86)\LibreOffice\program\soffice.exe",
            r"C:\Program Files\LibreOffice 7\program\soffice.exe",
            r"C:\Program Files\LibreOffice 6\program\soffice.exe",
        ]
        for path in possible_paths:
            if os.path.exists(path):
                return path
        return None  # Not found

    # Linux/Mac
    return shutil.which("soffice") or shutil.which("libreoffice")


def _convert_to_pdf_via_libreoffice(input_path: str) -> str:
    """Run LibreOffice headless to convert to PDF. Returns output PDF path."""
    soffice = get_soffice_path()
    if not soffice:
        raise HTTPException(
            status_code=503,
            detail=(
                "LibreOffice is not installed on this server. "
                "Please install LibreOffice to use Office-to-PDF conversions. "
                "Download from: https://www.libreoffice.org/download/download-libreoffice/"
            ),
        )

    out_dir = os.path.abspath(UPLOAD_DIR)
    result = subprocess.run(
        [
            soffice,
            "--headless",
            "--convert-to", "pdf",
            "--outdir", out_dir,
            os.path.abspath(input_path),
        ],
        capture_output=True,
        text=True,
        timeout=120,
    )

    if result.returncode != 0:
        raise HTTPException(
            status_code=500,
            detail=f"LibreOffice conversion failed: {result.stderr or result.stdout}"
        )

    # LibreOffice outputs <input_basename>.pdf in out_dir
    base = os.path.splitext(os.path.basename(input_path))[0]
    out_pdf = os.path.join(out_dir, f"{base}.pdf")
    if not os.path.exists(out_pdf):
        raise HTTPException(status_code=500, detail="Conversion produced no output file.")

    # Rename with unique identifier
    unique_name = f"{uuid.uuid4().hex[:8]}_{base}_AllTools.pdf"
    unique_path = os.path.join(out_dir, unique_name)
    os.rename(out_pdf, unique_path)
    return unique_name


def _prepare_excel_for_pdf(input_path: str):
    """Modify Excel to fit to 1 page wide for better PDF output."""
    try:
        import openpyxl
        wb = openpyxl.load_workbook(input_path)
        for sheet in wb.worksheets:
            sheet.page_setup.fitToWidth = 1
            sheet.page_setup.fitToHeight = 0  # 0 means automatic
        wb.save(input_path)
    except Exception as e:
        print(f"Warning: Could not format Excel file with openpyxl: {e}")


# ─── WORD → PDF ───────────────────────────────────────────────────────────────

@router.post("/word-to-pdf")
def word_to_pdf(
    file: Optional[UploadFile] = File(default=None),
    url: Optional[str] = Form(default=None)
):
    """Convert Word document (.docx/.doc) to PDF."""
    allowed = (".docx", ".doc", ".odt", ".rtf")
    if file and file.filename:
        if not any(file.filename.lower().endswith(ext) for ext in allowed):
            raise HTTPException(status_code=400, detail="Supported formats: .docx, .doc, .odt, .rtf")
        ext = os.path.splitext(file.filename)[1].lower()
    else:
        # If url, assume docx as fallback extension
        ext = ".docx"

    in_path = get_file_or_url(file, url, suffix=ext)
    out_name = _convert_to_pdf_via_libreoffice(in_path)
    return {"success": True, "downloadUrl": f"/uploads/{out_name}"}


# ─── POWERPOINT → PDF ─────────────────────────────────────────────────────────

@router.post("/ppt-to-pdf")
def ppt_to_pdf(
    file: Optional[UploadFile] = File(default=None),
    url: Optional[str] = Form(default=None)
):
    """Convert PowerPoint presentation (.pptx/.ppt) to PDF."""
    allowed = (".pptx", ".ppt", ".odp")
    if file and file.filename:
        if not any(file.filename.lower().endswith(ext) for ext in allowed):
            raise HTTPException(status_code=400, detail="Supported formats: .pptx, .ppt, .odp")
        ext = os.path.splitext(file.filename)[1].lower()
    else:
        ext = ".pptx"

    in_path = get_file_or_url(file, url, suffix=ext)
    out_name = _convert_to_pdf_via_libreoffice(in_path)
    return {"success": True, "downloadUrl": f"/uploads/{out_name}"}


# ─── EXCEL → PDF ──────────────────────────────────────────────────────────────

@router.post("/excel-to-pdf")
def excel_to_pdf(
    file: Optional[UploadFile] = File(default=None),
    url: Optional[str] = Form(default=None)
):
    """Convert Excel spreadsheet (.xlsx/.xls) to PDF."""
    allowed = (".xlsx", ".xls", ".ods", ".csv")
    if file and file.filename:
        if not any(file.filename.lower().endswith(ext) for ext in allowed):
            raise HTTPException(status_code=400, detail="Supported formats: .xlsx, .xls, .ods, .csv")
        ext = os.path.splitext(file.filename)[1].lower()
    else:
        ext = ".xlsx"

    in_path = get_file_or_url(file, url, suffix=ext)
    if ext == ".xlsx":
        _prepare_excel_for_pdf(in_path)
    out_name = _convert_to_pdf_via_libreoffice(in_path)
    return {"success": True, "downloadUrl": f"/uploads/{out_name}"}
