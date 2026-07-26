"""
Comprehensive tool test against running backend at port 4000.
Tests all endpoints to check which ones work.
"""
import os
import io
import json
import time
import zipfile
import urllib.request
import urllib.error

BASE = "http://localhost:4000"

results = []

def log(name, status, detail=""):
    emoji = "[OK]" if status == "PASS" else "[FAIL]"
    print(f"{emoji} {name}: {status} {detail}")
    results.append({"tool": name, "status": status, "detail": detail})

# ─── Create test files in memory ──────────────────────────────────────────────

# Minimal valid PDF (1 page, no text needed)
MINIMAL_PDF = b"""%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length 44>>stream
BT /F1 12 Tf 100 700 Td (Hello World) Tj ET
endstream
endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
0000000360 00000 n 
trailer<</Size 6/Root 1 0 R>>
startxref
441
%%EOF"""

# Create a tiny red 1x1 JPEG
import struct

def create_minimal_jpg():
    """Create a minimal 1x1 pixel red JPEG."""
    # Minimal JPEG bytes (1x1 pixel)
    return bytes([
        0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
        0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
        0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
        0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
        0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
        0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
        0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01,
        0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4, 0x00, 0x1F, 0x00, 0x00,
        0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
        0x09, 0x0A, 0x0B, 0xFF, 0xC4, 0x00, 0xB5, 0x10, 0x00, 0x02, 0x01, 0x03,
        0x03, 0x02, 0x04, 0x03, 0x05, 0x05, 0x04, 0x04, 0x00, 0x00, 0x01, 0x7D,
        0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12, 0x21, 0x31, 0x41, 0x06,
        0x13, 0x51, 0x61, 0x07, 0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xA1, 0x08,
        0x23, 0x42, 0xB1, 0xC1, 0x15, 0x52, 0xD1, 0xF0, 0x24, 0x33, 0x62, 0x72,
        0x82, 0x09, 0x0A, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x25, 0x26, 0x27, 0x28,
        0x29, 0x2A, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x43, 0x44, 0x45,
        0x46, 0x47, 0x48, 0x49, 0x4A, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59,
        0x5A, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6A, 0x73, 0x74, 0x75,
        0x76, 0x77, 0x78, 0x79, 0x7A, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89,
        0x8A, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9A, 0xA2, 0xA3,
        0xA4, 0xA5, 0xA6, 0xA7, 0xA8, 0xA9, 0xAA, 0xB2, 0xB3, 0xB4, 0xB5, 0xB6,
        0xB7, 0xB8, 0xB9, 0xBA, 0xC2, 0xC3, 0xC4, 0xC5, 0xC6, 0xC7, 0xC8, 0xC9,
        0xCA, 0xD2, 0xD3, 0xD4, 0xD5, 0xD6, 0xD7, 0xD8, 0xD9, 0xDA, 0xE1, 0xE2,
        0xE3, 0xE4, 0xE5, 0xE6, 0xE7, 0xE8, 0xE9, 0xEA, 0xF1, 0xF2, 0xF3, 0xF4,
        0xF5, 0xF6, 0xF7, 0xF8, 0xF9, 0xFA, 0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01,
        0x00, 0x00, 0x3F, 0x00, 0xFB, 0xD3, 0xFF, 0xD9
    ])

def create_minimal_png():
    """Create a 1x1 pixel blue PNG."""
    import zlib
    def mk_chunk(tag, data):
        c = zlib.crc32(tag + data) & 0xffffffff
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', c)
    ihdr = struct.pack('>IIBBBBB', 1, 1, 8, 2, 0, 0, 0)
    idat = zlib.compress(b'\x00\x00\x00\xff')  # blue pixel
    return b'\x89PNG\r\n\x1a\n' + mk_chunk(b'IHDR', ihdr) + mk_chunk(b'IDAT', idat) + mk_chunk(b'IEND', b'')

