import sys
import time as _time
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

_START_TIME = _time.time()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Existing routes
from app.routes.convert import router as convert_router
from app.routes.images import router as images_router

# New routes
from app.routes.pdf_ops import router as pdf_ops_router
from app.routes.pdf_convert import router as pdf_convert_router
from app.routes.office import router as office_router
from app.routes.html_pdf import router as html_pdf_router
from app.routes.archives import router as archives_router

import os

app = FastAPI(title="AllTools Backend")

# CORS — allow all origins for dev; restrict for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads folder exists
os.makedirs("uploads", exist_ok=True)

from app.utils import cleanup_old_uploads

@app.on_event("startup")
def startup_cleanup():
    removed = cleanup_old_uploads(max_age_hours=1.0)
    if removed > 0:
        print(f"[AllTools Startup] Cleaned up {removed} stale uploaded file(s).")

# Static file serving (so /uploads/<file> works)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ─── Existing routes ──────────────────────────────────────────────────────────
app.include_router(convert_router, prefix="/api/convert")       # pdf-to-word
app.include_router(images_router, prefix="/api/convert")        # image conversions

# ─── PDF Operations ───────────────────────────────────────────────────────────
app.include_router(pdf_ops_router, prefix="/api/convert")       # merge, split, remove, compress

# ─── PDF ↔ Image & OCR ───────────────────────────────────────────────────────
app.include_router(pdf_convert_router, prefix="/api/convert")   # pdf-to-jpg, jpg-to-pdf, ocr

# ─── Office → PDF ────────────────────────────────────────────────────────────
app.include_router(office_router, prefix="/api/convert")        # word, ppt, excel → pdf

# ─── HTML → PDF ──────────────────────────────────────────────────────────────
app.include_router(html_pdf_router, prefix="/api/convert")      # html-to-pdf

# ─── Archives ────────────────────────────────────────────────────────────────
app.include_router(archives_router, prefix="/api")              # /api/archive/convert + /api/convert/zip-rar

# ─── Feedback ────────────────────────────────────────────────────────────────
from app.routes.feedback import router as feedback_router
app.include_router(feedback_router, prefix="/api")              # /api/feedback

from fastapi.responses import FileResponse
import re
from typing import Optional
from urllib.parse import quote

@app.get("/api/download/{filename}")
def download_file(filename: str, name: Optional[str] = None):
    """Force download with proper MIME type, Content-Length, path traversal protection, and RFC-5987 filename header."""
    # Prevent path traversal attacks
    safe_filename = os.path.basename(filename)
    file_path = os.path.join("uploads", safe_filename)
    
    if not os.path.exists(file_path) or os.path.getsize(file_path) == 0:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="File not found or empty")

    ext = os.path.splitext(safe_filename)[1].lower()
    media_types = {
        ".pdf":  "application/pdf",
        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ".jpg":  "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png":  "image/png",
        ".webp": "image/webp",
        ".zip":  "application/zip",
        ".rar":  "application/vnd.rar",
        ".7z":   "application/x-7z-compressed",
        ".txt":  "text/plain; charset=utf-8",
    }
    media_type = media_types.get(ext, "application/octet-stream")

    # Determine user-friendly download filename
    if name and name.strip():
        download_name = name.strip()
        # Ensure extension is present
        if not os.path.splitext(download_name)[1] and ext:
            download_name += ext
    else:
        base = os.path.splitext(safe_filename)[0]
        # If the file already starts with AllTools_ or clean name, preserve it
        clean_base = re.sub(r'^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}_?', '', base)
        clean_base = re.sub(r'^[a-f0-9]{32}_?', '', clean_base).strip('_').strip('-')
        # If clean_base lost prefix, make sure it has a proper name
        if not clean_base.strip():
            clean_base = "AllTools_Document"
        download_name = f"{clean_base}{ext}"

    # RFC 5987 encoding — safe for all characters including non-ASCII
    encoded_name = quote(download_name, safe="")
    content_disposition = (
        f'attachment; filename="{download_name}"; filename*=UTF-8\'\'{encoded_name}'
    )

    file_size = os.path.getsize(file_path)

    return FileResponse(
        path=file_path,
        media_type=media_type,
        headers={
            "Content-Disposition": content_disposition,
            "Content-Length": str(file_size),
        },
    )


@app.get("/")
def root():
    return {"status": "Backend running", "version": "2.0"}


@app.get("/api/health")
def health_check():
    """Health check endpoint — returns uptime, upload folder stats, and version."""
    uptime_seconds = int(_time.time() - _START_TIME)
    hours, remainder = divmod(uptime_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)

    upload_dir = "uploads"
    file_count = 0
    total_size_bytes = 0
    if os.path.exists(upload_dir):
        for f in os.listdir(upload_dir):
            fp = os.path.join(upload_dir, f)
            if os.path.isfile(fp):
                file_count += 1
                total_size_bytes += os.path.getsize(fp)

    return {
        "status": "ok",
        "version": "2.0",
        "uptime": f"{hours}h {minutes}m {seconds}s",
        "uptime_seconds": uptime_seconds,
        "uploads": {
            "file_count": file_count,
            "total_size_mb": round(total_size_bytes / 1024 / 1024, 2),
        },
    }
