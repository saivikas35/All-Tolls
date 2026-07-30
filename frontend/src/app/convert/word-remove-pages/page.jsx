"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { loadGooglePicker, openGoogleDrivePicker } from "@/lib/googleDrivePicker";

const DROPBOX_APP_KEY = "2t2su51ec3xgf1u";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export default function WordRemovePagesPage() {
    const router = useRouter();

    // Upload state
    const [uploadMethod, setUploadMethod] = useState("device");
    const [file, setFile] = useState(null);
    const [sourceUrl, setSourceUrl] = useState("");
    const [dropboxReady, setDropboxReady] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    // Flow steps: upload | loading | selecting | processing | done | error
    const [step, setStep] = useState("upload");
    const [thumbnails, setThumbnails] = useState([]);
    const [pdfToken, setPdfToken] = useState("");
    const [docxToken, setDocxToken] = useState("");
    const [pageCount, setPageCount] = useState(0);
    const [selected, setSelected] = useState(new Set()); // 1-indexed pages to REMOVE

    // Result
    const [downloadUrl, setDownloadUrl] = useState("");
    const [downloadFormat, setDownloadFormat] = useState(""); // "docx" | "pdf"
    const [errorMsg, setErrorMsg] = useState("");
    const [loadingMsg, setLoadingMsg] = useState("");

    /* ── SDKs ── */
    useEffect(() => {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (clientId) loadGooglePicker(clientId).catch(() => { });
    }, []);

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
            alert("Google Drive OAuth not configured. Use 'Upload File' or 'Paste URL' instead."); return;
        }
        openGoogleDrivePicker({ clientId, apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY, onPick: (f) => { setSourceUrl(f.url); setFile(null); } });
    }

    function handleDropboxPick() {
        if (!dropboxReady || !window.Dropbox) { alert("Dropbox still loading..."); return; }
        window.Dropbox.choose({ success: (files) => { if (files?.length) { setSourceUrl(files[0].link); setFile(null); } }, linkType: "direct", multiselect: false });
    }

    function onDrop(e) {
        e.preventDefault(); setDragOver(false);
        const f = e.dataTransfer?.files?.[0];
        if (f && (f.name.toLowerCase().endsWith(".docx") || f.name.toLowerCase().endsWith(".doc"))) {
            setFile(f); setSourceUrl(""); setUploadMethod("device");
        }
    }

    /* ── Step 1: Upload Word → get PDF preview ── */
    async function handleLoadPages() {
        if (!file && !sourceUrl.trim()) { setErrorMsg("Please select a Word document first."); return; }
        setErrorMsg("");
        setStep("loading");
        setLoadingMsg("Converting Word document to PDF for preview…");

        try {
            const form = new FormData();
            if (file) form.append("file", file);
            else form.append("url", sourceUrl.trim());

            // Step 1a: Convert docx → pdf, get tokens
            const convRes = await fetch(`${API_BASE}/api/convert/word-to-pdf-preview`, { method: "POST", body: form });
            if (!convRes.ok) {
                const j = await convRes.json().catch(() => ({}));
                throw new Error(j.detail || "Failed to convert Word document.");
            }
            const convData = await convRes.json();
            setDocxToken(convData.docxToken);
            const pdfFile = convData.pdfToken;

            setLoadingMsg("Generating page thumbnails…");

            // Step 1b: Get PDF thumbnails
            const previewForm = new FormData();
            previewForm.append("url", `${API_BASE}/uploads/${pdfFile}`);
            const previewRes = await fetch(`${API_BASE}/api/convert/pdf-split/preview`, { method: "POST", body: previewForm });
            if (!previewRes.ok) {
                const j = await previewRes.json().catch(() => ({}));
                throw new Error(j.detail || "Failed to load page previews.");
            }
            const previewData = await previewRes.json();
            setThumbnails(previewData.thumbnails);
            setPageCount(previewData.pageCount);
            setPdfToken(previewData.pdfToken);
            setSelected(new Set());
            setStep("selecting");
        } catch (err) {
            setErrorMsg(err.message || "Error loading document. Make sure it is a valid .docx file.");
            setStep("upload");
        }
    }

    /* ── Toggle page selection ── */
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

    /* ── Step 2: Remove pages and download ── */
    async function handleRemove(outputFormat) {
        if (selected.size === 0) { setErrorMsg("Select at least one page to remove."); return; }
        if (selected.size === pageCount) { setErrorMsg("Cannot remove all pages from the document."); return; }

        setErrorMsg("");
        setStep("processing");

        try {
            const form = new FormData();
            const pagesList = Array.from(selected).sort((a, b) => a - b).join(",");
            form.append("pages", pagesList);
            form.append("output_format", outputFormat);

            if (docxToken) {
                form.append("docx_token", docxToken);
            } else if (file) {
                form.append("file", file);
            } else {
                form.append("url", sourceUrl.trim());
            }

            const res = await fetch(`${API_BASE}/api/convert/word-remove-pages`, { method: "POST", body: form });
            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                throw new Error(j.detail || "Conversion failed.");
            }

            const data = await res.json();
            const relUrl = data.downloadUrl.startsWith("/api/") ? data.downloadUrl : data.downloadUrl.replace("/uploads/", "/api/download/");
            setDownloadUrl(relUrl);
            setDownloadFormat(data.format || outputFormat);
            setStep("done");
        } catch (err) {
            setErrorMsg(err.message || "Failed to remove pages.");
            setStep("selecting");
        }
    }

    function handleReset() {
        setFile(null); setSourceUrl(""); setThumbnails([]); setSelected(new Set());
        setStep("upload"); setDownloadUrl(""); setErrorMsg(""); setPdfToken(""); setDocxToken(""); setDownloadFormat("");
    }

    const UPLOAD_TABS = [
        { id: "device", icon: "💻", label: "My Device" },
        { id: "url", icon: "🔗", label: "Paste URL" },
        { id: "drive", icon: "🟢", label: "Google Drive" },
        { id: "dropbox", icon: "🔵", label: "Dropbox" },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                .wr-wrap { font-family: 'Inter', sans-serif; }
                .fade-in { animation: fadeUp 0.3s ease-out forwards; }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>

            <div className="wr-wrap min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-white py-10 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Back */}
                    <button onClick={() => router.push("/all-tools")}
                        className="mb-8 flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition group">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to tools
                    </button>

                    {/* Hero */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                                <span className="text-2xl">📝</span>
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900">Remove Pages from Word</h1>
                                <p className="text-gray-500 text-sm">Upload a .docx file, select pages to remove, download as Word or PDF</p>
                            </div>
                        </div>
                    </div>

                    {/* ── UPLOAD STEP ── */}
                    {step === "upload" && (
                        <div className={`fade-in rounded-2xl border-2 p-6 bg-white transition-all ${dragOver ? "border-blue-500 bg-blue-50/40" : "border-gray-100 shadow-sm"}`}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
                            onDrop={onDrop}>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {UPLOAD_TABS.map((m) => (
                                    <button key={m.id} onClick={() => setUploadMethod(m.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${uploadMethod === m.id
                                            ? "bg-blue-600 text-white border-blue-600 shadow"
                                            : "bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600"}`}>
                                        <span>{m.icon}</span>{m.label}
                                    </button>
                                ))}
                            </div>

                            {uploadMethod === "device" && (
                                <div onClick={() => fileInputRef.current?.click()}
                                    className="w-full min-h-[160px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all border-gray-200 group">
                                    <span className="text-5xl mb-3 group-hover:scale-110 transition-transform">📄</span>
                                    <p className="font-bold text-gray-800 text-lg">Click to choose a Word file</p>
                                    <p className="text-gray-400 text-sm mt-1">Supports .docx, .doc</p>
                                    <p className="text-gray-300 text-xs mt-1">Or drag & drop here</p>
                                    <input ref={fileInputRef} type="file" accept=".docx,.doc" className="hidden"
                                        onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFile(f); setSourceUrl(""); } }} />
                                </div>
                            )}

                            {uploadMethod === "url" && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Direct Word File URL</label>
                                    <input type="url" value={sourceUrl} onChange={(e) => { setSourceUrl(e.target.value); setFile(null); }}
                                        placeholder="https://example.com/document.docx"
                                        className="w-full border-2 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent border-gray-200" />
                                </div>
                            )}

                            {uploadMethod === "drive" && (
                                <div className="flex flex-col items-center py-4 gap-3">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png" className="w-14 h-14" alt="Google Drive" />
                                    <p className="text-sm text-gray-500 text-center max-w-xs">Select a Word document from your Google Drive.</p>
                                    <button onClick={handleGoogleDrivePick}
                                        className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 transition shadow-sm flex items-center gap-3">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png" className="w-5 h-5" alt="" />
                                        Open Google Drive Picker
                                    </button>
                                    {sourceUrl && <p className="text-xs text-green-600">✓ File selected from Google Drive</p>}
                                </div>
                            )}

                            {uploadMethod === "dropbox" && (
                                <div className="flex flex-col items-center py-4 gap-3">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg" className="w-14 h-14" alt="Dropbox" />
                                    <p className="text-sm text-gray-500 text-center max-w-xs">Select a Word document from your Dropbox.</p>
                                    <button onClick={handleDropboxPick} disabled={!dropboxReady}
                                        className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 transition shadow-sm flex items-center gap-3 disabled:opacity-50">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg" className="w-5 h-5" alt="" />
                                        {dropboxReady ? "Open Dropbox Chooser" : "Loading Dropbox..."}
                                    </button>
                                    {sourceUrl && <p className="text-xs text-green-600">✓ File selected from Dropbox</p>}
                                </div>
                            )}

                            {/* Selected file badge */}
                            {(file || (sourceUrl && uploadMethod !== "drive" && uploadMethod !== "dropbox")) && (
                                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 text-sm text-blue-700 flex items-center gap-2">
                                    <span>📄</span>
                                    <span className="font-medium truncate">{file ? file.name : sourceUrl}</span>
                                </div>
                            )}

                            {errorMsg && (
                                <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">❌ {errorMsg}</div>
                            )}

                            <button onClick={handleLoadPages} disabled={!file && !sourceUrl.trim()}
                                className="mt-6 w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:opacity-90 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition shadow-md">
                                Load Word Pages →
                            </button>
                        </div>
                    )}

                    {/* ── LOADING STEP ── */}
                    {step === "loading" && (
                        <div className="fade-in bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center gap-5">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full border-4 border-gray-100 flex items-center justify-center">
                                    <span className="text-3xl animate-pulse">📝</span>
                                </div>
                                <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                            </div>
                            <p className="text-gray-700 font-medium text-center">{loadingMsg}</p>
                            <p className="text-xs text-gray-400">This may take a moment for large documents…</p>
                        </div>
                    )}

                    {/* ── SELECTING STEP ── */}
                    {step === "selecting" && (
                        <div className="fade-in space-y-5">
                            {/* Toolbar */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <span className="font-semibold text-gray-800">{pageCount} pages</span>
                                    <span className="text-gray-400 text-sm ml-2">— click pages to mark for removal</span>
                                </div>
                                <div className="flex gap-2 items-center flex-wrap">
                                    <span className={`text-sm font-medium ${selected.size > 0 ? "text-red-600" : "text-gray-400"}`}>
                                        {selected.size} selected
                                    </span>
                                    <button onClick={selectAll} className="px-3 py-1.5 border rounded-lg text-xs hover:bg-red-50 hover:border-red-300 text-gray-600 transition">Select All</button>
                                    <button onClick={clearAll} className="px-3 py-1.5 border rounded-lg text-xs hover:bg-gray-50 text-gray-600 transition">Clear</button>
                                    <button onClick={handleReset} className="px-3 py-1.5 border rounded-lg text-xs hover:bg-gray-50 text-gray-600 transition">↩ New File</button>
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
                                        <div key={thumb.page} onClick={() => togglePage(thumb.page)}
                                            className={`relative cursor-pointer rounded-xl border-2 overflow-hidden transition-all group ${isSelected
                                                ? "border-red-500 ring-2 ring-red-300 shadow-md"
                                                : "border-gray-200 hover:border-blue-400 hover:shadow"}`}>
                                            <img src={thumb.dataUrl} alt={`Page ${thumb.page}`}
                                                className={`w-full object-cover transition-all ${isSelected ? "opacity-40" : "opacity-100"}`} />

                                            {isSelected && (
                                                <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                                                    <div className="bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}

                                            <div className={`absolute bottom-0 inset-x-0 text-center text-xs font-semibold py-1 ${isSelected ? "bg-red-500 text-white" : "bg-black/50 text-white"}`}>
                                                {isSelected ? `✗ Page ${thumb.page}` : `Page ${thumb.page}`}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {errorMsg && (
                                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">❌ {errorMsg}</div>
                            )}

                            {/* Action bar — sticky bottom */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-4 flex flex-wrap items-center justify-between gap-3 sticky bottom-4">
                                <div className="text-sm text-gray-600">
                                    {selected.size > 0
                                        ? <><span className="font-semibold text-red-600">{selected.size}</span> page{selected.size > 1 ? "s" : ""} will be removed · <span className="text-green-600 font-semibold">{pageCount - selected.size}</span> will remain</>
                                        : <span className="text-gray-400">No pages selected — click pages above to mark for removal</span>
                                    }
                                </div>

                                <div className="flex gap-2">
                                    <button onClick={() => handleRemove("docx")}
                                        disabled={selected.size === 0 || selected.size === pageCount}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow-md text-sm">
                                        📝 Remove & Download Word
                                    </button>
                                    <button onClick={() => handleRemove("pdf")}
                                        disabled={selected.size === 0 || selected.size === pageCount}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow-md text-sm">
                                        📄 Remove & Download PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── PROCESSING STEP ── */}
                    {step === "processing" && (
                        <div className="fade-in bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center gap-5">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full border-4 border-gray-100 flex items-center justify-center">
                                    <span className="text-3xl animate-pulse">⚙️</span>
                                </div>
                                <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                            </div>
                            <p className="text-gray-700 font-semibold">Removing pages and generating your document…</p>
                            <p className="text-xs text-gray-400 text-center">For PDF output, an extra conversion step is performed via LibreOffice.</p>
                        </div>
                    )}

                    {/* ── DONE STEP ── */}
                    {step === "done" && (
                        <div className="fade-in bg-white rounded-2xl border border-green-100 shadow-sm p-10 flex flex-col items-center gap-5 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-white text-2xl font-bold">✓</span>
                            </div>
                            <h2 className="text-xl font-extrabold text-green-700">Pages Removed!</h2>
                            <p className="text-sm text-gray-500">
                                Your document with <strong>{pageCount - selected.size}</strong> remaining page{pageCount - selected.size !== 1 ? "s" : ""} is ready.
                            </p>

                            <div className="w-full max-w-sm">
                                {downloadFormat === "docx" ? (
                                    <a href={`${API_BASE}${downloadUrl}`} download
                                        className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:opacity-90 transition shadow-lg text-lg">
                                        <span className="text-2xl">📝</span>
                                        Download Word (.docx)
                                    </a>
                                ) : (
                                    <a href={`${API_BASE}${downloadUrl}`} download
                                        className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl font-bold hover:opacity-90 transition shadow-lg text-lg">
                                        <span className="text-2xl">📄</span>
                                        Download PDF
                                    </a>
                                )}
                            </div>

                            <div className="flex gap-3 mt-2">
                                <button onClick={() => setStep("selecting")}
                                    className="px-5 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition text-sm">
                                    ← Back to pages
                                </button>
                                <button onClick={handleReset}
                                    className="px-5 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition text-sm">
                                    Start over
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
