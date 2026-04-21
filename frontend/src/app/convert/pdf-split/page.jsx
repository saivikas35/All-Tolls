"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { loadGooglePicker, openGoogleDrivePicker } from "@/lib/googleDrivePicker";

const DROPBOX_APP_KEY = "2t2su51ec3xgf1u";
let API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    API_BASE = "http://localhost:8000";
}

export default function PdfSplitPage() {
    const router = useRouter();

    // Upload method: "device" | "url" | "drive" | "dropbox"
    const [uploadMethod, setUploadMethod] = useState("device");
    const [dragOver, setDragOver] = useState(false);
    const [file, setFile] = useState(null);
    const [sourceUrl, setSourceUrl] = useState("");
    const [dropboxReady, setDropboxReady] = useState(false);

    // Splitter State
    const [step, setStep] = useState("upload"); // "upload", "analyzing", "select", "converting", "ready", "error"
    const [errorMsg, setErrorMsg] = useState("");

    const [pdfToken, setPdfToken] = useState("");
    const [thumbnails, setThumbnails] = useState([]);
    const [selectedPages, setSelectedPages] = useState(new Set());
    const [lastClickedIdx, setLastClickedIdx] = useState(null);

    const [splitMode, setSplitMode] = useState("separate"); // "separate", "merge", "custom"
    const [customRanges, setCustomRanges] = useState("");

    const [progress, setProgress] = useState(0);
    const [downloadUrl, setDownloadUrl] = useState("");

    const fileInputRef = useRef(null);

    /* ---------- Google Picker & Dropbox SDK ---------- */
    useEffect(() => {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (clientId) loadGooglePicker(clientId).catch(() => { });

        if (typeof window === "undefined") return;
        if (window.Dropbox) { setDropboxReady(true); return; }
        const s = document.createElement("script");
        s.src = "https://www.dropbox.com/static/api/2/dropins.js";
        s.dataset.appKey = DROPBOX_APP_KEY;
        s.onload = () => setDropboxReady(true);
        s.onerror = () => setDropboxReady(false);
        document.body.appendChild(s);
    }, []);

    /* ---------- Drag & Drop ---------- */
    const onDragOver = useCallback((e) => { e.preventDefault(); setDragOver(true); }, []);
    const onDragLeave = useCallback((e) => { e.preventDefault(); setDragOver(false); }, []);
    const onDrop = useCallback((e) => {
        e.preventDefault();
        setDragOver(false);
        const dropped = Array.from(e.dataTransfer?.files || []);
        if (dropped.length > 0) {
            handleFileSelected(dropped[0]);
        }
    }, []);

    function onFileChange(e) {
        const selected = Array.from(e.target.files || []);
        if (selected.length > 0) {
            handleFileSelected(selected[0]);
        }
    }

    function handleGoogleDrivePick() {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (!clientId || clientId === "YOUR_GOOGLE_CLIENT_ID_HERE") {
            alert("Google Drive OAuth not configured.");
            return;
        }
        openGoogleDrivePicker({
            clientId,
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
            onPick: (f) => handleUrlSelected(f.url),
        });
    }

    function handleDropboxPick() {
        if (!dropboxReady || !window.Dropbox) return;
        window.Dropbox.choose({
            success: (dbFiles) => {
                if (dbFiles?.length) handleUrlSelected(dbFiles[0].link);
            },
            linkType: "direct",
            multiselect: false,
        });
    }

    function handleFileSelected(f) {
        if (!f.name.toLowerCase().endsWith(".pdf")) {
            alert("Please upload a PDF file.");
            return;
        }
        setFile(f);
        setSourceUrl("");
        analyzePdf(f, null);
    }

    function handleUrlSelected(url) {
        setSourceUrl(url);
        setFile(null);
        analyzePdf(null, url);
    }

    /* ---------- Backend Analysis ---------- */
    async function analyzePdf(fileObj, urlStr) {
        try {
            setStep("analyzing");
            setErrorMsg("");
            const formData = new FormData();
            if (fileObj) formData.append("file", fileObj);
            else if (urlStr) formData.append("url", urlStr);

            const res = await fetch(`${API_BASE}/api/convert/pdf-split/preview`, {
                method: "POST",
                body: formData,
            });

            const text = await res.text();
            if (!res.ok) throw new Error(JSON.parse(text).detail || "Failed to analyze PDF.");

            const data = JSON.parse(text);
            if (data.thumbnails && data.thumbnails.length > 0) {
                setThumbnails(data.thumbnails);
                setPdfToken(data.pdfToken);
                setSelectedPages(new Set(data.thumbnails.map(t => t.page))); // Select all by default
                setStep("select");
            } else {
                throw new Error("No pages found in PDF.");
            }
        } catch (err) {
            console.error(err);
            setErrorMsg(err.message || "Failed to load PDF preview.");
            setStep("error");
        }
    }

    /* ---------- Selection Logic ---------- */
    const togglePage = (pageStr, index, e) => {
        e.preventDefault();
        const page = parseInt(pageStr);
        const newSet = new Set(selectedPages);

        if (e.shiftKey && lastClickedIdx !== null) {
            // Shift click logic
            const start = Math.min(lastClickedIdx, index);
            const end = Math.max(lastClickedIdx, index);

            const isSelecting = !selectedPages.has(thumbnails[index].page); // Base it on target state

            for (let i = start; i <= end; i++) {
                const p = thumbnails[i].page;
                if (isSelecting) newSet.add(p);
                else newSet.delete(p);
            }
        } else {
            if (newSet.has(page)) newSet.delete(page);
            else newSet.add(page);
        }

        setSelectedPages(newSet);
        setLastClickedIdx(index);
    };

    const selectAll = () => setSelectedPages(new Set(thumbnails.map(t => t.page)));
    const deselectAll = () => setSelectedPages(new Set());

    /* ---------- Execution Logic ---------- */
    async function handleExecuteSplit() {
        if (selectedPages.size === 0) {
            alert("Please select at least one page to split.");
            return;
        }

        let progressInterval;
        try {
            setStep("converting");
            setErrorMsg("");
            setProgress(0);

            progressInterval = setInterval(() => {
                setProgress(prev => Math.min(prev + Math.floor(Math.random() * 5) + 2, 95));
            }, 500);

            const formData = new FormData();
            formData.append("pdfToken", pdfToken);
            formData.append("split_mode", splitMode);

            if (splitMode === "custom") {
                formData.append("pages", customRanges);
            } else {
                // Sort selected pages
                const sorted = Array.from(selectedPages).sort((a, b) => a - b);
                formData.append("pages", sorted.join(","));
            }

            const res = await fetch(`${API_BASE}/api/convert/pdf-split`, {
                method: "POST",
                body: formData,
            });

            clearInterval(progressInterval);
            const text = await res.text();
            if (!res.ok) throw new Error(JSON.parse(text).detail || "Failed to split PDF.");

            const data = JSON.parse(text);
            setProgress(100);
            setDownloadUrl(`${API_BASE}${data.downloadUrl}`.replace('/uploads/', '/api/download/'));

            setTimeout(() => setStep("ready"), 400);

        } catch (err) {
            console.error(err);
            if (progressInterval) clearInterval(progressInterval);
            setProgress(0);
            setErrorMsg(err.message || "Failed to split PDF.");
            setStep("error");
        }
    }

    // Calculate pages visually string
    const sortedSelected = Array.from(selectedPages).sort((a, b) => a - b);
    const selectionString = sortedSelected.join(", ");

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <button className="text-sm text-gray-500 hover:text-indigo-600 hover:underline mb-6 flex items-center gap-1" onClick={() => router.push("/all-tools")}>
                ← Back to tools
            </button>

            {/* Header */}
            <h1 className="text-3xl font-bold mb-1">Split PDF</h1>
            <p className="text-gray-500 mb-8 max-w-2xl text-sm">
                Extract pages from your PDF or save each page as a separate PDF. Select the pages you want to keep.
            </p>

            {/* Upload Phase */}
            {step === "upload" && (
                <div className={`rounded-2xl border-2 p-8 transition-all bg-white ${dragOver ? "border-indigo-500 bg-indigo-50" : "border-gray-200"}`} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
                    <div className="flex flex-wrap gap-2 mb-8 justify-center">
                        {[{ id: "device", icon: "💻", label: "My Device" }, { id: "url", icon: "🔗", label: "Paste URL" }, { id: "drive", icon: "🟢", label: "Google Drive" }, { id: "dropbox", icon: "🔵", label: "Dropbox" }].map(m => (
                            <button key={m.id} onClick={() => setUploadMethod(m.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-medium transition-all ${uploadMethod === m.id ? "bg-indigo-600 text-white border-indigo-600 shadow" : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"}`}>
                                <span>{m.icon}</span> {m.label}
                            </button>
                        ))}
                    </div>

                    {uploadMethod === "device" && (
                        <div onClick={() => fileInputRef.current?.click()} className="w-full min-h-[200px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30">
                            <span className="text-5xl mb-4">📄</span>
                            <p className="font-semibold text-lg text-gray-700">Select PDF file</p>
                            <p className="text-sm text-gray-400 mt-1">or drop PDF here</p>
                            <input ref={fileInputRef} type="file" accept=".pdf" onChange={onFileChange} className="hidden" />
                        </div>
                    )}

                    {uploadMethod === "url" && (
                        <div className="max-w-xl mx-auto space-y-4 pt-4">
                            <input type="url" value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} placeholder="https://example.com/document.pdf" className="w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                            <button onClick={() => handleUrlSelected(sourceUrl)} disabled={!sourceUrl.trim()} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold disabled:opacity-50">Extract Pages</button>
                        </div>
                    )}
                    {uploadMethod === "drive" && (
                        <div className="flex justify-center pt-4">
                            <button onClick={handleGoogleDrivePick} className="px-6 py-3 bg-white border-2 rounded-xl font-medium text-gray-700 hover:border-indigo-500 shadow-sm flex items-center gap-3">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png" className="w-5 h-5" alt="" /> Open Googe Drive
                            </button>
                        </div>
                    )}
                    {uploadMethod === "dropbox" && (
                        <div className="flex justify-center pt-4">
                            <button onClick={handleDropboxPick} className="px-6 py-3 bg-white border-2 rounded-xl font-medium text-gray-700 hover:border-indigo-500 shadow-sm flex items-center gap-3">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg" className="w-5 h-5" alt="" /> Open Dropbox
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Analyzing Phase */}
            {step === "analyzing" && (
                <div className="w-full py-20 flex flex-col items-center justify-center bg-white border rounded-2xl shadow-sm">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                    <h3 className="text-lg font-semibold text-gray-800">Reading PDF Pages...</h3>
                    <p className="text-gray-500 text-sm mt-1">Generating high-quality thumbnails for visual selection.</p>
                </div>
            )}

            {/* Error Phase */}
            {step === "error" && (
                <div className="w-full p-8 bg-red-50 border border-red-200 rounded-2xl flex flex-col items-center">
                    <span className="text-4xl mb-4">⚠️</span>
                    <h3 className="text-lg font-bold text-red-800 mb-2">Error Processing File</h3>
                    <p className="text-red-600 mb-6">{errorMsg}</p>
                    <button onClick={() => setStep("upload")} className="px-6 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700">Try Again</button>
                </div>
            )}

            {/* Interactive Selection Grid Phase */}
            {step === "select" && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in">

                    {/* Main Grid Area */}
                    <div className="lg:col-span-3 bg-gray-50/50 rounded-2xl border border-gray-200 p-6 flex flex-col h-[700px]">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-700">Select Pages</h3>
                            <div className="flex gap-2">
                                <button onClick={selectAll} className="text-xs bg-white border shadow-sm px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">Select All</button>
                                <button onClick={deselectAll} className="text-xs bg-white border shadow-sm px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">Clear All</button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-2 py-2 snap-y pb-20">
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center">
                                {thumbnails.map((t, index) => {
                                    const isSelected = selectedPages.has(t.page);
                                    return (
                                        <div
                                            key={t.page}
                                            onClick={(e) => togglePage(t.page, index, e)}
                                            className={`group relative cursor-pointer transition-all duration-200 rounded-xl bg-white hover:-translate-y-1 shadow-sm hover:shadow-md ${isSelected ? 'ring-4 ring-indigo-500 ring-offset-2' : 'border border-gray-200'}`}
                                            style={{ width: 140 }}
                                            title={`Page ${t.page} (Shift+Click to select range)`}
                                        >
                                            <div className="w-full h-[198px] flex items-center justify-center bg-gray-100 rounded-t-xl overflow-hidden">
                                                <img src={t.dataUrl} alt={`Page ${t.page}`} className="h-full object-contain pointer-events-none" />
                                            </div>
                                            <div className={`w-full py-2 text-center text-sm font-medium rounded-b-xl border-t ${isSelected ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-gray-600 border-gray-100 group-hover:bg-gray-50'}`}>
                                                Page {t.page}
                                            </div>

                                            {/* Checkmark overlay */}
                                            <div className={`absolute top-2 left-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/80 border-gray-300 opacity-60 group-hover:opacity-100'}`}>
                                                {isSelected && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Configuration */}
                    <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 p-6 flex flex-col shadow-sm">
                        <h3 className="font-bold text-lg text-gray-800 mb-6">Split Options</h3>

                        <div className="space-y-4 mb-8">
                            <label className={`block p-4 border rounded-xl cursor-pointer transition-colors ${splitMode === 'separate' ? 'ring-2 ring-indigo-600 bg-indigo-50/50 border-indigo-200' : 'hover:bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-center gap-3">
                                    <input type="radio" value="separate" checked={splitMode === 'separate'} onChange={e => setSplitMode(e.target.value)} className="w-4 h-4 text-indigo-600 focus:ring-indigo-600" />
                                    <span className="font-semibold text-gray-800">Extract Pages</span>
                                </div>
                                <p className="text-xs text-gray-500 ml-7 mt-1">Each selected page becomes its own separate PDF inside a ZIP.</p>
                            </label>

                            <label className={`block p-4 border rounded-xl cursor-pointer transition-colors ${splitMode === 'merge' ? 'ring-2 ring-indigo-600 bg-indigo-50/50 border-indigo-200' : 'hover:bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-center gap-3">
                                    <input type="radio" value="merge" checked={splitMode === 'merge'} onChange={e => setSplitMode(e.target.value)} className="w-4 h-4 text-indigo-600 focus:ring-indigo-600" />
                                    <span className="font-semibold text-gray-800">Merge Selected</span>
                                </div>
                                <p className="text-xs text-gray-500 ml-7 mt-1">Combine all highlighted pages into a single new PDF document.</p>
                            </label>

                            <label className={`block p-4 border rounded-xl cursor-pointer transition-colors ${splitMode === 'custom' ? 'ring-2 ring-indigo-600 bg-indigo-50/50 border-indigo-200' : 'hover:bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-center gap-3">
                                    <input type="radio" value="custom" checked={splitMode === 'custom'} onChange={e => setSplitMode(e.target.value)} className="w-4 h-4 text-indigo-600 focus:ring-indigo-600" />
                                    <span className="font-semibold text-gray-800">Custom Ranges</span>
                                </div>
                                <p className="text-xs text-gray-500 ml-7 mt-1 mb-2">Create multiple PDFs based on specific page ranges.</p>

                                {splitMode === 'custom' && (
                                    <input type="text" value={customRanges} onChange={e => setCustomRanges(e.target.value)} placeholder="e.g. 1-3, 4, 5-8" className="w-full mt-2 ml-7! w-[calc(100%-1.75rem)] border-gray-300 rounded text-sm px-3 py-1.5 focus:ring-indigo-500 focus:border-indigo-500 border" />
                                )}
                            </label>
                        </div>

                        <div className="mt-auto">
                            {splitMode !== 'custom' && (
                                <div className="mb-4 text-sm text-gray-600">
                                    <p className="font-medium text-gray-800 mb-1">Selected ({selectedPages.size}):</p>
                                    <p className="truncate text-xs leading-relaxed" title={selectionString}>{selectionString || "None"}</p>
                                </div>
                            )}
                            <button
                                onClick={handleExecuteSplit}
                                disabled={splitMode !== 'custom' && selectedPages.size === 0}
                                className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                Split PDF
                            </button>
                            <button onClick={() => setStep("upload")} className="w-full mt-3 py-2 text-sm text-gray-500 hover:text-gray-800 font-medium">Cancel & Start Over</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Converting / Progress Phase */}
            {step === "converting" && (
                <div className="w-full max-w-md mx-auto mt-20 p-8 bg-white border rounded-2xl shadow-xl flex flex-col items-center animate-fade-in">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Processing PDF...</h3>
                    <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="flex justify-between w-full text-sm font-medium text-gray-600 mb-4">
                        <span>Applying splits</span>
                        <span>{progress}%</span>
                    </div>
                    <p className="text-xs text-gray-400">Please wait while we generate your secure file.</p>
                </div>
            )}

            {/* Ready Phase */}
            {step === "ready" && (
                <div className="w-full max-w-lg mx-auto mt-16 p-8 bg-white border border-green-200 rounded-3xl shadow-xl flex flex-col items-center animate-fade-in">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <span className="text-4xl">🎉</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Successfully Split!</h2>
                    <p className="text-gray-500 text-center mb-8">Your PDF has been processed without quality loss and is ready for download.</p>

                    <a href={downloadUrl} download className="w-full py-4 bg-green-600 text-white text-lg rounded-xl font-bold shadow hover:bg-green-700 transition flex items-center justify-center gap-2 mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        Download Output File
                    </a>

                    <div className="flex gap-4 w-full">
                        <button onClick={() => setStep("upload")} className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition">Split Another</button>
                        <button onClick={() => router.push("/all-tools")} className="flex-1 py-3 text-indigo-600 bg-indigo-50 font-semibold rounded-xl hover:bg-indigo-100 transition">More Tools</button>
                    </div>
                </div>
            )}

            <style jsx>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
        </div>
    );
}
