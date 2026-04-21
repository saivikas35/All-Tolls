const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const router = express.Router();

/* ---------------- Upload config ---------------- */
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const upload = multer({ dest: UPLOAD_DIR });

/*
  POST /api/pdf/:tool

  Supported tools:
  - remove-pages
  - scan-blanks
  - pdf-to-word   ✅ NEW
*/
router.post("/:tool", upload.single("file"), (req, res) => {
  try {
    const { tool } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const inputPath = req.file.path;
    const inputName = path.parse(req.file.originalname).name;

    /* ======================================================
       PDF → WORD (LibreOffice)
    ====================================================== */
    if (tool === "pdf-to-word") {
      const outputDir = UPLOAD_DIR;

      const soffice =
        process.env.SOFFICE_PATH ||
        "soffice"; // Windows/Linux compatible

      const command = `"${soffice}" --headless --convert-to docx --outdir "${outputDir}" "${inputPath}"`;

      exec(command, (err) => {
        if (err) {
          console.error("LibreOffice error:", err);
          return res.status(500).json({ error: "PDF to Word failed" });
        }

        const outputPath = path.join(outputDir, `${inputName}.docx`);

        if (!fs.existsSync(outputPath)) {
          return res.status(500).json({ error: "Conversion output missing" });
        }

        // frontend expects JSON with downloadUrl
        res.json({
          success: true,
          downloadUrl: `/downloads/${path.basename(outputPath)}`,
        });
      });

      return;
    }

    /* ======================================================
       OTHER PDF TOOLS (Python-based)
    ====================================================== */
    const outputPath = `${inputPath}_output.pdf`;

    let scriptPath;

    switch (tool) {
      case "remove-pages":
        scriptPath = path.join(
          __dirname,
          "..",
          "worker",
          "scripts",
          "remove_pages_from_pdf.py"
        );
        break;

      case "scan-blanks":
        scriptPath = path.join(
          __dirname,
          "..",
          "worker",
          "scripts",
          "scan_pdf_for_blanks.py"
        );
        break;

      default:
        return res.status(400).json({ error: "Unsupported PDF tool" });
    }

    const command = `python "${scriptPath}" "${inputPath}" "${outputPath}"`;

    exec(command, (err) => {
      if (err) {
        console.error("PDF processing error:", err);
        return res.status(500).json({ error: "PDF processing failed" });
      }

      res.download(outputPath, (downloadErr) => {
        if (downloadErr) console.error(downloadErr);

        // cleanup
        try {
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
        } catch (e) {
          console.warn("Cleanup warning:", e.message);
        }
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
