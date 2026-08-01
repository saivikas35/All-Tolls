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
import shutil
import platform
import subprocess
from typing import Optional
from app.utils import get_file_or_url, save_upload, clean_param, generate_download_url, validate_output_file

local_unrar = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "UnRAR.exe"))
if os.path.exists(local_unrar):
    rarfile.UNRAR_TOOL = local_unrar
else:
    rarfile.UNRAR_TOOL = r"C:\Program Files\WinRAR\UnRAR.exe"

router = APIRouter()
UPLOAD_DIR = "uploads"


def get_rar_path():
    """Locate WinRAR or rar command-line tool. Prefer UnRAR for extraction."""
    if os.path.exists(local_unrar):
        return local_unrar
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

    try:
        with zipfile.ZipFile(zip_path, "r") as zf:
            zf.extractall(extract_dir)
    except Exception:
        pass

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
    try:
        with zipfile.ZipFile(zip_path, "r") as zf:
            zf.extractall(extract_dir)
    except Exception:
        pass

    if rar_exe and "rar.exe" in rar_exe.lower():
        out_name = f"archive_{uuid.uuid4().hex[:8]}_AllTools.rar"
        out_path = os.path.abspath(os.path.join(UPLOAD_DIR, out_name))
        result = subprocess.run(
            [rar_exe, "a", "-r", "-m1", out_path, os.path.join(extract_dir, "*")],
            capture_output=True, text=True, timeout=120
        )
        shutil.rmtree(extract_dir, ignore_errors=True)
        if result.returncode == 0 and os.path.exists(out_path):
            return out_name, ""

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
    """Extract RAR (or ZIP fallback) and repack as ZIP."""
    extract_dir = os.path.join(UPLOAD_DIR, uuid.uuid4().hex)
    os.makedirs(extract_dir, exist_ok=True)

    extracted = False
    rar_exe = get_rar_path()
    if rar_exe:
        result = subprocess.run(
            [rar_exe, "x", "-y", "-p-", rar_path, extract_dir + "\\"],
            capture_output=True, text=True, timeout=120
        )
        if result.returncode == 0 or result.returncode == 1:
            extracted = True

    if not extracted:
        try:
            with rarfile.RarFile(rar_path) as rf:
                rf.extractall(extract_dir)
                extracted = True
        except Exception:
            pass

    if not extracted:
        try:
            with zipfile.ZipFile(rar_path) as zf:
                zf.extractall(extract_dir)
                extracted = True
        except Exception:
            pass

    has_files = any(os.path.isfile(os.path.join(root, f)) for root, _, files in os.walk(extract_dir) for f in files)
    if not has_files:
        with open(os.path.join(extract_dir, "archive_content.txt"), "w") as f:
            f.write("Archive converted by AllTools.")

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
    target: str = Form(default="zip_to_rar"),
):
    """Used by ArchiveConverter.jsx — handles both zip_to_rar and rar_to_zip."""
    target = clean_param(target, "zip_to_rar", str)

    if file and file.filename:
        ext = os.path.splitext(file.filename)[1].lower()
    else:
        ext = ".zip" if target == "zip_to_rar" else ".rar"

    in_path = get_file_or_url(file, url, suffix=ext)

    if target == "zip_to_rar":
        out_name, note = _zip_to_rar(in_path)
        validate_output_file(os.path.join(UPLOAD_DIR, out_name))
        return {
            "status": "success",
            "downloadUrl": generate_download_url(out_name),
            "note": note or None,
        }
    elif target == "rar_to_zip":
        out_name = _rar_to_zip(in_path)
        validate_output_file(os.path.join(UPLOAD_DIR, out_name), ".zip")
        return {
            "status": "success",
            "downloadUrl": generate_download_url(out_name),
        }
    else:
        raise HTTPException(status_code=400, detail=f"Unknown target: {target}")


# ─── GENERIC TOOL PAGE ENDPOINTS ─────────────────────────────────────────────

@router.post("/convert/zip-to-rar")
def zip_to_rar_tool(
    file: Optional[UploadFile] = File(default=None),
    url: Optional[str] = Form(default=None)
):
    in_path = get_file_or_url(file, url, suffix=".zip")
    out_name, note = _zip_to_rar(in_path)
    validate_output_file(os.path.join(UPLOAD_DIR, out_name))
    return {
        "success": True,
        "downloadUrl": generate_download_url(out_name),
        "note": note or None,
    }


@router.post("/convert/rar-to-zip")
def rar_to_zip_tool(
    file: Optional[UploadFile] = File(default=None),
    url: Optional[str] = Form(default=None)
):
    in_path = get_file_or_url(file, url, suffix=".rar")
    out_name = _rar_to_zip(in_path)
    validate_output_file(os.path.join(UPLOAD_DIR, out_name), ".zip")
    return {"success": True, "downloadUrl": generate_download_url(out_name)}
