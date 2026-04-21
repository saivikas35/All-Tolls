"""
Quick test script to verify image conversion API works
"""
import requests
import io
from PIL import Image

# Create a simple test PNG image
img = Image.new('RGB', (100, 100), color='red')
img_bytes = io.BytesIO()
img.save(img_bytes, format='PNG')
img_bytes.seek(0)

# Test the PNG to JPG endpoint
print("Testing PNG to JPG conversion...")
try:
    response = requests.post(
        'http://localhost:4000/api/convert/png-to-jpg',
        files={'file': ('test.png', img_bytes, 'image/png')}
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Success! Download URL: {data.get('downloadUrl')}")
    else:
        print(f"❌ Failed: {response.text}")
except Exception as e:
    print(f"❌ Error: {e}")