def create_minimal_zip():
    """Create a minimal ZIP containing one text file."""
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("test.txt", "Hello World")
    return buf.getvalue()

def make_multipart(fields, files):
    """Build multipart/form-data body."""
    boundary = b'----FormBoundary7MA4YWxkTrZu0gW'
    body = b''
    for name, value in fields.items():
        body += b'--' + boundary + b'\r\n'
        body += f'Content-Disposition: form-data; name="{name}"\r\n\r\n'.encode()
        body += value.encode() + b'\r\n'
    for name, (fname, fdata, ctype) in files.items():
        body += b'--' + boundary + b'\r\n'
        body += f'Content-Disposition: form-data; name="{name}"; filename="{fname}"\r\n'.encode()
        body += f'Content-Type: {ctype}\r\n\r\n'.encode()
        body += fdata + b'\r\n'
    body += b'--' + boundary + b'--\r\n'
    ct = f'multipart/form-data; boundary={boundary.decode()}'
    return body, ct

def post_file(endpoint, field_name, filename, filedata, content_type, extra_fields=None):
    """POST a file to an endpoint and return (status_code, response_dict/text)."""
    files = {field_name: (filename, filedata, content_type)}
    fields = extra_fields or {}
    body, ct = make_multipart(fields, files)
    url = BASE + endpoint
    req = urllib.request.Request(url, data=body, method='POST')
    req.add_header('Content-Type', ct)
    try:
        resp = urllib.request.urlopen(req, timeout=30)
        data = resp.read().decode('utf-8', errors='replace')
        return resp.status, json.loads(data)
    except urllib.error.HTTPError as e:
        data = e.read().decode('utf-8', errors='replace')
        try:
            return e.code, json.loads(data)
        except:
            return e.code, data
    except Exception as ex:
        return 0, str(ex)

def post_files(endpoint, field_name, filelist, extra_fields=None):
    """POST multiple files (same field name) to an endpoint."""
    boundary = b'----FormBoundary7MA4YWxkTrZu0gW'
    body = b''
    fields = extra_fields or {}
    for name, value in fields.items():
        body += b'--' + boundary + b'\r\n'
        body += f'Content-Disposition: form-data; name="{name}"\r\n\r\n'.encode()
        body += value.encode() + b'\r\n'
    for (fname, fdata, ctype) in filelist:
        body += b'--' + boundary + b'\r\n'
        body += f'Content-Disposition: form-data; name="{field_name}"; filename="{fname}"\r\n'.encode()
        body += f'Content-Type: {ctype}\r\n\r\n'.encode()
        body += fdata + b'\r\n'
    body += b'--' + boundary + b'--\r\n'
    ct = f'multipart/form-data; boundary={boundary.decode()}'
    url = BASE + endpoint
    req = urllib.request.Request(url, data=body, method='POST')
    req.add_header('Content-Type', ct)
    try:
        resp = urllib.request.urlopen(req, timeout=30)
        data = resp.read().decode('utf-8', errors='replace')
        return resp.status, json.loads(data)
    except urllib.error.HTTPError as e:
        data = e.read().decode('utf-8', errors='replace')
        try:
            return e.code, json.loads(data)
        except:
            return e.code, data
    except Exception as ex:
        return 0, str(ex)

def check_success(name, code, resp):
    if code == 200 and isinstance(resp, dict) and (resp.get("success") or resp.get("downloadUrl") or resp.get("zip_url")):
        log(name, "PASS", f"keys={list(resp.keys())}")
    else:
        log(name, "FAIL", f"HTTP {code} => {str(resp)[:200]}")

# ── Build test data ────────────────────────────────────────────────────────────
jpg_bytes = create_minimal_jpg()
png_bytes = create_minimal_png()
zip_bytes = create_minimal_zip()

print("=" * 60)
print("AllTools Backend Endpoint Tests (port 4000)")
print("=" * 60)

