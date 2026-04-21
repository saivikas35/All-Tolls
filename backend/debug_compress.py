import asyncio
import os
import sys

sys.path.append(os.path.dirname(__file__))

from app.routes.pdf_ops import pdf_compress
from fastapi import UploadFile

async def run():
    with open('test_files/test1.pdf', 'rb') as f:
        upload_file = UploadFile(filename='test1.pdf', file=f)
        try:
            await pdf_compress(upload_file)
            print("OK")
        except Exception as e:
            import traceback
            traceback.print_exc()

asyncio.run(run())
