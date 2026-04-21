"""
Archive conversion routes.
- /api/archive/convert  — used by ArchiveConverter.jsx (dedicated archive page)
- /api/convert/zip-to-rar — used by generic tool page
- /api/convert/rar-to-zip — used by generic tool page

ZIP ↔ 7Z: uses py7zr (pure Python, no external tools)
ZIP → RAR / RAR → ZIP: tries WinRAR binary; falls back to 7Z with a note
"""
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import zipfile
import py7zr
import rarfile
import os
import uuid

rarfile.UNRAR_TOOL = r"C:\Program Files\WinRAR\UnRAR.exe"
import shutil
import platform
import subprocess
from typing import Optional
from app.utils import get_file_or_url, save_upload

router = APIRouter()
UPLOAD_DIR = "uploads"


def get_rar_path():
    """Locate WinRAR or rar command-line tool. Prefer UnRAR for extraction."""
    if platform.system() == "Windows":
        candidates = [
            r"C:\Program Files\WinRAR\UnRAR.exe",
            r"C:\Program Files\WinRAR\rar.exe",
            r"C:\Program Files (x86)\WinRAR\rar.exe",
            r"C:\Program Files\WinRAR\WinRAR.exe",
        ]
        for p in candidates:
            if os.path.exists(p):
                return p
    return shutil.which("rar")




def _zip_to_7z(zip_path: str) -> tuple[str, str]:
    """Extract ZIP and repack as 7Z. Returns (filename, note)."""
    extract_dir = os.path.join(UPLOAD_DIR, uuid.uuid4().hex)
    os.makedirs(extract_dir, exist_ok=True)

    with zipfile.ZipFile(zip_path, "r") as zf:
        zf.extractall(extract_dir)

    out_name = f"archive_{uuid.uuid4().hex[:8]}_AllTools.7z"
    out_path = os.path.join(UPLOAD_DIR, out_name)
    with py7zr.SevenZipFile(out_path, "w") as sz:
        for root, dirs, files in os.walk(extract_dir):
            for fname in files:
                fpath = os.path.join(root, fname)
                arcname = os.path.relpath(fpath, extract_dir)
                sz.write(fpath, arcname)

    shutil.rmtree(extract_dir, ignore_errors=True)
    return out_name, "WinRAR not installed — converted to .7z format (compatible with 7-Zip and WinRAR)"


def _zip_to_rar(zip_path: str) -> tuple[str, str]:
    """Try to convert ZIP to RAR using WinRAR; fallback to 7Z."""
    rar_exe = get_rar_path()

    extract_dir = os.path.join(UPLOAD_DIR, uuid.uuid4().hex)
    os.makedirs(extract_dir, exist_ok=True)
    with zipfile.ZipFile(zip_path, "r") as zf:
        zf.extractall(extract_dir)

    if rar_exe:
        out_name = f"archive_{uuid.uuid4().hex[:8]}_AllTools.rar"
        out_path = os.path.abspath(os.path.join(UPLOAD_DIR, out_name))
        result = subprocess.run(
            [rar_exe, "a", "-r", "-m1", out_path, os.path.join(extract_dir, "*")],
            capture_output=True, text=True, timeout=120
        )
        shutil.rmtree(extract_dir, ignore_errors=True)
        if result.returncode == 0 and os.path.exists(out_path):
            return out_name, ""
        # WinRAR failed — fall back to 7Z

    # Fallback: repack as 7Z
    out_name = f"archive_{uuid.uuid4().hex[:8]}_AllTools.7z"
    out_path = os.path.join(UPLOAD_DIR, out_name)
    with py7zr.SevenZipFile(out_path, "w") as sz:
        for root, dirs, files in os.walk(extract_dir):
            for fname in files:
                fpath = os.path.join(root, fname)
                arcname = os.path.relpath(fpath, extract_dir)
                sz.write(fpath, arcname)

    shutil.rmtree(extract_dir, ignore_errors=True)
    return out_name, "WinRAR not installed — converted to .7z format (compatible with WinRAR and 7-Zip)"


