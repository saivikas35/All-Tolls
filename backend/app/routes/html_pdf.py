"""
HTML → PDF conversion using Playwright.
Provides a modern headless chromium engine for 100% accurate rendering.
"""
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from playwright.sync_api import sync_playwright
import os
import uuid
from typing import Optional
from app.utils import get_file_or_url

router = APIRouter()
UPLOAD_DIR = "uploads"


@router.post("/html-to-pdf")
def html_to_pdf(
    file: Optional[UploadFile] = File(default=None),
    url: Optional[str] = Form(default=None),
    html_content: str = Form(default=""),
):
    """
    Convert HTML to PDF.
    Accepts either:
    - An uploaded .html file, OR
    - A direct URL to fetch (if url provided and no file uploaded), OR
    - Raw HTML string via 'html_content' form field.
    """
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    out_name = f"converted_{uuid.uuid4().hex[:8]}_AllTools.pdf"
    out_path = os.path.join(UPLOAD_DIR, out_name)

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()

            if html_content.strip():
                # Render raw HTML string
                page.set_content(html_content, wait_until="load")
            elif url and not (file and file.filename):
                # Render external URL
                page.goto(url, wait_until="networkidle")
            else:
                # Render uploaded HTML file
                in_path = get_file_or_url(file, url, suffix=".html")
                abs_uri = f"file:///{os.path.abspath(in_path).replace(os.sep, '/')}"
                page.goto(abs_uri, wait_until="load")

            # Emulate print media type for best PDF results
            page.emulate_media(media="print")
            page.pdf(path=out_path, format="A4", print_background=True)
            browser.close()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"HTML to PDF conversion failed: {str(e)}"
        )

    return {"success": True, "downloadUrl": f"/uploads/{out_name}"}