# 1. PDF Merge
code, resp = post_files("/api/convert/pdf-merge", "files", [
    ("a.pdf", MINIMAL_PDF, "application/pdf"),
    ("b.pdf", MINIMAL_PDF, "application/pdf"),
])
check_success("PDF Merge", code, resp)

# 2. PDF Split
code, resp = post_file("/api/convert/pdf-split", "file", "test.pdf", MINIMAL_PDF, "application/pdf")
check_success("PDF Split", code, resp)

MINIMAL_PDF_2PAGE = b"""%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R 4 0 R]/Count 2>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R>>endobj
4 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R>>endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000179 00000 n 
trailer<</Size 5/Root 1 0 R>>
startxref
243
%%EOF"""

# 3. PDF Remove Pages
code, resp = post_file("/api/convert/pdf-remove-pages", "file", "test.pdf", MINIMAL_PDF_2PAGE, "application/pdf",
                       extra_fields={"pages": "1"})
check_success("PDF Remove Pages", code, resp)

# 4. PDF Compress
code, resp = post_file("/api/convert/pdf-compress", "file", "test.pdf", MINIMAL_PDF, "application/pdf")
check_success("PDF Compress", code, resp)

# 5. PDF OCR
code, resp = post_file("/api/convert/pdf-ocr", "file", "test.pdf", MINIMAL_PDF, "application/pdf")
check_success("PDF OCR", code, resp)

# 6. PDF to JPG
code, resp = post_file("/api/convert/pdf-to-jpg", "file", "test.pdf", MINIMAL_PDF, "application/pdf")
check_success("PDF to JPG", code, resp)

# 7. JPG to PDF
code, resp = post_files("/api/convert/jpg-to-pdf", "files", [
    ("test.jpg", jpg_bytes, "image/jpeg"),
])
check_success("JPG to PDF", code, resp)

# 8. PDF to Word
code, resp = post_file("/api/convert/pdf-to-word", "file", "test.pdf", MINIMAL_PDF, "application/pdf")
check_success("PDF to Word", code, resp)

