"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadGooglePicker, openGoogleDrivePicker } from "@/lib/googleDrivePicker";

const DROPBOX_APP_KEY = "2t2su51ec3xgf1u";
let API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

// Tools that accept multiple files
const MULTI_FILE_TOOLS = ["pdf-merge", "jpg-to-pdf"];
// Tools that need a page-number input field
const PAGE_INPUT_TOOLS = ["pdf-split", "pdf-remove-pages"];

export default function ToolConvertPage() {
  const router = useRouter();
  const params = useParams();
  const toolId = params?.id ?? "unknown-tool";

  const isMultiFile = MULTI_FILE_TOOLS.includes(toolId);
  const needsPageInput = PAGE_INPUT_TOOLS.includes(toolId);

  // Upload method: "device" | "url" | "drive" | "dropbox"
  const [uploadMethod, setUploadMethod] = useState("device");
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [sourceUrl, setSourceUrl] = useState("");
  const [pageInput, setPageInput] = useState("");
  const [status, setStatus] = useState("idle");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [conversionNote, setConversionNote] = useState("");
  const [compressionQuality, setCompressionQuality] = useState(75);
  const [dropboxReady, setDropboxReady] = useState(false);
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef(null);

  /* ---------- Google Picker load ---------- */
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (clientId) loadGooglePicker(clientId).catch(() => { });
  }, []);

  /* ---------- Dropbox SDK ---------- */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.Dropbox) { setDropboxReady(true); return; }
    const s = document.createElement("script");
    s.src = "https://www.dropbox.com/static/api/2/dropins.js";
    s.dataset.appKey = DROPBOX_APP_KEY;
    s.onload = () => setDropboxReady(true);
    s.onerror = () => setDropboxReady(false);
    document.body.appendChild(s);
  }, []);

  /* ---------- Reset on tool change ---------- */
  useEffect(() => {
    setFiles([]);
    setSourceUrl("");
    setStatus("idle");
    setDownloadUrl("");
    setErrorMsg("");
    setPageInput("");
    setConversionNote("");
    setCompressionQuality(75);
    setUploadMethod("device");
  }, [toolId]);

  /* ---------- Drag & Drop ---------- */
  const onDragOver = useCallback((e) => { e.preventDefault(); setDragOver(true); }, []);
  const onDragLeave = useCallback((e) => { e.preventDefault(); setDragOver(false); }, []);
  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer?.files || []);
    if (dropped.length > 0) {
      setFiles(prev => isMultiFile ? [...prev, ...dropped] : [dropped[0]]);
      setSourceUrl("");
      setStatus("uploaded");
      setUploadMethod("device");
    }
  }, [isMultiFile]);

  /* ---------- File input ---------- */
  function onFileChange(e) {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 0) {
      setFiles(prev => isMultiFile ? [...prev, ...selected] : [selected[0]]);
      setSourceUrl("");
      setStatus("uploaded");
    }
  }

  /* ---------- Google Drive ---------- */
  function handleGoogleDrivePick() {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === "YOUR_GOOGLE_CLIENT_ID_HERE") {
      alert("Google Drive OAuth not configured.\n\nPlease add NEXT_PUBLIC_GOOGLE_CLIENT_ID to .env.local.\n\nFor now, use the 'Upload File' or 'Paste URL' option.");
      return;
    }
    openGoogleDrivePicker({
      clientId,
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
      onPick: (f) => {
        setSourceUrl(f.url);
        setFiles([]);
        setStatus("uploaded");
      },
    });
  }

  /* ---------- Dropbox ---------- */
  function handleDropboxPick() {
    if (!dropboxReady || !window.Dropbox) {
      alert("Dropbox is still loading. Please wait a moment and try again.");
      return;
    }
    window.Dropbox.choose({
      success: (dbFiles) => {
        if (dbFiles?.length) {
          setSourceUrl(dbFiles[0].link);
          setFiles([]);
          setStatus("uploaded");
        }
      },
      linkType: "direct",
      multiselect: false,
    });
  }

  /* ---------- Convert ---------- */
  async function handleConvert() {
    setErrorMsg("");
    setConversionNote("");
    setProgress(0);

    if (files.length === 0 && !sourceUrl.trim()) {
      setErrorMsg("Please select a file or provide a URL.");
      return;
    }
    if (toolId === "pdf-merge" && files.length < 2 && !sourceUrl) {
      setErrorMsg("PDF Merge requires at least 2 PDF files.");
      return;
    }

    let progressInterval;
    try {
      setStatus("converting");
      const formData = new FormData();

      // Simulate network & conversion progress up to 95%
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return 95;
          const increment = Math.floor(Math.random() * 5) + 2;
          return prev + increment > 95 ? 95 : prev + increment;
        });
      }, 500);

      if (files.length > 0) {
        if (isMultiFile) {
          files.forEach((f) => formData.append("files", f));
        } else {
          formData.append("file", files[0]);
        }
      } else {
        formData.append("url", sourceUrl.trim());
      }

      if (needsPageInput && pageInput.trim()) {
        formData.append("pages", pageInput.trim());
      }

      if (toolId === "image-compress") {
        if (pageInput.trim()) formData.append("format", pageInput.trim());
        formData.append("quality", compressionQuality.toString());
      }

      const res = await fetch(`${API_BASE}/api/convert/${toolId}`, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      const text = await res.text();
      if (!res.ok) {
        let detail = "Conversion failed.";
        try { detail = JSON.parse(text).detail || detail; } catch { }
        throw new Error(detail);
      }

      const data = JSON.parse(text);
      setProgress(100);
      setDownloadUrl(`${API_BASE}${data.downloadUrl}`.replace('/uploads/', '/api/download/'));
      if (data.note) setConversionNote(data.note);

      // Brief delay so the user sees 100% before it flips to 'ready'
      setTimeout(() => setStatus("ready"), 400);

    } catch (err) {
      console.error(err);
      if (progressInterval) clearInterval(progressInterval);
      setProgress(0);
      setStatus("error");
      setErrorMsg(err.message || "Conversion failed. Please try again.");
    }
  }

  const toolLabel = toolId.replace(/-/g, " ");

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button
        className="text-sm text-gray-500 hover:text-indigo-600 hover:underline mb-6 flex items-center gap-1"
        onClick={() => router.push("/all-tools")}
      >
        ← Back to tools
      </button>

      <h1 className="text-3xl font-bold mb-1 capitalize">{toolLabel}</h1>
      <p className="text-gray-400 mb-8 text-sm">
        {isMultiFile ? "Upload multiple files using any method below." : "Upload from your device, cloud storage, or a link."}
      </p>

      <div
        className={`rounded-2xl border-2 p-6 bg-white transition-all ${dragOver ? "border-indigo-500 bg-indigo-50" : "border-gray-200"}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {/* ── Upload Method Tabs ── */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: "device", icon: "💻", label: "My Device" },
            { id: "url", icon: "🔗", label: "Paste URL" },
            { id: "drive", icon: "🟢", label: "Google Drive" },
            { id: "dropbox", icon: "🔵", label: "Dropbox" },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setUploadMethod(m.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${uploadMethod === m.id
                ? "bg-indigo-600 text-white border-indigo-600 shadow"
                : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400 hover:text-indigo-600"
                }`}
            >
              <span>{m.icon}</span> {m.label}
            </button>
          ))}
        </div>

        {/* ── Method Panels ── */}

        {/* Device Upload */}
        {uploadMethod === "device" && (
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`w-full min-h-[160px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all ${dragOver ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50"
                }`}
            >
              <span className="text-4xl mb-3">📂</span>
              <p className="font-semibold text-gray-700">
                {isMultiFile ? "Click to choose files" : "Click to choose a file"}
              </p>
              <p className="text-xs text-gray-400 mt-1">Or drag & drop here</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple={isMultiFile}
                onChange={onFileChange}
                className="hidden"
              />
            </div>

            {files.length > 0 && (
              <div className="bg-gray-50 rounded-xl px-4 py-3 space-y-3">
                <div className="space-y-1">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-indigo-400">📄</span>
                      <span className="font-medium">{f.name}</span>
                      <span className="text-gray-400">· {Math.round(f.size / 1024)} KB</span>
                    </div>
                  ))}
                  {toolId === "pdf-merge" && files.length < 2 && (
                    <p className="text-xs text-amber-600 pt-1">⚠️ Add at least 2 PDF files to merge.</p>
                  )}
                </div>

                {isMultiFile && (
                  <div className="flex gap-2 pt-2 border-t border-gray-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold hover:bg-indigo-200 transition flex items-center gap-1"
                    >
                      <span>➕</span> Add More Files
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFiles([]);
                      }}
                      className="px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100 transition"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* URL Paste */}
        {uploadMethod === "url" && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Direct file URL (must be a publicly accessible link)
            </label>
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => {
                setSourceUrl(e.target.value);
                setFiles([]);
                setStatus(e.target.value.trim() ? "uploaded" : "idle");
              }}
              placeholder="https://example.com/document.pdf"
              className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {sourceUrl && (
              <p className="text-xs text-green-600">✓ URL ready for conversion</p>
            )}
          </div>
        )}

        {/* Google Drive */}
        {uploadMethod === "drive" && (
          <div className="flex flex-col items-center py-6 gap-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png"
              className="w-16 h-16"
              alt="Google Drive"
            />
            <h3 className="font-semibold text-gray-800">Connect Google Drive</h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              Click below to open the Google Drive file picker and select a file from your Drive.
            </p>
            <button
              onClick={handleGoogleDrivePick}
              className="px-6 py-3 bg-white border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:border-indigo-500 hover:text-indigo-600 transition shadow-sm flex items-center gap-3"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png"
                className="w-5 h-5"
                alt=""
              />
              Open Google Drive Picker
            </button>
            {sourceUrl && uploadMethod === "drive" && (
              <div className="mt-2 text-xs text-green-600 text-center">
                ✓ File selected from Google Drive
              </div>
            )}
            <p className="text-xs text-gray-400 text-center">
              Requires Google OAuth setup in your .env.local file.
            </p>
          </div>
        )}

        {/* Dropbox */}
        {uploadMethod === "dropbox" && (
          <div className="flex flex-col items-center py-6 gap-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg"
              className="w-16 h-16"
              alt="Dropbox"
            />
            <h3 className="font-semibold text-gray-800">Connect Dropbox</h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              Click below to open the Dropbox file chooser and select a file.
            </p>
            <button
              onClick={handleDropboxPick}
              disabled={!dropboxReady}
              className="px-6 py-3 bg-white border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:border-indigo-500 hover:text-indigo-600 transition shadow-sm flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg"
                className="w-5 h-5"
                alt=""
              />
              {dropboxReady ? "Open Dropbox Chooser" : "Loading Dropbox..."}
            </button>
            {sourceUrl && uploadMethod === "dropbox" && (
              <div className="mt-2 text-xs text-green-600 text-center">
                ✓ File selected from Dropbox
              </div>
            )}
          </div>
        )}

        {/* ── Format and Quality selection for image-compress ── */}
        {toolId === "image-compress" && (
          <div className="mt-6 p-5 border border-gray-200 bg-gray-50 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <span className="text-6xl text-indigo-500">📉</span>
            </div>

            <div className="space-y-5 relative z-10 w-full max-w-sm">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Select Output Format
                </label>
                <select
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  className="w-full border shadow-sm rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white"
                >
                  <option value="">Keep Original Format</option>
                  <option value="jpg">Format as JPG</option>
                  <option value="png">Format as PNG</option>
                  <option value="webp">Format as WEBP</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-semibold text-gray-800">
                    Compression Quality
                  </label>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-md">
                    {compressionQuality}%
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={compressionQuality}
                  onChange={(e) => setCompressionQuality(Number(e.target.value))}
                  className="w-full accent-indigo-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-gray-500 mt-1.5 font-medium">
                  <span>Small File (Lower Quality)</span>
                  <span>Balanced</span>
                  <span>Large File (Best Quality)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Page input for split / remove-pages ── */}
        {needsPageInput && (
          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {toolId === "pdf-split"
                ? "Page ranges to split into (e.g. 1-3,4-6) — leave blank to split every page"
                : "Pages to remove (e.g. 2,4-6)"}
            </label>
            <input
              type="text"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              placeholder={toolId === "pdf-split" ? "1-3,4-7 or leave blank" : "2,4-6"}
              className="w-full max-w-xs border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        )}

        {/* ── Status feedback ── */}
        {status === "converting" && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-indigo-600 font-medium">Converting…</span>
              <span className="text-indigo-500 font-bold">{progress}%</span>
            </div>
            <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 text-center">✨ Usually takes just a few seconds</p>
          </div>
        )}

        {status === "ready" && (
          <div className="mt-6 flex flex-col gap-3">
            <div className="text-sm text-green-600 font-medium">✅ Conversion complete!</div>
            {conversionNote && (
              <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                ℹ️ {conversionNote}
              </div>
            )}
            <a
              href={downloadUrl}
              download
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-semibold"
            >
              ⬇️ Download Converted File
            </a>
          </div>
        )}

        {status === "error" && errorMsg && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            ❌ {errorMsg}
          </div>
        )}

        {/* ── Convert Button ── */}
        <button
          onClick={handleConvert}
          disabled={
            status === "converting" ||
            (files.length === 0 && !sourceUrl.trim()) ||
            (toolId === "pdf-merge" && files.length < 2 && !sourceUrl)
          }
          className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold text-base hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow"
        >
          {status === "converting" ? "Converting…" : `Convert`}
        </button>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
