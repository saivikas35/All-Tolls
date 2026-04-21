"""
Image conversion routes using Pillow.
Handles JPG/PNG/WEBP conversions and image compression.
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from PIL import Image, ImageColor
import os
import io
import uuid
from typing import Optional
from rembg import remove
from app.utils import get_file_or_url

router = APIRouter()

UPLOAD_DIR = "uploads"


@router.post("/jpg-to-png")
def jpg_to_png(
    file: Optional[UploadFile] = File(default=None),
    url: Optional[str] = Form(default=None)
):
    """Convert JPG/JPEG to PNG"""
    if file and file.filename and not file.filename.lower().endswith(('.jpg', '.jpeg')):
        raise HTTPException(status_code=400, detail="Only JPG/JPEG files allowed")
    
    in_path = get_file_or_url(file, url, suffix=".jpg")
    
    # Generate filenames
    file_id = str(uuid.uuid4())
    output_filename = f"{file_id}_AllTools.png"
    output_path = os.path.join(UPLOAD_DIR, output_filename)
    
    try:
        # Convert JPG to PNG
        img = Image.open(in_path)
        # Convert RGBA to RGB if needed (PNG supports transparency, JPG doesn't)
        if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
            # Keep transparency for PNG
            img.save(output_path, format="PNG", optimize=True)
        else:
            # Regular conversion
            img.save(output_path, format="PNG", optimize=True)
        
        return {
            "success": True,
            "engine": "pillow",
            "downloadUrl": f"/uploads/{output_filename}",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")


@router.post("/png-to-jpg")
def png_to_jpg(
    file: Optional[UploadFile] = File(default=None),
    url: Optional[str] = Form(default=None),
    quality: int = Form(95)
):
    """Convert PNG to JPG"""
    if file and file.filename and not file.filename.lower().endswith('.png'):
        raise HTTPException(status_code=400, detail="Only PNG files allowed")
    
    in_path = get_file_or_url(file, url, suffix=".png")
    
    file_id = str(uuid.uuid4())
    output_filename = f"{file_id}_AllTools.jpg"
    output_path = os.path.join(UPLOAD_DIR, output_filename)
    
    try:
        img = Image.open(in_path)
        
        # Convert RGBA to RGB (JPG doesn't support transparency)
        if img.mode in ('RGBA', 'LA', 'P'):
            # Create white background
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        img.save(output_path, format="JPEG", quality=quality, optimize=True)
        
        return {
            "success": True,
            "engine": "pillow",
            "downloadUrl": f"/uploads/{output_filename}",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")


@router.post("/jpg-to-webp")
def jpg_to_webp(
    file: Optional[UploadFile] = File(default=None),
    url: Optional[str] = Form(default=None),
    quality: int = Form(85)
):
    """Convert JPG/JPEG to WEBP"""
    if file and file.filename and not file.filename.lower().endswith(('.jpg', '.jpeg')):
        raise HTTPException(status_code=400, detail="Only JPG/JPEG files allowed")
    
    in_path = get_file_or_url(file, url, suffix=".jpg")
    
    file_id = str(uuid.uuid4())
    output_filename = f"{file_id}_AllTools.webp"
    output_path = os.path.join(UPLOAD_DIR, output_filename)
    
    try:
        img = Image.open(in_path)
        img.save(output_path, format="WEBP", quality=quality, method=6)
        
        return {
            "success": True,
            "engine": "pillow",
            "downloadUrl": f"/uploads/{output_filename}",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")


@router.post("/webp-to-png")
def webp_to_png(
    file: Optional[UploadFile] = File(default=None),
    url: Optional[str] = Form(default=None)
):
    """Convert WEBP to PNG"""
    if file and file.filename and not file.filename.lower().endswith('.webp'):
        raise HTTPException(status_code=400, detail="Only WEBP files allowed")
    
    in_path = get_file_or_url(file, url, suffix=".webp")
    
    file_id = str(uuid.uuid4())
    output_filename = f"{file_id}_AllTools.png"
    output_path = os.path.join(UPLOAD_DIR, output_filename)
    
    try:
        img = Image.open(in_path)
        img.save(output_path, format="PNG", optimize=True)
        
        return {
            "success": True,
            "engine": "pillow",
            "downloadUrl": f"/uploads/{output_filename}",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")


@router.post("/image-compress")
def image_compress(
    file: Optional[UploadFile] = File(default=None),
    url: Optional[str] = Form(default=None),
    quality: int = Form(75),
    max_width: Optional[int] = Form(None),
    max_height: Optional[int] = Form(None),
    format: str = Form("original")
):
    """
    Compress image (JPG, PNG, WEBP)
    Optional: resize to max dimensions while maintaining aspect ratio, and convert format
    """
    allowed_extensions = ('.jpg', '.jpeg', '.png', '.webp')
    if file and file.filename:
        if not file.filename.lower().endswith(allowed_extensions):
            raise HTTPException(status_code=400, detail="Only JPG, PNG, and WEBP files allowed")
        original_ext = os.path.splitext(file.filename)[1].lower()
    elif url:
        # Fallback for plain urls, though a real implementation might download headers first
        original_ext = ".jpg"
    else:
        raise HTTPException(status_code=400, detail="File or URL required")
        
    in_path = get_file_or_url(file, url, suffix=original_ext)
    
    file_id = str(uuid.uuid4())
    
    target_ext = original_ext
    if format != "original":
        target_ext = f".{format}"
        if target_ext == ".jpg": target_ext = ".jpeg"
        
    output_filename = f"{file_id}_AllTools{target_ext}"
    output_path = os.path.join(UPLOAD_DIR, output_filename)
    
    try:
        img = Image.open(in_path)
        
        # Resize if max dimensions specified
        if max_width or max_height:
            img.thumbnail((max_width or img.width, max_height or img.height), Image.Resampling.LANCZOS)
        
        # Determine format and save
        if target_ext in ('.jpg', '.jpeg'):
            # Convert RGBA to RGB for JPG
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            img.save(output_path, format="JPEG", quality=quality, optimize=True)
        elif target_ext == '.png':
            if quality < 100:
                colors = max(8, int((quality / 100) * 256))
                if img.mode not in ('RGB', 'RGBA'):
                    img = img.convert('RGBA')
                img = img.quantize(colors=colors)
            img.save(output_path, format="PNG", optimize=True, compress_level=9)
        elif target_ext == '.webp':
            img.save(output_path, format="WEBP", quality=quality, method=6)
        
        return {
            "success": True,
            "engine": "pillow",
            "downloadUrl": f"/uploads/{output_filename}",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Compression failed: {str(e)}")


# ─── REMOVE BACKGROUND ───────────────────────────────────────────────────────

@router.post("/remove-background")
def remove_background(
    file: Optional[UploadFile] = File(default=None),
    url: Optional[str] = Form(default=None),
    bgcolor: Optional[str] = Form(None)  # hex color like #ffffff
):
    """
    Remove image background using rembg (U2Net AI model).
    Returns a transparent PNG, unless bgcolor is provided, which fills the background.
    """
    allowed_extensions = ('.jpg', '.jpeg', '.png', '.webp')
    if file and file.filename:
        if not file.filename.lower().endswith(allowed_extensions):
            raise HTTPException(status_code=400, detail="Only JPG, PNG, and WEBP files allowed")
        original_ext = os.path.splitext(file.filename)[1].lower()
    elif url:
        original_ext = ".jpg"
    else:
        raise HTTPException(status_code=400, detail="File or URL required")
        
    in_path = get_file_or_url(file, url, suffix=original_ext)
    
    file_id = str(uuid.uuid4())
    # Regardless of input, rembg produces PNG for transparency
    output_filename = f"{file_id}_AllTools.png"
    output_path = os.path.join(UPLOAD_DIR, output_filename)
    
    try:
        with open(in_path, "rb") as i_f:
            input_data = i_f.read()
        
        # CPU/GPU inference for background removal
        output_data = remove(input_data)
        
        # Load the transparent result into PIL
        img = Image.open(io.BytesIO(output_data)).convert("RGBA")

        # If user assigned a background color instead of transparency
        if bgcolor and bgcolor.strip():
            bg = Image.new("RGBA", img.size, ImageColor.getcolor(bgcolor.strip(), "RGBA"))
            bg.paste(img, (0, 0), img)
            img = bg.convert("RGB") # Drop alpha channel now that it's filled
            output_filename = f"{file_id}_AllTools.jpg"
            output_path = os.path.join(UPLOAD_DIR, output_filename)
            img.save(output_path, format="JPEG", quality=95)
        else:
            img.save(output_path, format="PNG")
        
        return {
            "success": True,
            "engine": "rembg",
            "downloadUrl": f"/uploads/{output_filename}",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Background removal failed: {str(e)}")


# ─── IMAGE RESIZER ───────────────────────────────────────────────────────────

@router.post("/image-resize")
def image_resize(
    file: Optional[UploadFile] = File(default=None),
    url: Optional[str] = Form(default=None),
    width: Optional[int] = Form(None),
    height: Optional[int] = Form(None),
    percentage: Optional[int] = Form(None),
    format: Optional[str] = Form("original") # "original", "png", "jpg", "webp"
):
    """
    Resize image by exact width/height or by percentage.
    """
    allowed_extensions = ('.jpg', '.jpeg', '.png', '.webp')
    if file and file.filename:
        if not file.filename.lower().endswith(allowed_extensions):
            raise HTTPException(status_code=400, detail="Only JPG, PNG, and WEBP files allowed")
        original_ext = os.path.splitext(file.filename)[1].lower()
    elif url:
        original_ext = ".jpg"
    else:
        raise HTTPException(status_code=400, detail="File or URL required")
        
    if not width and not height and not percentage:
        raise HTTPException(status_code=400, detail="Must provide width, height, or percentage")

    in_path = get_file_or_url(file, url, suffix=original_ext)
    file_id = str(uuid.uuid4())
    
    target_ext = original_ext
    if format != "original":
        target_ext = f".{format}"
        if target_ext == ".jpg": target_ext = ".jpeg"
        
    output_filename = f"{file_id}_AllTools{target_ext}"
    output_path = os.path.join(UPLOAD_DIR, output_filename)
    
    try:
        img = Image.open(in_path)
        
        # Calculate new dimensions
        new_width, new_height = img.width, img.height
        if percentage:
            new_width = max(1, int(img.width * (percentage / 100.0)))
            new_height = max(1, int(img.height * (percentage / 100.0)))
        else:
            if width and height:
                new_width, new_height = width, height
            elif width: # Maintain aspect ratio
                ratio = float(width) / float(img.width)
                new_width = width
                new_height = max(1, int(img.height * ratio))
            elif height:
                ratio = float(height) / float(img.height)
                new_height = height
                new_width = max(1, int(img.width * ratio))
                
        # Perform resize
        img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        save_kwargs = {}
        if target_ext in ('.jpg', '.jpeg'):
            if img.mode in ('RGBA', 'LA', 'P'):
                bg = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P': img = img.convert('RGBA')
                bg.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = bg
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            save_kwargs = {"format": "JPEG", "quality": 95}
        elif target_ext == '.png':
            save_kwargs = {"format": "PNG"}
        elif target_ext == '.webp':
            save_kwargs = {"format": "WEBP", "quality": 95}

        img.save(output_path, **save_kwargs)
        
        return {
            "success": True,
            "engine": "pillow",
            "downloadUrl": f"/uploads/{output_filename}",
            "newWidth": new_width,
            "newHeight": new_height
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resize failed: {str(e)}")
