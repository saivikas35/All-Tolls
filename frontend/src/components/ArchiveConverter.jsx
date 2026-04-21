"use client";

import { useEffect, useRef, useState } from "react";
import { loadGooglePicker, openGoogleDrivePicker } from "@/lib/googleDrivePicker";

const DROPBOX_APP_KEY = "2t2su51ec3xgf1u";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function ArchiveConverter() {
  const [uploadMethod, setUploadMethod] = useState("device");
  const [file, setFile] = useState(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [target, setTarget] = useState("zip_to_rar");
  const [busy, setBusy] = useState(false);
  const [resp, setResp] = useState(null);
  const [error, setError] = useState("");
  const [dropboxReady, setDropboxReady] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  /* ---------- Google Picker ---------- */
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (clientId) loadGooglePicker(clientId).catch(() => { });
  }, []);

  /* ---------- Dropbox SDK ---------- */
  useEffect(() => {
    if (window.Dropbox) { setDropboxReady(true); return; }
    const s = document.createElement("script");
    s.src = "https://www.dropbox.com/static/api/2/dropins.js";
    s.dataset.appKey = DROPBOX_APP_KEY;
    s.onload = () => setDropboxReady(true);
    s.onerror = () => setDropboxReady(false);
    document.body.appendChild(s);
  }, []);

  function handleGoogleDrivePick() {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === "YOUR_GOOGLE_CLIENT_ID_HERE") {
      alert("Google Drive OAuth not configured.\n\nAdd NEXT_PUBLIC_GOOGLE_CLIENT_ID to .env.local.\n\nFor now, use 'Upload File' or 'Paste URL'.");
      return;
    }
    openGoogleDrivePicker({
      clientId,
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
      onPick: (f) => { setSourceUrl(f.url); setFile(null); },
    });
  }

  function handleDropboxPick() {
    if (!dropboxReady || !window.Dropbox) { alert("Dropbox is still loading. Try again."); return; }
    window.Dropbox.choose({
      success: (files) => { if (files?.length) { setSourceUrl(files[0].link); setFile(null); } },
      linkType: "direct",
      multiselect: false,
    });
  }

  function onDragOver(e) { e.preventDefault(); setDragOver(true); }
  function onDragLeave(e) { e.preventDefault(); setDragOver(false); }
  function onDrop(e) {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer?.files?.[0];
    if (f) { setFile(f); setSourceUrl(""); setUploadMethod("device"); }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResp(null);

    if (!file && !sourceUrl.trim()) return setError("Please select or link a file first.");

    setBusy(true);
    try {
      const form = new FormData();
      if (file) form.append("file", file);
      else form.append("url", sourceUrl.trim());
      form.append("target", target);

      const res = await fetch(`${API_BASE}/api/archive/convert`, { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) setError(json?.detail || json?.error || "Conversion failed");
      else setResp(json);
    } catch (err) {
      setError(String(err));
    } finally {
      setBusy(false);
    }
  }

  function handleReset() { setFile(null); setSourceUrl(""); setResp(null); setError(""); }

  const UPLOAD_TABS = [
    { id: "device", icon: "💻", label: "My Device" },
    { id: "url", icon: "🔗", label: "Paste URL" },
    { id: "drive", icon: "🟢", label: "Google Drive" },
    { id: "dropbox", icon: "🔵", label: "Dropbox" },
  ];

  const hasFile = file || sourceUrl.trim();

  return (
    <div
      className={`rounded-2xl border-2 p-6 bg-white transition-all ${dragOver ? "border-indigo-500 bg-indigo-50" : "border-gray-200"}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* ── Upload Method Tabs ── */}
      <div className="flex flex-wrap gap-2 mb-6">
        {UPLOAD_TABS.map((m) => (
          <button
            key={m.id}
            type="button"
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

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── My Device ── */}
        {uploadMethod === "device" && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`w-full min-h-[140px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all ${dragOver ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50"
              }`}
          >
            <span className="text-4xl mb-2">📂</span>
            <p className="font-semibold text-gray-700">Click to choose a file</p>
            <p className="text-xs text-gray-400 mt-1">Or drag & drop here · .zip, .rar, .7z</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip,.rar,.7z"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFile(f); setSourceUrl(""); } }}
            />
          </div>
        )}

        {/* ── Paste URL ── */}
        {uploadMethod === "url" && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Direct file URL</label>
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => { setSourceUrl(e.target.value); setFile(null); }}
              placeholder="https://example.com/archive.zip"
              className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        )}

        {/* ── Google Drive ── */}
        {uploadMethod === "drive" && (
          <div className="flex flex-col items-center py-4 gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png" className="w-14 h-14" alt="Google Drive" />
            <p className="text-sm text-gray-500 text-center max-w-xs">Select a file from your Google Drive.</p>
            <button type="button" onClick={handleGoogleDrivePick}
              className="px-6 py-3 bg-white border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:border-indigo-500 hover:text-indigo-600 transition shadow-sm flex items-center gap-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png" className="w-5 h-5" alt="" />
              Open Google Drive Picker
            </button>
            {sourceUrl && <p className="text-xs text-green-600">✓ File selected from Google Drive</p>}
          </div>
        )}

        {/* ── Dropbox ── */}
        {uploadMethod === "dropbox" && (
          <div className="flex flex-col items-center py-4 gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg" className="w-14 h-14" alt="Dropbox" />
            <p className="text-sm text-gray-500 text-center max-w-xs">Select a file from your Dropbox.</p>
            <button type="button" onClick={handleDropboxPick} disabled={!dropboxReady}
              className="px-6 py-3 bg-white border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:border-indigo-500 hover:text-indigo-600 transition shadow-sm flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg" className="w-5 h-5" alt="" />
              {dropboxReady ? "Open Dropbox Chooser" : "Loading Dropbox..."}
            </button>
            {sourceUrl && <p className="text-xs text-green-600">✓ File selected from Dropbox</p>}
          </div>
        )}

        {/* ── Selected file indicator ── */}
        {file && (
          <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 flex items-center gap-2">
            <span className="text-indigo-400">📦</span>
            <span className="font-medium">{file.name}</span>
            <span className="text-gray-400">· {Math.round(file.size / 1024)} KB</span>
          </div>
        )}

        {/* ── Conversion target ── */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Conversion Type</label>
          <div className="flex gap-3">
            {[
              { value: "zip_to_rar", label: "ZIP → RAR" },
              { value: "rar_to_zip", label: "RAR → ZIP" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTarget(opt.value)}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${target === opt.value
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Status/Result ── */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">❌ {error}</div>
        )}

        {resp && (
          <div className="space-y-2">
            {resp.note && (
              <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                ℹ️ {resp.note}
              </div>
            )}
            {resp.downloadUrl && (
              <a
                href={`${API_BASE}${resp.downloadUrl}`.replace('/uploads/', '/api/download/')}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold transition"
              >
                ⬇️ Download Converted Archive
              </a>
            )}
          </div>
        )}

        {/* ── Action buttons ── */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={busy || !hasFile}
            className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow"
          >
            {busy ? "Converting…" : "Convert"}
          </button>
          <button type="button" onClick={handleReset}
            className="px-5 py-3 border rounded-xl text-gray-600 hover:bg-gray-50 transition">
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
