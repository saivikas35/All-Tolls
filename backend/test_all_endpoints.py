import os
import requests
import time
from reportlab.pdfgen import canvas
from PIL import Image
import zipfile

BASE_URL = "http://localhost:8000/api"
TEST_DIR = "test_files"

def create_dummy_files():
    os.makedirs(TEST_DIR, exist_ok=True)
    
    # 1. PDF 1
    pdf1_path = os.path.join(TEST_DIR, "test1.pdf")
    c = canvas.Canvas(pdf1_path)
    c.drawString(100, 750, "Test PDF 1 - Page 1")
    c.showPage()
    c.drawString(100, 750, "Test PDF 1 - Page 2")
    c.save()
    
    # 2. PDF 2
    pdf2_path = os.path.join(TEST_DIR, "test2.pdf")
    c = canvas.Canvas(pdf2_path)
    c.drawString(100, 750, "Test PDF 2")
    c.save()
    
    # 3. Image (JPG)
    jpg_path = os.path.join(TEST_DIR, "test.jpg")
    img = Image.new('RGB', (100, 100), color = 'red')
    img.save(jpg_path)
    
    # 4. Image (PNG)
    png_path = os.path.join(TEST_DIR, "test.png")
    img = Image.new('RGB', (100, 100), color = 'blue')
    img.save(png_path)
    
    # 5. ZIP file
    zip_path = os.path.join(TEST_DIR, "test.zip")
    with zipfile.ZipFile(zip_path, 'w') as zf:
        zf.write(pdf1_path, arcname="test1.pdf")
        
    return {
        "pdf1": pdf1_path,
        "pdf2": pdf2_path,
        "jpg": jpg_path,
        "png": png_path,
        "zip": zip_path
    }

def test_endpoint(name, url, method="POST", files=None, data=None):
    try:
        t0 = time.time()
        res = requests.request(method, url, files=files, data=data, timeout=15)
        t1 = time.time()
        
        if res.status_code == 200:
            js = res.json()
            if js.get("success") or js.get("downloadUrl") or js.get("status"):
                print(f"[{name}] [OK] ({t1-t0:.2f}s)")
                return True
            else:
                print(f"[{name}] [FAILED] - Valid JSON but missing success/downloadUrl: {js}")
                return False
        else:
            print(f"[{name}] [FAILED] HTTP {res.status_code} - {res.text}")
            return False
    except Exception as e:
        print(f"[{name}] [ERROR]: {e}")
        return False

def run_all_tests():
    print("Generating dummy files...")
    f = create_dummy_files()
    
    success = 0
    total = 0
    
    def run(name, url, file_dict, data=None):
        nonlocal success, total
        total += 1
        
        opened_files = []
        file_objs = []
        
        try:
            for k, v in file_dict.items():
                if isinstance(v, list):
                    for path in v:
                        fo = open(path, 'rb')
                        file_objs.append(fo)
                        opened_files.append((k, fo))
                else:
                    fo = open(v, 'rb')
                    file_objs.append(fo)
                    opened_files.append((k, fo))
            
            is_ok = test_endpoint(name, url, files=opened_files, data=data)
            if is_ok:
                success += 1
        finally:
            for fo in file_objs:
                fo.close()

    # --- PDF Ops ---
    run("PDF Merge", f"{BASE_URL}/convert/pdf-merge", {"files": [f["pdf1"], f["pdf2"]]})
    run("PDF Split", f"{BASE_URL}/convert/pdf-split", {"file": f["pdf1"]})
    run("PDF Remove Pages", f"{BASE_URL}/convert/pdf-remove-pages", {"file": f["pdf1"]}, {"pages": "1"})
    run("PDF Compress", f"{BASE_URL}/convert/pdf-compress", {"file": f["pdf1"]})
    run("PDF Thumbnails", f"{BASE_URL}/convert/pdf-split/preview", {"file": f["pdf1"]})
    
    # --- PDF Convert ---
    run("PDF to JPG", f"{BASE_URL}/convert/pdf-to-jpg", {"file": f["pdf1"]})
    run("JPG to PDF", f"{BASE_URL}/convert/jpg-to-pdf", {"files": [f["jpg"]]})
    run("PDF OCR", f"{BASE_URL}/convert/pdf-ocr", {"file": f["pdf1"]})
    
    # --- HTML to PDF ---
    # Simple HTML without external resources to avoid SSL certificate errors in xhtml2pdf
    run("HTML to PDF", f"{BASE_URL}/convert/html-to-pdf", {}, data={"html_content": "<html><body><h1>Hello PDF</h1></body></html>"})
    
    # --- Image Tools ---
    run("Image Compress", f"{BASE_URL}/convert/image-compress", {"file": f["jpg"]})
    run("JPG to PNG", f"{BASE_URL}/convert/jpg-to-png", {"file": f["jpg"]})
    run("PNG to JPG", f"{BASE_URL}/convert/png-to-jpg", {"file": f["png"]})
    run("JPG to WEBP", f"{BASE_URL}/convert/jpg-to-webp", {"file": f["jpg"]})
    run("WEBP to PNG", f"{BASE_URL}/convert/webp-to-png", {"file": f["webp"]})
    
    # --- Archives ---
    run("ZIP to RAR (or 7z/fallback)", f"{BASE_URL}/archive/convert", {"file": f["zip"]}, {"target": "zip_to_rar"})
    
    # --- URL Testing ---
    # Using a known public dummy PDF
    dummy_url = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    run("URL Download (PDF Split)", f"{BASE_URL}/convert/pdf-split", {}, {"url": dummy_url})
    
    print(f"\n=======================")
    print(f"Results: {success}/{total} endpoints passed.")
    print(f"=======================")

if __name__ == "__main__":
    run_all_tests()
