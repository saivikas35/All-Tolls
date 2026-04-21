"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { loadGooglePicker, openGoogleDrivePicker } from "@/lib/googleDrivePicker";

const DROPBOX_APP_KEY = "2t2su51ec3xgf1u";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function PdfRemovePagesPage() {
    const router = useRouter();

    // Upload state
    const [uploadMethod, setUploadMethod] = useState("device");
    const [file, setFile] = useState(null);
    const [sourceUrl, setSourceUrl] = useState("");
    const [dropboxReady, setDropboxReady] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    // After upload state
    const [step, setStep] = useState("upload"); // upload | selecting | processing | done | error
    const [thumbnails, setThumbnails] = useState([]);
    const [pdfToken, setPdfToken] = useState("");
    const [pageCount, setPageCount] = useState(0);
    const [selected, setSelected] = useState(new Set()); // set of 1-indexed page numbers to REMOVE

    // Result
    const [downloadUrl, setDownloadUrl] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loadingThumbs, setLoadingThumbs] = useState(false);

    /* ---------- Google Picker ---------- */
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
        document.body.appendChild(s);
    }, []);

    function handleGoogleDrivePick() {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (!clientId || clientId === "YOUR_GOOGLE_CLIENT_ID_HERE") {
            alert("Google Drive OAuth not configured. Use 'Upload File' or 'Paste URL' instead.");
            return;
        }
        openGoogleDrivePicker({
            clientId,
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
            onPick: (f) => { setSourceUrl(f.url); setFile(null); },
        });
    }

    function handleDropboxPick() {
        if (!dropboxReady || !window.Dropbox) { alert("Dropbox still loading..."); return; }
        window.Dropbox.choose({
            success: (files) => { if (files?.length) { setSourceUrl(files[0].link); setFile(null); } },
            linkType: "direct",
            multiselect: false,
        });
    }

    function onDrop(e) {
        e.preventDefault(); setDragOver(false);
        const f = e.dataTransfer?.files?.[0];
        if (f && f.name.toLowerCase().endsWith(".pdf")) {
            setFile(f); setSourceUrl(""); setUploadMethod("device");
        }
    }

    /* ---------- Step 1: Load thumbnails ---------- */
    async function handleLoadPages() {
        if (!file && !sourceUrl.trim()) {
            setErrorMsg("Please select a PDF file first.");
            return;
        }
        setErrorMsg("");
        setLoadingThumbs(true);

        try {
            const form = new FormData();
            if (file) form.append("file", file);
            else form.append("url", sourceUrl.trim());

            const res = await fetch(`${API_BASE}/api/convert/pdf-split/preview`, {
                method: "POST",
                body: form,
            });

            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                throw new Error(j.detail || "Failed to load PDF pages.");
            }

            const data = await res.json();
            setThumbnails(data.thumbnails);
            setPageCount(data.pageCount);
            setPdfToken(data.pdfToken);
            setSelected(new Set());
            setStep("selecting");
        } catch (err) {
            setErrorMsg(err.message || "Error loading PDF. Make sure it is a valid PDF.");
        } finally {
            setLoadingThumbs(false);
        }
    }

    /* ---------- Toggle page selection ---------- */
    function togglePage(pageNum) {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(pageNum)) next.delete(pageNum);
            else next.add(pageNum);
            return next;
        });
    }

    function selectAll() { setSelected(new Set(thumbnails.map((t) => t.page))); }
    function clearAll() { setSelected(new Set()); }

    /* ---------- Step 2: Remove selected pages ---------- */
    async function handleRemove() {
        if (selected.size === 0) { setErrorMsg("Select at least one page to remove."); return; }
        if (selected.size === pageCount) { setErrorMsg("Cannot remove all pages from a PDF."); return; }

        setErrorMsg("");
        setStep("processing");

        try {
            const form = new FormData();
            // We'll send the pages list as comma-separated 1-indexed numbers
            const pagesList = Array.from(selected).sort((a, b) => a - b).join(",");
            form.append("pages", pagesList);

            // Re-upload the original file for the remove endpoint
            // (or re-use original file if it was device upload)
            if (file) {
                form.append("file", file);
            } else {
                form.append("url", sourceUrl.trim());
            }

            const res = await fetch(`${API_BASE}/api/convert/pdf-remove-pages`, {
                method: "POST",
                body: form,
            });

            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                throw new Error(j.detail || "Conversion failed.");
            }

            const data = await res.json();
            setDownloadUrl(`${API_BASE}${data.downloadUrl}`.replace('/uploads/', '/api/download/'));
            setStep("done");
        } catch (err) {
            setErrorMsg(err.message || "Failed to remove pages.");
            setStep("selecting");
        }
    }

    function handleReset() {
        setFile(null); setSourceUrl(""); setThumbnails([]); setSelected(new Set());
        setStep("upload"); setDownloadUrl(""); setErrorMsg(""); setPdfToken("");
    }

    const UPLOAD_TABS = [
        { id: "device", icon: "💻", label: "My Device" },
        { id: "url", icon: "🔗", label: "Paste URL" },
        { id: "drive", icon: "🟢", label: "Google Drive" },
        { id: "dropbox", icon: "🔵", label: "Dropbox" },
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            {/* Header */}
            <button
                className="text-sm text-gray-500 hover:text-indigo-600 hover:underline mb-6 flex items-center gap-1"
                onClick={() => router.push("/all-tools")}
            >
                ← Back to tools
            </button>
            <h1 className="text-3xl font-bold mb-1">Remove PDF Pages</h1>
            <p className="text-gray-400 text-sm mb-8">
                Upload a PDF, select the pages you want to remove, then download the result.
            </p>

            {/* ─────────── STEP 1: Upload ─────────── */}
            {step === "upload" && (
                <div
                    className={`rounded-2xl border-2 p-6 bg-white transition-all ${dragOver ? "border-indigo-500 bg-indigo-50" : "border-gray-200"}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
                    onDrop={onDrop}
                >
                    {/* Upload method tabs */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {UPLOAD_TABS.map((m) => (
                            <button key={m.id} onClick={() => setUploadMethod(m.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${uploadMethod === m.id
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow"
                                    : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400 hover:text-indigo-600"
                                    }`}>
                                <span>{m.icon}</span> {m.label}
                            </button>
                        ))}
                    </div>

                    {/* My Device */}
                    {uploadMethod === "device" && (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full min-h-[140px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all border-gray-300"
                        >
                            <span className="text-4xl mb-2">📄</span>
                            <p className="font-semibold text-gray-700">Click to choose a PDF</p>
                            <p className="text-xs text-gray-400 mt-1">Or drag & drop here</p>
                            <input ref={fileInputRef} type="file" accept=".pdf" className="hidden"
                                onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFile(f); setSourceUrl(""); } }} />
                        </div>
                    )}

                    {/* Paste URL */}
                    {uploadMethod === "url" && (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Direct PDF URL</label>
                            <input type="url" value={sourceUrl} onChange={(e) => { setSourceUrl(e.target.value); setFile(null); }}
                                placeholder="https://example.com/document.pdf"
                                className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                        </div>
                    )}

                    {/* Google Drive */}
                    {uploadMethod === "drive" && (
                        <div className="flex flex-col items-center py-4 gap-3">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png" className="w-14 h-14" alt="Google Drive" />
                            <p className="text-sm text-gray-500 text-center max-w-xs">Select a PDF from your Google Drive.</p>
                            <button onClick={handleGoogleDrivePick}
                                className="px-6 py-3 bg-white border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:border-indigo-500 hover:text-indigo-600 transition shadow-sm flex items-center gap-3">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png" className="w-5 h-5" alt="" />
                                Open Google Drive Picker
                            </button>
                            {sourceUrl && <p className="text-xs text-green-600">✓ File selected from Google Drive</p>}
                        </div>
                    )}

                    {/* Dropbox */}
                    {uploadMethod === "dropbox" && (
                        <div className="flex flex-col items-center py-4 gap-3">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg" className="w-14 h-14" alt="Dropbox" />
                            <p className="text-sm text-gray-500 text-center max-w-xs">Select a PDF from your Dropbox.</p>
                            <button onClick={handleDropboxPick} disabled={!dropboxReady}
                                className="px-6 py-3 bg-white border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:border-indigo-500 hover:text-indigo-600 transition shadow-sm flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg" className="w-5 h-5" alt="" />
                                {dropboxReady ? "Open Dropbox Chooser" : "Loading Dropbox..."}
                            </button>
                            {sourceUrl && <p className="text-xs text-green-600">✓ File selected from Dropbox</p>}
                        </div>
                    )}

                    {/* Selected file badge */}
                    {(file || (sourceUrl && uploadMethod !== "drive" && uploadMethod !== "dropbox")) && (
                        <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2 text-sm text-indigo-700 flex items-center gap-2">
                            <span>📄</span>
                            <span className="font-medium">{file ? file.name : sourceUrl}</span>
                        </div>
                    )}

                    {/* Error */}
                    {errorMsg && (
                        <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">❌ {errorMsg}</div>
                    )}

                    {/* Load Pages button */}
                    <button
                        onClick={handleLoadPages}
                        disabled={loadingThumbs || (!file && !sourceUrl.trim())}
                        className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow flex items-center justify-center gap-2"
                    >
                        {loadingThumbs ? (
                            <>
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Loading pages…
                            </>
                        ) : "Load PDF Pages →"}
                    </button>
                </div>
            )}

            {/* ─────────── STEP 2: Page grid selector ─────────── */}
            {step === "selecting" && (
                <div className="space-y-6">
                    {/* Toolbar */}
                    <div className="bg-white rounded-2xl border-2 border-gray-200 p-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <span className="font-semibold text-gray-800">{pageCount} pages</span>
                            <span className="text-gray-400 text-sm ml-2">— click pages to mark for removal</span>
                        </div>
                        <div className="flex gap-2 items-center">
                            <span className={`text-sm font-medium ${selected.size > 0 ? "text-red-600" : "text-gray-400"}`}>
                                {selected.size} selected
                            </span>
                            <button onClick={selectAll} className="px-3 py-1.5 border rounded-lg text-xs hover:bg-red-50 hover:border-red-300 text-gray-600 transition">
                                Select All
                            </button>
                            <button onClick={clearAll} className="px-3 py-1.5 border rounded-lg text-xs hover:bg-gray-50 text-gray-600 transition">
                                Clear
                            </button>
                            <button onClick={handleReset} className="px-3 py-1.5 border rounded-lg text-xs hover:bg-gray-50 text-gray-600 transition">
                                ↩ New File
                            </button>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded border-2 border-gray-200 bg-white" /> Keep</div>
                        <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded border-2 border-red-500 bg-red-100" /> Remove</div>
                    </div>

                    {/* Page grid */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                        {thumbnails.map((thumb) => {
                            const isSelected = selected.has(thumb.page);
                            return (
                                <div
                                    key={thumb.page}
                                    onClick={() => togglePage(thumb.page)}
                                    className={`relative cursor-pointer rounded-xl border-2 overflow-hidden transition-all group ${isSelected
                                        ? "border-red-500 ring-2 ring-red-300 shadow-md"
                                        : "border-gray-200 hover:border-indigo-400 hover:shadow"
                                        }`}
                                >
                                    {/* Thumbnail image */}
                                    <img
                                        src={thumb.dataUrl}
                                        alt={`Page ${thumb.page}`}
                                        className={`w-full object-cover transition-all ${isSelected ? "opacity-50" : "opacity-100"}`}
                                    />

                                    {/* Red overlay on selected */}
                                    {isSelected && (
                                        <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                                            <div className="bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}

                                    {/* Page number badge */}
                                    <div className={`absolute bottom-0 inset-x-0 text-center text-xs font-semibold py-1 ${isSelected ? "bg-red-500 text-white" : "bg-black/50 text-white"
                                        }`}>
                                        {isSelected ? `✗ Page ${thumb.page}` : `Page ${thumb.page}`}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Error */}
                    {errorMsg && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">❌ {errorMsg}</div>
                    )}

                    {/* Action bar */}
                    <div className="bg-white rounded-2xl border-2 border-gray-200 p-4 flex flex-wrap items-center justify-between gap-3 sticky bottom-4 shadow-lg">
                        <div className="text-sm text-gray-600">
                            {selected.size > 0
                                ? <><span className="font-semibold text-red-600">{selected.size}</span> page{selected.size > 1 ? "s" : ""} will be removed · <span className="text-green-600 font-semibold">{pageCount - selected.size}</span> will remain</>
                                : <span className="text-gray-400">No pages selected — click pages above to mark them for removal</span>
                            }
                        </div>
                        <button
                            onClick={handleRemove}
                            disabled={selected.size === 0 || selected.size === pageCount}
                            className="px-8 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow"
                        >
                            Remove {selected.size > 0 ? `${selected.size} Page${selected.size > 1 ? "s" : ""}` : "Pages"}
                        </button>
                    </div>
                </div>
            )}

            {/* ─────────── Processing ─────────── */}
            {step === "processing" && (
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-12 flex flex-col items-center gap-4">
                    <svg className="animate-spin h-10 w-10 text-indigo-600" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <p className="text-gray-600 font-medium">Removing pages and generating your PDF…</p>
                </div>
            )}

            {/* ─────────── Done ─────────── */}
            {step === "done" && (
                <div className="bg-white rounded-2xl border-2 border-green-200 p-10 flex flex-col items-center gap-5">
                    <div className="text-5xl">✅</div>
                    <h2 className="text-xl font-bold text-green-700">Pages removed successfully!</h2>
                    <p className="text-sm text-gray-500">Your PDF with <strong>{pageCount - selected.size}</strong> remaining pages is ready.</p>
                    <a
                        href={downloadUrl}
                        download
                        className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition shadow flex items-center gap-2"
                    >
                        ⬇️ Download PDF
                    </a>
                    <button onClick={handleReset} className="text-sm text-gray-500 hover:underline">
                        Start over with another PDF
                    </button>
                </div>
            )}
        </div>
    );
}
