# 🛠️ AllTools - Fullstack Utilities Platform

<div align="center">
  <img src="https://via.placeholder.com/1200x300/1e1e2f/8b5cf6?text=AllTools+Platform" alt="Banner" width="100%" />
</div>

<p align="center">
  <br>
  <b>Your ultimate, all-in-one digital toolkit for professional file management and resume building.</b>
  <br>
</p>

<div align="center">

  [![Next.js](https://img.shields.io/badge/Next.js-14.x-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-00a393?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
  [![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-Proprietary-red.svg?style=for-the-badge)]()

</div>

---

## 📖 About The Project

AllTools is an advanced, high-performance full-stack utility platform meticulously engineered to provide a comprehensive suite of digital tools in one seamless web application. Designed to simplify everyday file management and processing tasks, it acts as a centralized workspace where users can handle complex file manipulations natively without relying on disparate, fragmented web services.

Whether you need to merge critical PDFs, batch convert archives, securely remove backgrounds from images, or generate an ATS-optimized professional resume, AllTools delivers unparalleled convenience. 

## ✨ Key Features

### 📄 Comprehensive PDF Suite
*   **Merge & Split:** Seamlessly combine multiple PDFs or isolate specific pages.
*   **Compression:** Shrink PDF file sizes instantly while maintaining high fidelity.
*   **Conversion:** Reliably convert PDFs to editable Word documents or Excel sheets.
*   **HTML to PDF:** Render rich HTML web content directly into optimized PDFs.
*   **Security:** Add or remove passwords from your secure documents.

### 🗜️ Advanced Archive Management
*   **Universal Extraction:** Support for `.zip`, `.rar`, and `.7z` packages natively.
*   **Archive Creation:** Repackage files into tightly compressed, secure archives quickly.

### 🖼️ Image & Media Tools
*   **Format Conversion:** Transcode between formats like PNG, JPG, WEBP, and more.
*   **AI Background Removal:** Intelligently strip backgrounds from product images or headshots.
*   **Resizer:** Scale images perfectly without losing relative aspect ratios.

### 💼 Smart Resume Builder (New!)
*   **ATS Optimization:** Built-in ATS-scoring logic and keyword matching analysis.
*   **Dynamic Templates:** Beautiful, responsive templates (Harvard, Modern, Creative, etc.).
*   **Content Generation:** AI-driven writing assistance and bullet point formatting.
*   **Real-time Preview:** Split-pane interface allowing instant previewing.

---

## ⚙️ Tech Stack & Architecture

The application is decoupled into an API-driven backend and a server-side rendered (SSR) frontend.

### 🎨 Frontend
*   **Framework:** Next.js (App Router)
*   **Language:** JavaScript / React
*   **Styling:** Tailwind CSS & Custom CSS Modules
*   **Components:** Modular Component Architecture (View `frontend/src/components/`)
*   **State Management:** React Context / Hooks

### 🛠️ Backend
*   **Framework:** FastAPI (Python)
*   **Server:** Uvicorn (Asynchronous ASGI server)
*   **File Processors:** `PyMuPDF`, `pdf2docx`, `py7zr`, `rarfile`, `Pillow`
*   **Architecture:** Modular routing patterns with discrete utility files per feature

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (v18.0 or higher)
*   [Python](https://www.python.org/downloads/) (v3.10 or higher)
*   [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/saivikas35/All-Tolls.git
cd All-Tolls
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 4000
```
*The API should now be running on `http://localhost:4000`*

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The Web Portal should now be running on `http://localhost:3000`*

---

## 📁 Directory Structure

```text
All-Tolls/
├── backend/
│   ├── app/
│   │   ├── routes/          # Isolated API endpoint routers (PDF, Archives, Images)
│   │   ├── utils.py         # Helper functions
│   │   └── main.py          # FastAPI application entry point
│   ├── test_files/          # Resources for testing endpoints
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Backend containerization configuration
│
└── frontend/
    ├── src/
    │   ├── app/             # Next.js 14+ App Router Pages
    │   ├── components/      # Reusable React components (Resume Builder, PDF Tools, etc)
    │   ├── lib/             # Utility functions and scoring logic (ATS, Formatting)
    │   └── styles/          # Global CSS configurations
    ├── tailwind.config.js   # Tailwind Theme overrides
    └── package.json         # Node.js dependencies
```

---

## 🐳 Docker Deployment

To launch the full stack environment completely isolated via Docker:

```bash
docker-compose up --build
```
This command automatically builds the images from `frontend.Dockerfile` and `backend.Dockerfile` and bridges them via an internal Docker network.

---

## 🛣️ Roadmap
- [x] Initial full-stack implementation
- [x] Integrate ATS Resume algorithms 
- [ ] Implement user authentication / accounts
- [ ] Add Cloud Storage Integration (Google Drive / Dropbox)
- [ ] Implement WebSockets for real-time progress bars on massive files

---

## 🤝 Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🔒 Security
If you discover any security related issues or vulnerabilities, please don't use the issue tracker. Instead, email the owner privately so a patch can be safely distributed.

## 📄 License
Check the root and backend `license.txt` documents for licensing specifics, as certain third-party Python modules (like UnRAR, PDF parsers) carry restrictive open-source and proprietary licensing terms.

## 📩 Contact
Sai Vikas - [GitHub Profile](https://github.com/saivikas35)  
Project Link: [https://github.com/saivikas35/All-Tolls](https://github.com/saivikas35/All-Tolls)

---
<p align="center">Made with ❤️ and high-performance code.</p>
