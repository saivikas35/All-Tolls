# 🤝 Contributing to AllTools

Thank you for considering a contribution to **AllTools**! This document outlines the process and guidelines to help you get started quickly.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Branching Strategy](#branching-strategy)
- [Commit Message Convention](#commit-message-convention)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

---

## 📜 Code of Conduct

By participating in this project, you agree to uphold our standard of respectful, inclusive collaboration. Be kind, constructive, and professional in all interactions.

---

## 🛠️ How to Contribute

You can contribute in several ways:

- 🐛 **Bug fixes** — identify and fix broken functionality
- ✨ **New tools** — add new file conversion or processing tools
- 🎨 **UI improvements** — improve the frontend design or UX
- 📝 **Documentation** — improve README, comments, or add usage guides
- 🧪 **Tests** — write or improve backend test coverage
- 🔧 **Refactoring** — clean up code structure without changing behavior

---

## 📁 Project Structure

```
alltools_full/
├── backend/                  # FastAPI backend (Python)
│   ├── app/
│   │   ├── main.py           # FastAPI app entry point & download endpoint
│   │   ├── routes/           # Feature routers (pdf_ops, images, archives, etc.)
│   │   ├── utils.py          # Shared utilities (file save, cleanup)
│   │   └── ...
│   ├── requirements.txt
│   └── venv/                 # Python virtual environment
│
├── frontend/                 # Next.js frontend (React)
│   ├── src/
│   │   ├── app/              # Next.js App Router pages
│   │   ├── components/       # Reusable React components
│   │   └── lib/              # Utilities (downloadFile, tools, etc.)
│   ├── next.config.mjs       # Next.js config & proxy rewrites
│   └── .env.local            # Frontend environment variables
│
├── start_backend.bat         # One-click backend startup (Windows)
├── docker-compose.yml        # Docker Compose config
└── README.md
```

---

## 🚀 Development Setup

### Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **LibreOffice** (optional — for Word/PPT/Excel → PDF conversion)

### 1. Clone the repository

```bash
git clone https://github.com/saivikas35/All-Tolls.git
cd All-Tolls
```

### 2. Start the Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 4000 --reload
```

Or on Windows just double-click **`start_backend.bat`** from the project root.

The API will be available at: `http://localhost:4000`  
Interactive docs: `http://localhost:4000/docs`

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at: `http://localhost:3000`

### 4. Environment Variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE=http://localhost:4000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key
```

---

## 🌿 Branching Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Stable production-ready code |
| `feature/alltools-enhancements` | Active development branch |
| `feature/<your-feature>` | Your new feature |
| `fix/<bug-name>` | Bug fix branch |

Always branch off from the latest `feature/alltools-enhancements` or `main`:

```bash
git checkout feature/alltools-enhancements
git pull origin feature/alltools-enhancements
git checkout -b feature/your-new-tool
```

---

## ✍️ Commit Message Convention

We use **Conventional Commits** format:

```
<type>(<scope>): <short description>

[optional body]
```

| Type | Use When |
|------|----------|
| `feat` | Adding a new feature or tool |
| `fix` | Fixing a bug |
| `docs` | Documentation only changes |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `style` | Formatting, missing semicolons, etc. |
| `test` | Adding or fixing tests |
| `chore` | Build process, dependency updates |

**Examples:**

```
feat(pdf): add PDF password protect endpoint
fix(download): preserve original filename using blob helper
docs: add CONTRIBUTING.md with setup instructions
```

---

## 📬 Pull Request Process

1. **Fork** the repository and create your branch from `feature/alltools-enhancements`.
2. Make your changes and ensure everything works locally.
3. **Test** your changes — run backend tests with:
   ```bash
   cd backend
   python test_all_endpoints.py
   ```
4. **Update documentation** if you changed any APIs or added tools.
5. Open a Pull Request against the `feature/alltools-enhancements` branch.
6. Fill in the PR template with:
   - What problem does it solve?
   - How was it tested?
   - Screenshots (for UI changes)

---

## 🐛 Reporting Bugs

Please open a [GitHub Issue](https://github.com/saivikas35/All-Tolls/issues) with:

- **Title**: Short, clear description of the problem
- **Steps to reproduce**: Numbered steps
- **Expected behavior**
- **Actual behavior**
- **Environment**: OS, browser, Python version, Node version
- **Screenshots** (if applicable)

---

## 💡 Suggesting Enhancements

Open a [GitHub Issue](https://github.com/saivikas35/All-Tolls/issues) with the label `enhancement` and describe:

- The tool or feature you'd like to see
- Why it would be useful
- Any relevant examples or references

---

## 🙏 Thank You

Every contribution — big or small — helps make AllTools better for everyone. We appreciate your time and effort!
