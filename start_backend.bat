@echo off
echo Starting AllTools FastAPI Backend on port 4000...
cd /d "%~dp0backend"
call venv\Scripts\activate.bat
uvicorn app.main:app --host 0.0.0.0 --port 4000 --reload
pause
