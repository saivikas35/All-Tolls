# 🛠️ AllTools - Fullstack Utilities Platform

<div align="center">
  <img src="https://via.placeholder.com/1200x300/1e1e2f/8b5cf6?text=AllTools+Platform" alt="Banner" width="100%" />
</div>

<br />

AllTools is a comprehensive, full-stack utility platform that brings essential file conversion and processing tools into one powerful, easy-to-use application. 

Built with modern web technologies, it features a sleek **Next.js** frontend and a blazingly fast **FastAPI** backend to handle complex operations like PDF manipulations, image conversions, and archive extractions natively.

---

## ✨ Features

*   **📄 PDF Suite**: Merge, split, compress, and convert PDFs (e.g., PDF to Word, HTML to PDF).
*   **🖼️ Image Conversion**: High-performance image processing and format conversions.
*   **🗜️ Archive Tools**: Extract, convert, and manage archives (`.zip`, `.rar`, `.7z`) seamlessly.
*   **⚡ Blazing Fast UI**: App Router-powered Next.js frontend with Tailwind CSS and responsive design.
*   **🚀 Robust API**: Python-based backend handling core tool business logic.

---

## 🏗️ Architecture

### Frontend (Next.js)
The beautifully crafted UI uses **Next.js (App Router)** and connects to the backend REST API. It lives in the `frontend/` directory. For more details, verify the `README_FRONTEND.txt`.

### Backend (FastAPI)
A Python High-performance backend handling all core tool business logic. Leveraging libraries like `PyMuPDF`, `Pillow`, and `pdf2docx`, it processes files efficiently. It lives in the `backend/` directory.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   Python 3.10+
*   Docker (Optional, for containerized deployments)

### 1. Starting the Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 4000
```
*(The API will be available at http://localhost:4000)*

### 2. Starting the Frontend
```bash
cd frontend
npm install
npm run dev
```
*(The web app will be available at http://localhost:3000)*

### 3. Docker Deployment
You can orchestrate both services using `docker-compose.yml`.

```bash
docker-compose up --build
```

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project includes standard usages. Please check `license.txt` inside the backend directory for specific tool-chain licensing details.
