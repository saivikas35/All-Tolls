import os
import uuid
import requests
from fastapi import UploadFile, HTTPException
from typing import Optional

UPLOAD_DIR = "uploads"

import shutil

import re

def sanitize_filename(filename: str) -> str:
    name_without_ext = os.path.splitext(os.path.basename(filename))[0]
    clean_name = re.sub(r'[^a-zA-Z0-9_\-]', '_', name_without_ext).strip('_')
    return clean_name if clean_name else "file"

def save_upload(file: UploadFile, suffix: str = ".pdf") -> str:
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    ext = suffix if suffix else os.path.splitext(file.filename)[1]
    if not ext:
        ext = ".pdf"
    clean_name = sanitize_filename(file.filename)
    path = os.path.join(UPLOAD_DIR, f"{clean_name}_{uuid.uuid4().hex[:6]}{ext}")
    with open(path, "wb") as f:
        file.file.seek(0)
        shutil.copyfileobj(file.file, f)
    return path

def get_file_or_url(file: Optional[UploadFile], url: Optional[str], suffix: str = ".pdf") -> str:
    if file and file.filename:
        return save_upload(file, suffix)
    elif url and url.strip():
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        url_filename = url.strip().split("?")[0].split("/")[-1]
        clean_name = sanitize_filename(url_filename) if url_filename else "downloaded_file"
        ext = suffix if suffix else os.path.splitext(url_filename)[1]
        if not ext:
            ext = ".pdf"
        path = os.path.join(UPLOAD_DIR, f"{clean_name}_{uuid.uuid4().hex[:6]}{ext}")
        try:
            r = requests.get(url.strip(), stream=True, timeout=15)
            r.raise_for_status()
            with open(path, "wb") as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)
            return path
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to download URL: {str(e)}")
    else:
        raise HTTPException(status_code=400, detail="Please provide a file or a valid URL.")

def clean_param(val, default=None, cast_type=None):
    """Unwrap FastAPI Form default objects or empty strings and safely cast types."""
    from fastapi.params import Form
    if isinstance(val, Form):
        val = val.default
    if val is None or (isinstance(val, str) and not val.strip()):
        val = default
    if cast_type is not None and val is not None:
        try:
            val = cast_type(val)
        except (ValueError, TypeError):
            val = default
    return val

