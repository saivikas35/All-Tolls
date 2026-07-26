# -*- coding: utf-8 -*-
import requests, time, os, zipfile, sys
from PIL import Image
from reportlab.pdfgen import canvas

BASE = "http://localhost:4000/api"
TEST_DIR = "test_files"
os.makedirs(TEST_DIR, exist_ok=True)

results = []

def run(name, url, files_dict=None, data=None, timeout=30, expected_status=200):
    res = None
    try:
        t0 = time.time()
        opened = []
        file_objs = []
        for k, v in (files_dict or {}).items():
            if isinstance(v, list):
                for path in v:
                    fo = open(path, "rb")
                    file_objs.append(fo)
                    opened.append((k, fo))
            else:
                fo = open(v, "rb")
                file_objs.append(fo)
                opened.append((k, fo))
        res = requests.request("POST", url, files=opened or None, data=data, timeout=timeout)
        t1 = time.time()
        for fo in file_objs:
            fo.close()

        if res.status_code == expected_status:
            if expected_status == 200:
                try:
                    j = res.json()
                    ok_keys = {"success", "downloadUrl", "status", "thumbnails", "text"}
                    if any(k in j for k in ok_keys):
                        results.append(("OK", name, f"{t1-t0:.1f}s"))
                        print(f"  [OK] {name}  ({t1-t0:.1f}s)")
                    else:
                        results.append(("FAIL", name, f"JSON missing key: {list(j.keys())}"))
                        print(f"  [FAIL] {name}  JSON={list(j.keys())}")
                except Exception:
                    results.append(("OK", name, "binary"))
                    print(f"  [OK] {name}  (binary)")
            else:
                results.append(("OK", name, f"HTTP {res.status_code} (Expected)"))
                print(f"  [OK] {name}  HTTP {res.status_code} (Expected)")
        else:
            try:
                detail = res.json().get("detail", res.text[:100])
            except Exception:
                detail = res.text[:100]
            results.append(("FAIL", name, f"HTTP {res.status_code} (Expected {expected_status}): {detail}"))
            print(f"  [FAIL] {name}  HTTP {res.status_code} (Expected {expected_status}): {detail}")
    except requests.exceptions.Timeout:
        results.append(("ERR", name, "TIMEOUT"))
        print(f"  [ERR] {name}  TIMEOUT")
    except Exception as e:
        results.append(("ERR", name, str(e)[:100]))
        print(f"  [ERR] {name}  {str(e)[:100]}")
    return res

# ---- Create test files ----
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.lib.pagesizes import letter

pdf1 = os.path.join(TEST_DIR, "t1.pdf")
pdf2 = os.path.join(TEST_DIR, "t2.pdf")
pdf_table = os.path.join(TEST_DIR, "t_table.pdf")
jpg  = os.path.join(TEST_DIR, "t.jpg")
png  = os.path.join(TEST_DIR, "t.png")
webp = os.path.join(TEST_DIR, "t.webp")
zipf = os.path.join(TEST_DIR, "t.zip")

c = canvas.Canvas(pdf1)
c.drawString(100, 750, "Page 1")
c.showPage()
c.drawString(100, 750, "Page 2")
c.save()

c = canvas.Canvas(pdf2)
c.drawString(100, 750, "PDF 2")
c.save()

doc_t = SimpleDocTemplate(pdf_table, pagesize=letter)
t_data = [['Col 1', 'Col 2'], ['Val 1', 'Val 2']]
t = Table(t_data)
t.setStyle(TableStyle([('GRID', (0,0), (-1,-1), 1, 'black')]))
doc_t.build([t])

Image.new("RGB", (200, 200), "red").save(jpg)
Image.new("RGB", (200, 200), "blue").save(png)
Image.new("RGB", (200, 200), "green").save(webp, "WEBP")

with zipfile.ZipFile(zipf, "w") as zf:
    zf.write(pdf1, "t1.pdf")

print("=" * 50)
print("Backend Endpoint Tests")
print("=" * 50)

print("\n--- PDF Operations ---")
run("PDF Merge",         f"{BASE}/convert/pdf-merge",        {"files": [pdf1, pdf2]})
run("PDF Split",         f"{BASE}/convert/pdf-split",        {"file": pdf1})
run("PDF Remove Pages",  f"{BASE}/convert/pdf-remove-pages", {"file": pdf1}, {"pages": "1"})
run("PDF Compress",      f"{BASE}/convert/pdf-compress",     {"file": pdf1})
run("PDF Thumbnails",    f"{BASE}/convert/pdf-split/preview",{"file": pdf1})
run("PDF to Word",       f"{BASE}/convert/pdf-to-word",      {"file": pdf1})

print("\n--- PDF Convert ---")
run("PDF to JPG",        f"{BASE}/convert/pdf-to-jpg",       {"file": pdf1})
run("JPG to PDF",        f"{BASE}/convert/jpg-to-pdf",       {"files": [jpg]})
run("PDF OCR",           f"{BASE}/convert/pdf-ocr",          {"file": pdf1})
run("PDF to Excel",      f"{BASE}/convert/pdf-to-excel",     {"file": pdf1})

print("\n--- HTML to PDF ---")
run("HTML to PDF",       f"{BASE}/convert/html-to-pdf", None, {"html_content": "<html><body><h1>Test</h1></body></html>"})

print("\n--- Image Tools ---")
run("Image Compress",    f"{BASE}/convert/image-compress",   {"file": jpg})
run("Image Resize",      f"{BASE}/convert/image-resize",     {"file": jpg}, {"width": "100", "height": "100"})
run("JPG to PNG",        f"{BASE}/convert/jpg-to-png",       {"file": jpg})
run("PNG to JPG",        f"{BASE}/convert/png-to-jpg",       {"file": png})
run("JPG to WEBP",       f"{BASE}/convert/jpg-to-webp",      {"file": jpg})
run("WEBP to PNG",       f"{BASE}/convert/webp-to-png",      {"file": webp})
run("Remove Background", f"{BASE}/convert/remove-background",{"file": jpg})

print("\n--- Archives ---")
run("ZIP to RAR",        f"{BASE}/convert/zip-to-rar",       {"file": zipf})
run("Archive Convert",   f"{BASE}/archive/convert",          {"file": zipf}, {"target": "zip_to_rar"})

print("\n--- PDF Security ---")
run("PDF Protect",       f"{BASE}/convert/pdf-protect",      {"file": pdf1}, {"password": "test123"})
run("PDF Unlock",        f"{BASE}/convert/pdf-unlock",       {"file": pdf1}, {"password": "wrongpass"})

print("\n--- Misc ---")
run("Extract Text",      f"{BASE}/convert/extract-text",     {"file": pdf1})

# ---- Summary ----
ok   = [r for r in results if r[0] == "OK"]
fail = [r for r in results if r[0] == "FAIL"]
err  = [r for r in results if r[0] == "ERR"]

print("\n" + "=" * 50)
print(f"RESULTS: {len(ok)} OK  |  {len(fail)} FAILED  |  {len(err)} ERRORS  |  {len(results)} Total")
print("=" * 50)

if fail or err:
    print("\n--- Issues Found ---")
    for r in fail + err:
        print(f"  [{r[0]}] {r[1]}: {r[2]}")
else:
    print("\nAll endpoints passed!")