# 9. Word to PDF (requires LibreOffice — may fail on machines without it)
DOCX_BYTES = open(r"d:\Website\alltools_full\backend\dummy.docx", 'rb').read()
code, resp = post_file("/api/convert/word-to-pdf", "file", "dummy.docx", DOCX_BYTES,
                       "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
check_success("Word to PDF", code, resp)

# 10. PPT to PDF (requires LibreOffice)
code, resp = post_file("/api/convert/ppt-to-pdf", "file", "dummy.pptx", DOCX_BYTES,
                       "application/vnd.openxmlformats-officedocument.presentationml.presentation")
check_success("PPT to PDF", code, resp)

# 11. Excel to PDF (requires LibreOffice)
code, resp = post_file("/api/convert/excel-to-pdf", "file", "dummy.xlsx", DOCX_BYTES,
                       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
check_success("Excel to PDF", code, resp)

# 12. HTML to PDF
boundary = b'----FormBoundary7MA4YWxkTrZu0gW'
body = b'--' + boundary + b'\r\nContent-Disposition: form-data; name="html_content"\r\n\r\n<html><body><h1>Test</h1></body></html>\r\n--' + boundary + b'--\r\n'
req = urllib.request.Request(BASE + "/api/convert/html-to-pdf", data=body, method='POST')
req.add_header('Content-Type', f'multipart/form-data; boundary={boundary.decode()}')
try:
    resp_obj = urllib.request.urlopen(req, timeout=15)
    rdata = json.loads(resp_obj.read().decode())
    check_success("HTML to PDF", resp_obj.status, rdata)
except urllib.error.HTTPError as e:
    edata = e.read().decode()
    try:
        check_success("HTML to PDF", e.code, json.loads(edata))
    except:
        check_success("HTML to PDF", e.code, edata[:200])
except Exception as ex:
    log("HTML to PDF", "FAIL", str(ex)[:200])

# 13. PDF Password - Protect
code, resp = post_file("/api/convert/pdf-protect", "file", "test.pdf", MINIMAL_PDF, "application/pdf",
                       extra_fields={"password": "test123"})
check_success("PDF Protect (Password)", code, resp)

# 14. PDF to Excel
code, resp = post_file("/api/convert/pdf-to-excel", "file", "test.pdf", MINIMAL_PDF, "application/pdf")
check_success("PDF to Excel", code, resp)

# 15. JPG to PNG
code, resp = post_file("/api/convert/jpg-to-png", "file", "test.jpg", jpg_bytes, "image/jpeg")
check_success("JPG to PNG", code, resp)

# 16. PNG to JPG
code, resp = post_file("/api/convert/png-to-jpg", "file", "test.png", png_bytes, "image/png")
check_success("PNG to JPG", code, resp)

# 17. JPG to WEBP
code, resp = post_file("/api/convert/jpg-to-webp", "file", "test.jpg", jpg_bytes, "image/jpeg")
check_success("JPG to WEBP", code, resp)

# 18. WEBP to PNG (use jpg as fallback since we can't easily create webp)
code, resp = post_file("/api/convert/webp-to-png", "file", "test.webp", jpg_bytes, "image/webp")
check_success("WEBP to PNG", code, resp)

# 19. Image Compress
code, resp = post_file("/api/convert/image-compress", "file", "test.jpg", jpg_bytes, "image/jpeg")
check_success("Image Compress", code, resp)

# 20. Remove Background
code, resp = post_file("/api/convert/remove-background", "file", "test.jpg", jpg_bytes, "image/jpeg")
check_success("Remove Background", code, resp)

# 21. Image Resizer
code, resp = post_file("/api/convert/image-resizer", "file", "test.jpg", jpg_bytes, "image/jpeg",
                       extra_fields={"width": "50", "height": "50"})
check_success("Image Resizer", code, resp)

# 22. ZIP to RAR
code, resp = post_file("/api/archive/convert", "file", "test.zip", zip_bytes, "application/zip",
                       extra_fields={"target": "zip_to_rar"})
check_success("ZIP to RAR", code, resp)

# 23. RAR to ZIP (no RAR test file, try with a zip — will likely fail)
code, resp = post_file("/api/archive/convert", "file", "test.rar", zip_bytes, "application/x-rar-compressed",
                       extra_fields={"target": "rar_to_zip"})
check_success("RAR to ZIP", code, resp)

# 24. Feedback
boundary = b'----FormBoundary7MA4YWxkTrZu0gW'
body = b'--' + boundary + b'\r\nContent-Disposition: form-data; name="message"\r\n\r\nTest feedback\r\n--' + boundary + b'--\r\n'
req = urllib.request.Request(BASE + "/api/feedback", data=body, method='POST')
req.add_header('Content-Type', f'multipart/form-data; boundary={boundary.decode()}')
try:
    resp_obj = urllib.request.urlopen(req, timeout=10)
    rdata = json.loads(resp_obj.read().decode())
    check_success("Feedback", resp_obj.status, rdata)
except urllib.error.HTTPError as e:
    edata = e.read().decode()
    try:
        check_success("Feedback", e.code, json.loads(edata))
    except:
        log("Feedback", "FAIL", f"HTTP {e.code}: {edata[:200]}")
except Exception as ex:
    log("Feedback", "FAIL", str(ex)[:200])

# ── Summary ───────────────────────────────────────────────────────────────────
print()
print("=" * 60)
passed = [r for r in results if r["status"] == "PASS"]
failed = [r for r in results if r["status"] == "FAIL"]
print(f"RESULTS: {len(passed)}/{len(results)} tools PASSED")
print()
print("WORKING:")
for r in passed:
    print(f"   [OK] {r['tool']}")
print()
print("NOT WORKING:")
for r in failed:
    print(f"   [FAIL] {r['tool']}: {r['detail']}")
