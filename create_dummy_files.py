import os
import zipfile
from PIL import Image, ImageDraw
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors

os.makedirs("public/samples", exist_ok=True)

# 1. High Quality 2-page PDF with text and table
pdf_path = "public/samples/dummy.pdf"
doc = SimpleDocTemplate(pdf_path, pagesize=letter)
styles = getSampleStyleSheet()

elements = []
elements.append(Paragraph("<b>AllTools Dummy Test PDF Document</b>", styles['Title']))
elements.append(Spacer(1, 20))
elements.append(Paragraph("This is page 1 of the sample PDF created for conversion testing.", styles['Normal']))
elements.append(Spacer(1, 20))

data = [
    ['Header 1', 'Header 2', 'Header 3'],
    ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
    ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3'],
]
t = Table(data)
t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.indigo),
    ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ('GRID', (0,0), (-1,-1), 1, colors.black),
]))
elements.append(t)

doc.build(elements)

# Also create second page PDF for merge/split
c = canvas.Canvas("public/samples/dummy_page2.pdf", pagesize=letter)
c.drawString(100, 700, "AllTools Test PDF - Page 2 Content")
c.save()

# 2. Sample JPG Image
img_jpg = Image.new("RGB", (300, 300), color=(79, 70, 229)) # Indigo color
draw = ImageDraw.Draw(img_jpg)
draw.text((50, 140), "AllTools Sample JPG", fill=(255, 255, 255))
img_jpg.save("public/samples/dummy.jpg", "JPEG")

# 3. Sample PNG Image
img_png = Image.new("RGBA", (300, 300), color=(16, 185, 129, 255)) # Emerald color
draw = ImageDraw.Draw(img_png)
draw.text((50, 140), "AllTools Sample PNG", fill=(255, 255, 255))
img_png.save("public/samples/dummy.png", "PNG")

# 4. Sample ZIP Archive
with zipfile.ZipFile("public/samples/dummy.zip", "w") as zf:
    zf.writestr("sample.txt", "This is a sample file inside dummy.zip")

print("Created sample files successfully in public/samples/")
