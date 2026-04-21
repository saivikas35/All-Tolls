// frontend/src/lib/tools.js
// Tools metadata list: id, title, category, path, remote icon, fallback icon, badgeColor, keywords

const tools = [
  {
    id: "pdf-merge",
    title: "Merge PDF",
    category: "Organize PDF",
    path: "/convert/pdf-merge",
    icon: "https://unpkg.com/@tabler/icons@3.x/icons/outline/file-merge.svg",
    iconLocal: "https://unpkg.com/@tabler/icons@3.x/icons/outline/file-merge.svg",
    badgeColor: "#FFF0F0",
    keywords: ["merge", "join", "combine"]
  },
  {
    id: "pdf-split",
    title: "Split PDF",
    category: "Organize PDF",
    path: "/convert/pdf-split",
    icon: "https://unpkg.com/@tabler/icons@3.x/icons/outline/columns.svg",
    iconLocal: "https://unpkg.com/@tabler/icons@3.x/icons/outline/columns.svg",
    badgeColor: "#FFF8E6",
    keywords: ["split", "extract", "separate"]
  },
  {
    id: "pdf-remove-pages",
    title: "Remove Pages",
    category: "Organize PDF",
    path: "/convert/pdf-remove-pages",
    icon: "https://unpkg.com/@tabler/icons@3.x/icons/outline/trash.svg",
    iconLocal: "https://unpkg.com/@tabler/icons@3.x/icons/outline/trash.svg",
    badgeColor: "#FFF0F8",
    keywords: ["remove", "delete pages", "trim"]
  },
  {
    id: "pdf-compress",
    title: "Compress PDF",
    category: "Optimize PDF",
    path: "/convert/pdf-compress",
    icon: "https://unpkg.com/@tabler/icons@3.x/icons/outline/scale.svg",
    iconLocal: "https://unpkg.com/@tabler/icons@3.x/icons/outline/scale.svg",
    badgeColor: "#F0FBFF",
    keywords: ["compress", "reduce size", "shrink"]
  },
  {
    id: "pdf-ocr",
    title: "OCR PDF",
    category: "Optimize PDF",
    path: "/convert/pdf-ocr",
    icon: "https://unpkg.com/@tabler/icons@3.x/icons/outline/scan.svg",
    iconLocal: "https://unpkg.com/@tabler/icons@3.x/icons/outline/scan.svg",
    badgeColor: "#F6F6FF",
    keywords: ["ocr", "text recognition", "scan"]
  },
  {
    id: "jpg-to-pdf",
    title: "JPG to PDF",
    category: "Convert to PDF",
    path: "/convert/jpg-to-pdf",
    icon: "https://unpkg.com/@tabler/icons@3.x/icons/outline/photo.svg",
    iconLocal: "https://unpkg.com/@tabler/icons@3.x/icons/outline/photo.svg",
    badgeColor: "#FFFBEB",
    keywords: ["jpg", "image to pdf", "jpeg"]
  },
  {
    id: "word-to-pdf",
    title: "Word to PDF",
    category: "Convert to PDF",
    path: "/convert/word-to-pdf",
    icon: "https://unpkg.com/@tabler/icons@3.x/icons/outline/file-text.svg",
    iconLocal: "https://unpkg.com/@tabler/icons@3.x/icons/outline/file-text.svg",
    badgeColor: "#F2FFF4",
    keywords: ["doc", "docx", "word"]
  },
  {
    id: "ppt-to-pdf",
    title: "PowerPoint to PDF",
    category: "Convert to PDF",
    path: "/convert/ppt-to-pdf",
    icon: "https://unpkg.com/@tabler/icons@3.x/icons/outline/presentation.svg",
    iconLocal: "https://unpkg.com/@tabler/icons@3.x/icons/outline/presentation.svg",
    badgeColor: "#FFF5F0",
    keywords: ["ppt", "presentation", "slides"]
  },
  {
    id: "excel-to-pdf",
    title: "Excel to PDF",
    category: "Convert to PDF",
    path: "/convert/excel-to-pdf",
    icon: "https://unpkg.com/@tabler/icons@3.x/icons/outline/chart-bar.svg",
    iconLocal: "https://unpkg.com/@tabler/icons@3.x/icons/outline/chart-bar.svg",
    badgeColor: "#F1FFF6",
    keywords: ["excel", "xlsx", "spreadsheet"]
  },
  {
    id: "html-to-pdf",
    title: "HTML to PDF",
    category: "Convert to PDF",
    path: "/convert/html-to-pdf",
    icon: "https://unpkg.com/@tabler/icons@3.x/icons/outline/code.svg",
    iconLocal: "https://unpkg.com/@tabler/icons@3.x/icons/outline/code.svg",
    badgeColor: "#F5F8FF",
    keywords: ["html", "web", "page to pdf"]
  },
  {
    id: "pdf-to-jpg",
    title: "PDF to JPG",
    category: "Convert from PDF",
    path: "/convert/pdf-to-jpg",
    icon: "https://unpkg.com/@tabler/icons@3.x/icons/outline/image.svg",
    iconLocal: "https://unpkg.com/@tabler/icons@3.x/icons/outline/image.svg",
    badgeColor: "#FFF8F1",
    keywords: ["pdf to image", "png", "jpg"]
  },
  {
    id: "pdf-to-word",
    title: "PDF to Word",
    category: "Convert from PDF",
    path: "/convert/pdf-to-word",
    icon: "https://unpkg.com/@tabler/icons@3.x/icons/outline/file-export.svg",
    iconLocal: "https://unpkg.com/@tabler/icons@3.x/icons/outline/file-export.svg",
    badgeColor: "#F6F0FF",
    keywords: ["pdf to docx", "convert pdf"]
  },
  {
    id: "zip-to-rar",
    title: "ZIP → RAR",
    category: "Archive",
    path: "/convert/zip-to-rar",
    icon: "https://unpkg.com/@tabler/icons@3.x/icons/outline/archive.svg",
    iconLocal: "https://unpkg.com/@tabler/icons@3.x/icons/outline/archive.svg",
    badgeColor: "#F0FBFF",
    keywords: ["zip", "rar", "archive", "compress"]
  },
  {
    id: "rar-to-zip",
    title: "RAR → ZIP",
    category: "Archive",
    path: "/convert/rar-to-zip",
    icon: "https://unpkg.com/@tabler/icons@3.x/icons/outline/archive.svg",
    iconLocal: "https://unpkg.com/@tabler/icons@3.x/icons/outline/archive.svg",
    badgeColor: "#FFF7F0",
    keywords: ["rar", "zip", "archive", "convert"]
  },
  {
    id: "pdf-password",
    title: "Protect & Unlock",
    category: "Organize PDF",
    path: "/convert/pdf-password",
    icon: "https://unpkg.com/@tabler/icons@3.x/icons/outline/lock.svg",
    iconLocal: "https://unpkg.com/@tabler/icons@3.x/icons/outline/lock.svg",
    badgeColor: "#FFF0F0",
    keywords: ["password", "protect", "encrypt", "unlock", "decrypt", "secure"]
  },
  {
    id: "pdf-to-excel",
    title: "PDF to Excel",
    category: "Convert from PDF",
    path: "/convert/pdf-to-excel",
    icon: "https://unpkg.com/@tabler/icons@3.x/icons/outline/table.svg",
    iconLocal: "https://unpkg.com/@tabler/icons@3.x/icons/outline/table.svg",
    badgeColor: "#F1FFF6",
    keywords: ["pdf to excel", "xlsx", "spreadsheet", "tables"]
  },

  // ---------------- IMAGE TOOLS ----------------
  {
    id: "jpg-to-png",
    title: "JPG → PNG",
    category: "Convert Images",
    path: "/convert/jpg-to-png",
    icon: "https://unpkg.com/@tabler/icons@3.x/icons/outline/photo.svg",
    iconLocal: "https://unpkg.com/@tabler/icons@3.x/icons/outline/photo.svg",
    badgeColor: "#F2FFF4",
    keywords: ["jpg", "png", "image convert"]
  },
  {
    id: "png-to-jpg",
    title: "PNG → JPG",
    category: "Convert Images",
    path: "/convert/png-to-jpg",
    icon: "https://unpkg.com/@tabler/icons@3.x/icons/outline/image.svg",
    iconLocal: "https://unpkg.com/@tabler/icons@3.x/icons/outline/image.svg",
    badgeColor: "#F0F7FF",
    keywords: ["png", "jpg", "jpeg"]
  },
  {
    id: "jpg-to-webp",
    title: "JPG → WEBP",
    category: "Convert Images",
    path: "/convert/jpg-to-webp",
    icon: "https://unpkg.com/@tabler/icons@3.x/icons/outline/photo.svg",
    iconLocal: "https://unpkg.com/@tabler/icons@3.x/icons/outline/photo.svg",
    badgeColor: "#FFF5F0",
    keywords: ["jpg", "webp", "image compress"]
  },
  {
    id: "webp-to-png",
    title: "WEBP → PNG",
    category: "Convert Images",
    path: "/convert/webp-to-png",
    icon: "https://unpkg.com/@tabler/icons@3.x/icons/outline/image.svg",
    iconLocal: "https://unpkg.com/@tabler/icons@3.x/icons/outline/image.svg",
    badgeColor: "#F6F6FF",
    keywords: ["webp", "png", "image convert"]
  },
  {
    id: "image-compress",
    title: "Compress Image",
    category: "Optimize Images",
    path: "/convert/image-compress",
    icon: "https://unpkg.com/@tabler/icons@3.x/icons/outline/scale.svg",
    iconLocal: "https://unpkg.com/@tabler/icons@3.x/icons/outline/scale.svg",
    badgeColor: "#FFFBEF",
    keywords: ["image compress", "reduce image size"]
  },
  {
    id: "remove-background",
    title: "Remove Background",
    category: "Optimize Images",
    path: "/convert/remove-background",
    icon: "https://unpkg.com/@tabler/icons@3.x/icons/outline/eraser.svg",
    iconLocal: "https://unpkg.com/@tabler/icons@3.x/icons/outline/eraser.svg",
    badgeColor: "#F4F0FF",
    keywords: ["remove background", "transparent", "rembg", "ai erase", "cutout"]
  },
  {
    id: "image-resizer",
    title: "Resize Image",
    category: "Optimize Images",
    path: "/convert/image-resizer",
    icon: "https://unpkg.com/@tabler/icons@3.x/icons/outline/dimensions.svg",
    iconLocal: "https://unpkg.com/@tabler/icons@3.x/icons/outline/dimensions.svg",
    badgeColor: "#EFFFF6",
    keywords: ["resize", "dimensions", "scale image", "pixel width height"]
  },

  // ---------------- DEVELOPER TOOLS ----------------
  {
    id: "json-formatter",
    title: "JSON Formatter",
    category: "Developer Tools",
    path: "/tools/json-formatter",
    icon: "https://unpkg.com/@tabler/icons@3.x/icons/outline/braces.svg",
    iconLocal: "https://unpkg.com/@tabler/icons@3.x/icons/outline/braces.svg",
    badgeColor: "#F0F5FF",
    keywords: ["json", "format", "beautify", "minify", "validate", "syntax"]
  },

  // ---------------- CAREER TOOLS ----------------
  {
    id: "resume-builder",
    title: "Resume Builder",
    category: "Career Tools",
    path: "/resume-builder",
    icon: "https://unpkg.com/@tabler/icons@3.x/icons/outline/file-text.svg",
    iconLocal: "https://unpkg.com/@tabler/icons@3.x/icons/outline/file-text.svg",
    badgeColor: "#EFFFF6",
    keywords: ["resume", "cv", "builder", "job"]
  },
  {
    id: "ats-score",
    title: "ATS Score Checker",
    category: "Career Tools",
    path: "/ats-score",
    icon: "https://unpkg.com/@tabler/icons@3.x/icons/outline/checkup-list.svg",
    iconLocal: "https://unpkg.com/@tabler/icons@3.x/icons/outline/checkup-list.svg",
    badgeColor: "#FFF1EC",
    keywords: ["ats", "resume score", "job", "analysis"]
  }
];

export default tools;
