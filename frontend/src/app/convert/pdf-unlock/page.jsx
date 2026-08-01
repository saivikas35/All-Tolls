"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadGooglePicker, openGoogleDrivePicker } from "@/lib/googleDrivePicker";
import { downloadFile } from "@/lib/downloadFile";

const DROPBOX_APP_KEY = "2t2su51ec3xgf1u";
let API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export default function PdfUnlockPage() {
    const router = useRouter();

    const [file, setFile] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [uploadMethod, setUploadMethod] = useState("device");
    const [sourceUrl, setSourceUrl] = useState("");
    const [dropboxReady, setDropboxReady] = useState(false);
    const [fileName, setFileName] = useState("");

    // Steps: "upload" | "password" | "processing" | "success" | "error"
    const [step, setStep] = useState("upload");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [progress, setProgress] = useState(0);
    const [downloadUrl, setDownloadUrl] = useState("");
    const [wasNotEncrypted, setWasNotEncrypted] = useState(false);

    const fileInputRef = useRef(null);

    /* ── SDK loaders ── */
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

    function handleGoogleDrivePick() {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (!clientId || clientId === "YOUR_GOOGLE_CLIENT_ID_HERE") { alert("Google Drive OAuth not configured."); return; }
        openGoogleDrivePicker({ clientId, apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY, onPick: (f) => handleUrlSelected(f.url, f.name) });
    }

    function handleDropboxPick() {
        if (!dropboxReady || !window.Dropbox) return;
        window.Dropbox.choose({ success: (dbFiles) => { if (dbFiles?.length) handleUrlSelected(dbFiles[0].link, dbFiles[0].name); }, linkType: "direct", multiselect: false });
    }

    const onDragOver = useCallback((e) => { e.preventDefault(); setDragOver(true); }, []);
    const onDragLeave = useCallback((e) => { e.preventDefault(); setDragOver(false); }, []);
    const onDrop = useCallback((e) => {
        e.preventDefault(); setDragOver(false);
        const dropped = Array.from(e.dataTransfer?.files || []);
        if (dropped.length > 0) handleFileSelected(dropped[0]);
    }, []);

    function onFileChange(e) {
        const selected = Array.from(e.target.files || []);
        if (selected.length > 0) handleFileSelected(selected[0]);
    }

    function handleFileSelected(f) {
        if (!f.name.toLowerCase().endsWith(".pdf") && f.type !== "application/pdf") {
            setErrorMsg("Please upload a PDF document."); setStep("error"); return;
        }
        setFile(f); setSourceUrl(""); setFileName(f.name); setStep("password");
    }

    function handleUrlSelected(url, name) {
        setSourceUrl(url); setFile(null); setFileName(name || "Cloud Document"); setStep("password");
    }

    async function handleUnlock(e) {
        e.preventDefault();
        let progressInterval;
        try {
            setStep("processing"); setErrorMsg(""); setProgress(0);
            progressInterval = setInterval(() => setProgress(prev => Math.min(prev + Math.floor(Math.random() * 15) + 5, 92)), 300);

            const formData = new FormData();
            if (file) formData.append("file", file);
            if (sourceUrl) formData.append("url", sourceUrl);
            formData.append("password", password);

            const res = await fetch(`${API_BASE}/api/convert/pdf-unlock`, { method: "POST", body: formData });
            clearInterval(progressInterval);
            const text = await res.text();
            if (!res.ok) throw new Error(JSON.parse(text).detail || "Failed to unlock PDF.");

            const data = JSON.parse(text);
            setProgress(100);
            const relUrl = data.downloadUrl.startsWith("/api/") ? data.downloadUrl : data.downloadUrl.replace("/uploads/", "/api/download/");
            setDownloadUrl(relUrl);
            setWasNotEncrypted(!!data.note);
            setTimeout(() => setStep("success"), 400);
        } catch (err) {
            if (progressInterval) clearInterval(progressInterval);
            setProgress(0);
            setErrorMsg(err.message || "Failed to unlock PDF.");
            setStep("error");
        }
    }

    function handleReset() {
        setFile(null); setSourceUrl(""); setFileName(""); setStep("upload");
        setPassword(""); setErrorMsg(""); setDownloadUrl(""); setProgress(0); setWasNotEncrypted(false);
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
                .unlock-wrap { font-family: 'Inter', sans-serif; }
                .fade-in { animation: fadeUp 0.35s ease-out forwards; }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
                .pulse-ring { animation: pulseRing 1.8s ease-in-out infinite; }
                @keyframes pulseRing { 0%,100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); } 50% { box-shadow: 0 0 0 12px rgba(99,102,241,0); } }
            `}</style>

            <div className="unlock-wrap min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-white py-10 px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Back */}
                    <button onClick={() => router.push("/all-tools")} className="mb-8 flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition group">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to tools
                    </button>

                    {/* Hero */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg mb-4 pulse-ring">
                            <span className="text-3xl">🔓</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Unlock PDF</h1>
                        <p className="text-gray-500 max-w-md mx-auto">Remove password protection from any PDF. Enter the password and download a freely accessible copy.</p>
                    </div>

                    {/* ── UPLOAD STEP ── */}
                    {step === "upload" && (
                        <div className={`fade-in bg-white rounded-3xl shadow-md border-2 p-8 transition-all ${dragOver ? "border-indigo-500 bg-indigo-50/50" : "border-gray-100"}`}
                            onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
                            {/* Upload method tabs */}
                            <div className="flex flex-wrap gap-2 mb-6 justify-center">
                                {UPLOAD_TABS.map(m => (
                                    <button key={m.id} onClick={() => setUploadMethod(m.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${uploadMethod === m.id ? "bg-indigo-600 text-white border-indigo-600 shadow-md" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-400"}`}>
                                        <span>{m.icon}</span>{m.label}
                                    </button>
                                ))}
                            </div>

                            {uploadMethod === "device" && (
                                <div onClick={() => fileInputRef.current?.click()}
                                    className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group">
                                    <span className="text-5xl mb-3 group-hover:scale-110 transition-transform">🔒</span>
                                    <p className="font-bold text-gray-800 text-lg">Select PDF File</p>
                                    <p className="text-gray-400 text-sm mt-1">or drag & drop it here</p>
                                    <span className="mt-4 px-4 py-1.5 text-xs bg-indigo-50 text-indigo-600 rounded-full font-medium border border-indigo-100">Supports password-protected PDFs</span>
                                    <input ref={fileInputRef} type="file" accept="application/pdf,.pdf" onChange={onFileChange} className="hidden" />
                                </div>
                            )}

                            {uploadMethod === "url" && (
                                <div className="space-y-3 py-4">
                                    <label className="block text-sm font-semibold text-gray-700">Direct PDF URL</label>
                                    <input type="url" value={sourceUrl} onChange={e => setSourceUrl(e.target.value)}
                                        placeholder="https://example.com/document.pdf"
                                        className="w-full border-2 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" />
                                    <button onClick={() => handleUrlSelected(sourceUrl, "URL Document")} disabled={!sourceUrl.trim()}
                                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold disabled:opacity-40 hover:bg-indigo-700 transition">Continue →</button>
                                </div>
                            )}

                            {uploadMethod === "drive" && (
                                <div className="flex flex-col items-center py-8 gap-4">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png" className="w-14 h-14" alt="Google Drive" />
                                    <button onClick={handleGoogleDrivePick}
                                        className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:border-indigo-500 hover:text-indigo-600 transition shadow-sm flex items-center gap-3">
                                        Open Google Drive Picker
                                    </button>
                                </div>
                            )}

                            {uploadMethod === "dropbox" && (
                                <div className="flex flex-col items-center py-8 gap-4">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg" className="w-14 h-14" alt="Dropbox" />
                                    <button onClick={handleDropboxPick} disabled={!dropboxReady}
                                        className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:border-indigo-500 hover:text-indigo-600 transition shadow-sm flex items-center gap-3 disabled:opacity-50">
                                        {dropboxReady ? "Open Dropbox Chooser" : "Loading Dropbox..."}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── PASSWORD STEP ── */}
                    {step === "password" && (
                        <div className="fade-in bg-white rounded-3xl shadow-md border border-gray-100 p-8 text-center">
                            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">🔑</span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-1">Enter PDF Password</h2>
                            <p className="text-sm text-gray-500 mb-1">{fileName}</p>
                            <p className="text-xs text-gray-400 mb-6 border-b pb-6">Leave blank if the PDF is not password protected — we'll still return an unlocked copy.</p>

                            <form onSubmit={handleUnlock} className="text-left space-y-4">
                                <div className="relative">
                                    <input
                                        type={showPwd ? "text" : "password"}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Enter PDF password (or leave blank)"
                                        autoFocus
                                        className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                    />
                                    <button type="button" onClick={() => setShowPwd(p => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg">
                                        {showPwd ? "🙈" : "👁️"}
                                    </button>
                                </div>
                                {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
                                <div className="flex gap-3">
                                    <button type="button" onClick={handleReset}
                                        className="px-5 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition">← Back</button>
                                    <button type="submit"
                                        className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:opacity-90 transition shadow-md">
                                        🔓 Unlock PDF
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* ── PROCESSING STEP ── */}
                    {step === "processing" && (
                        <div className="fade-in bg-white rounded-3xl shadow-md border border-gray-100 p-12 flex flex-col items-center">
                            <div className="relative mb-6">
                                <div className="w-20 h-20 rounded-full border-4 border-gray-100 flex items-center justify-center">
                                    <span className="text-3xl animate-pulse">🔓</span>
                                </div>
                                <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Decrypting PDF...</h3>
                            <div className="w-full max-w-xs h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 ease-out rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                            <p className="text-xs text-gray-400 mt-4">Your file is processed securely and deleted afterward.</p>
                        </div>
                    )}

                    {/* ── SUCCESS STEP ── */}
                    {step === "success" && (
                        <div className="fade-in bg-white rounded-3xl shadow-md border border-green-100 p-10 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                                <span className="text-3xl text-white">✓</span>
                            </div>
                            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">PDF Unlocked!</h2>
                            {wasNotEncrypted
                                ? <p className="text-gray-500 mb-8">This PDF was not password protected. Here is a clean copy for you.</p>
                                : <p className="text-gray-500 mb-8">Password removed successfully. Your PDF is now freely accessible.</p>
                            }
                            <button onClick={() => downloadFile(`${API_BASE}${downloadUrl}`, "AllTools_Unlocked.pdf")}
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white text-lg rounded-2xl font-bold shadow-lg transition flex items-center justify-center gap-2 mb-4 cursor-pointer">
                                ⬇️ Download Unlocked PDF
                            </button>
                            <button onClick={handleReset}
                                className="w-full py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition">
                                Unlock Another PDF
                            </button>
                        </div>
                    )}

                    {/* ── ERROR STEP ── */}
                    {step === "error" && (
                        <div className="fade-in bg-red-50 border border-red-200 rounded-3xl p-10 flex flex-col items-center text-center">
                            <span className="text-5xl mb-4">🛑</span>
                            <h3 className="text-xl font-bold text-red-800 mb-2">Unlock Failed</h3>
                            <p className="text-red-600 mb-6">{errorMsg}</p>
                            <button onClick={handleReset}
                                className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-md transition">
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Info cards */}
                    {step === "upload" && (
                        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                            {[
                                { icon: "🔒", title: "AES-256 Supported", desc: "Unlocks strongly encrypted PDFs" },
                                { icon: "🚀", title: "Instant Processing", desc: "Results in seconds" },
                                { icon: "🗑️", title: "Auto Deleted", desc: "Files removed after processing" },
                            ].map(c => (
                                <div key={c.title} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                                    <div className="text-2xl mb-2">{c.icon}</div>
                                    <p className="font-semibold text-gray-800 text-sm">{c.title}</p>
                                    <p className="text-gray-400 text-xs mt-1">{c.desc}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
