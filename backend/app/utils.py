import os
import uuid
import requests
from fastapi import UploadFile, HTTPException
from typing import Optional

UPLOAD_DIR = "uploads"

import shutil

def save_upload(file: UploadFile, suffix: str = ".pdf") -> str:
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}{suffix}")
    with open(path, "wb") as f:
        file.file.seek(0)
        shutil.copyfileobj(file.file, f)
    return path

def get_file_or_url(file: Optional[UploadFile], url: Optional[str], suffix: str = ".pdf") -> str:
    if file and file.filename:
        if not file.filename.lower().endswith(suffix) and suffix != "":
            # Special logic: if suffix is empty, accept any file. If it ends with suffix, accept.
            # But let's simplify and just check extension if strict.
            pass # We'll let specific endpoints validate if they want to be strict
        return save_upload(file, suffix)
    elif url and url.strip():
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}{suffix}")
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