def _rar_to_zip(rar_path: str) -> str:
    """Extract RAR and repack as ZIP using fast compression."""
    extract_dir = os.path.join(UPLOAD_DIR, uuid.uuid4().hex)
    os.makedirs(extract_dir, exist_ok=True)

    rar_exe = get_rar_path()
    if rar_exe:
        # Extract the RAR file to the extract directory using UnRAR/WinRAR. -p- disables password prompts.
        result = subprocess.run(
            [rar_exe, "x", "-y", "-p-", rar_path, extract_dir + "\\"],
            capture_output=True, text=True, timeout=120
        )
        if result.returncode != 0 and result.returncode != 1: # 1 is non-fatal warning
             err_out = result.stderr.strip() or result.stdout.strip()
             shutil.rmtree(extract_dir, ignore_errors=True)
             
             error_details = f"WinRAR returned code {result.returncode}."
             if "password" in err_out.lower() or result.returncode == 11:
                 error_details = "Archive is password protected, which is not supported."
             elif "corrupt" in err_out.lower() or result.returncode == 3:
                 error_details = "The RAR archive is corrupted or invalid."

             raise HTTPException(
                status_code=500,
                detail=f"Could not extract RAR file. {error_details}"
             )
    else:
        # Fallback to rarfile if WinRAR binary isn't detected (shouldn't happen on this setup)
        try:
            with rarfile.RarFile(rar_path) as rf:
                rf.extractall(extract_dir)
        except Exception as e:
            shutil.rmtree(extract_dir, ignore_errors=True)
            raise HTTPException(
                status_code=500,
                detail=f"Could not open RAR file: {str(e)}."
            )

    out_name = f"archive_{uuid.uuid4().hex[:8]}_AllTools.zip"
    out_path = os.path.join(UPLOAD_DIR, out_name)
    with zipfile.ZipFile(out_path, "w", zipfile.ZIP_DEFLATED, compresslevel=1) as zf:
        for root, dirs, files in os.walk(extract_dir):
            for fname in files:
                fpath = os.path.join(root, fname)
                arcname = os.path.relpath(fpath, extract_dir)
                zf.write(fpath, arcname)

    shutil.rmtree(extract_dir, ignore_errors=True)
    return out_name


# ─── DEDICATED ARCHIVE PAGE ENDPOINT ─────────────────────────────────────────

@router.post("/archive/convert")
def archive_convert(
    file: Optional[UploadFile] = File(default=None),
    url: Optional[str] = Form(default=None),
    target: str = Form(...),
):
    """Used by ArchiveConverter.jsx — handles both zip_to_rar and rar_to_zip."""
    if target == "zip_to_rar":
        expected_ext = ".zip"
    elif target == "rar_to_zip":
        expected_ext = ".rar"
    else:
        raise HTTPException(status_code=400, detail=f"Unknown target: {target}")

    if file and file.filename:
        ext = os.path.splitext(file.filename)[1].lower()
        if ext != expected_ext:
            raise HTTPException(status_code=400, detail=f"Please upload a {expected_ext} file.")
    else:
        ext = expected_ext

    in_path = get_file_or_url(file, url, suffix=ext)

    if target == "zip_to_rar":
        out_name, note = _zip_to_rar(in_path)
        return {
            "status": "success",
            "downloadUrl": f"/uploads/{out_name}",
            "note": note or None,
        }

    elif target == "rar_to_zip":
        out_name = _rar_to_zip(in_path)
        return {
            "status": "success",
            "downloadUrl": f"/uploads/{out_name}",
        }

    else:
        raise HTTPException(status_code=400, detail=f"Unknown target: {target}")


# ─── GENERIC TOOL PAGE ENDPOINTS ─────────────────────────────────────────────

@router.post("/convert/zip-to-rar")
def zip_to_rar_tool(
    file: Optional[UploadFile] = File(default=None),
    url: Optional[str] = Form(default=None)
):
    """Used by generic tool page at /convert/zip-to-rar."""
    if file and file.filename and not file.filename.lower().endswith(".zip"):
        raise HTTPException(status_code=400, detail="Only .zip files allowed.")
    
    in_path = get_file_or_url(file, url, suffix=".zip")
    out_name, note = _zip_to_rar(in_path)
    return {
        "success": True,
        "downloadUrl": f"/uploads/{out_name}",
        "note": note or None,
    }


@router.post("/convert/rar-to-zip")
def rar_to_zip_tool(
    file: Optional[UploadFile] = File(default=None),
    url: Optional[str] = Form(default=None)
):
    """Used by generic tool page at /convert/rar-to-zip."""
    if file and file.filename and not file.filename.lower().endswith(".rar"):
        raise HTTPException(status_code=400, detail="Only .rar files allowed.")
    
    in_path = get_file_or_url(file, url, suffix=".rar")
    out_name = _rar_to_zip(in_path)
    return {"success": True, "downloadUrl": f"/uploads/{out_name}"}
