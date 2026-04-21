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

@app.get("/api/download/{filename}")
def download_file(filename: str):
    """Force download instead of opening in browser"""
    file_path = os.path.join("uploads", filename)
    if not os.path.exists(file_path):
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(path=file_path, filename=filename, media_type="application/octet-stream")

@app.get("/")
def root():
    return {"status": "Backend running", "version": "2.0"}
