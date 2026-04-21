"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { loadGooglePicker, openGoogleDrivePicker } from "@/lib/googleDrivePicker";

const DROPBOX_APP_KEY = "2t2su51ec3xgf1u";

let API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    API_BASE = "http://localhost:8000";
}

export default function PdfPasswordPage() {
    const router = useRouter();

    const [mode, setMode] = useState("protect"); // "protect" or "unlock"

    const [file, setFile] = useState(null);
    const [dragOver, setDragOver] = useState(false);

    // Upload method: "device" | "url" | "drive" | "dropbox"
    const [uploadMethod, setUploadMethod] = useState("device");
    const [sourceUrl, setSourceUrl] = useState("");
    const [dropboxReady, setDropboxReady] = useState(false);
    const [fileName, setFileName] = useState("");

    // States: "upload", "password", "processing", "success", "error"
    const [step, setStep] = useState("upload");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
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

    function handleGoogleDrivePick() {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (!clientId || clientId === "YOUR_GOOGLE_CLIENT_ID_HERE") {
            alert("Google Drive OAuth not configured.");
            return;
        }
        openGoogleDrivePicker({
            clientId,
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
            onPick: (f) => handleUrlSelected(f.url, f.name),
        });
    }

    function handleDropboxPick() {
        if (!dropboxReady || !window.Dropbox) return;
        window.Dropbox.choose({
            success: (dbFiles) => {
                if (dbFiles?.length) handleUrlSelected(dbFiles[0].link, dbFiles[0].name);
            },
            linkType: "direct",
            multiselect: false,
        });
    }

    // Toggle modes
    const handleModeSwitch = (m) => {
        setMode(m);
        setStep("upload");
        setFile(null);
        setSourceUrl("");
        setPassword("");
        setErrorMsg("");
    };

    // Drag & drop handlers
    const onDragOver = useCallback((e) => { e.preventDefault(); setDragOver(true); }, []);
    const onDragLeave = useCallback((e) => { e.preventDefault(); setDragOver(false); }, []);
    const onDrop = useCallback((e) => {
        e.preventDefault();
        setDragOver(false);
        const dropped = Array.from(e.dataTransfer?.files || []);
        if (dropped.length > 0) handleFileSelected(dropped[0]);
    }, []);

    function onFileChange(e) {
        const selected = Array.from(e.target.files || []);
        if (selected.length > 0) handleFileSelected(selected[0]);
    }

    function handleFileSelected(f) {
        if (!f.name.toLowerCase().endsWith(".pdf") && f.type !== "application/pdf") {
            setErrorMsg("Please upload a PDF document.");
            setStep("error");
            return;
        }
        setFile(f);
        setSourceUrl("");
        setFileName(f.name);
        setStep("password");
    }

    function handleUrlSelected(url, name) {
        setSourceUrl(url);
        setFile(null);
        setFileName(name || "Cloud Document");
        setStep("password");
    }

    async function handleProcess(e) {
        e.preventDefault();
        if (!password.trim()) {
            setErrorMsg("Please enter a password.");
            return;
        }

        let progressInterval;
        try {
            setStep("processing");
            setErrorMsg("");
            setProgress(0);

            progressInterval = setInterval(() => {
                setProgress(prev => Math.min(prev + Math.floor(Math.random() * 15) + 5, 95));
            }, 300);

            const formData = new FormData();
            if (file) formData.append("file", file);
            if (sourceUrl) formData.append("url", sourceUrl);
            formData.append("password", password);

            const endpoint = mode === "protect" ? "/api/convert/pdf-protect" : "/api/convert/pdf-unlock";
            const res = await fetch(`${API_BASE}${endpoint}`, {
                method: "POST",
                body: formData,
            });

            clearInterval(progressInterval);
            const text = await res.text();
            if (!res.ok) throw new Error(JSON.parse(text).detail || `Failed to ${mode} PDF.`);

            const data = JSON.parse(text);
            setProgress(100);
            setDownloadUrl(`${API_BASE}${data.downloadUrl}`.replace('/uploads/', '/api/download/'));

            setTimeout(() => setStep("success"), 400);

        } catch (err) {
            console.error(err);
            if (progressInterval) clearInterval(progressInterval);
            setProgress(0);
            setErrorMsg(err.message || `Failed to ${mode} PDF.`);
            setStep("error");
        }
    }

    return (
        <>
            <Head>
                <title>Protect or Unlock PDF - AllTools</title>
                <meta name="description" content="Add a secure password to your PDF document or unlock and remove password protection from PDFs online." />
            </Head>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <button className="text-sm text-gray-500 hover:text-indigo-600 hover:underline mb-6 flex items-center gap-1" onClick={() => router.push("/all-tools")}>
                    ← Back to tools
                </button>

                <h1 className="text-3xl font-bold mb-2">PDF Password Tools</h1>
                <p className="text-gray-500 mb-8 max-w-2xl">
                    Secure your documents with strong AES encryption, or remove passwords from locked PDFs.
                </p>

                {/* Mode Toggle */}
                <div className="flex p-1 bg-gray-100 rounded-xl w-full max-w-md mx-auto mb-8 relative z-10">
                    <button
                        onClick={() => handleModeSwitch("protect")}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${mode === 'protect' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        🔒 Protect PDF
                    </button>
                    <button
                        onClick={() => handleModeSwitch("unlock")}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${mode === 'unlock' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        🔓 Unlock PDF
                    </button>
                </div >

                {/* Upload Step */}
                {
                    step === "upload" && (
                        <div
                            className={`rounded-2xl border-2 p-10 transition-all bg-white relative ${dragOver ? "border-indigo-500 bg-indigo-50" : "border-gray-200"}`}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                        >
                            <div className="flex flex-wrap gap-2 mb-8 justify-center">
                                {[{ id: "device", icon: "💻", label: "My Device" }, { id: "url", icon: "🔗", label: "Paste URL" }, { id: "drive", icon: "🟢", label: "Google Drive" }, { id: "dropbox", icon: "🔵", label: "Dropbox" }].map(m => (
                                    <button key={m.id} onClick={() => setUploadMethod(m.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-medium transition-all ${uploadMethod === m.id ? "bg-indigo-600 text-white border-indigo-600 shadow" : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"}`}>
                                        <span>{m.icon}</span> {m.label}
                                    </button>
                                ))}
                            </div>

                            {uploadMethod === "device" && (
                                <div onClick={() => fileInputRef.current?.click()} className="text-center cursor-pointer py-10 border-2 border-dashed rounded-xl border-gray-300 hover:border-indigo-400 hover:bg-gray-50">
                                    <span className="text-6xl mb-4 block">{mode === 'protect' ? '🛡️' : '🔑'}</span>
                                    <p className="font-bold text-xl text-gray-800">Select PDF File</p>
                                    <p className="text-gray-500 mt-2">or drag and drop it here</p>
                                    <div className="mt-6 flex items-center justify-center gap-3 text-sm font-medium text-gray-400">
                                        <span className="px-3 py-1 bg-gray-100 rounded-full">{mode === 'protect' ? 'Add encryption' : 'Remove encryption'}</span>
                                    </div>
                                    <input ref={fileInputRef} type="file" accept="application/pdf" onChange={onFileChange} className="hidden" />
                                </div>
                            )}

                            {uploadMethod === "url" && (
                                <div className="max-w-xl mx-auto space-y-4 py-8">
                                    <input type="url" value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} placeholder="https://example.com/document.pdf" className="w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                                    <button onClick={() => handleUrlSelected(sourceUrl, "URL Document")} disabled={!sourceUrl.trim()} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold disabled:opacity-50">Continue</button>
                                </div>
                            )}

                            {uploadMethod === "drive" && (
                                <div className="flex justify-center py-8">
                                    <button onClick={handleGoogleDrivePick} className="px-6 py-3 bg-white border-2 rounded-xl font-medium text-gray-700 hover:border-indigo-500 shadow-sm flex items-center gap-3">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png" className="w-5 h-5" alt="" /> Open Google Drive
                                    </button>
                                </div>
                            )}

                            {uploadMethod === "dropbox" && (
                                <div className="flex justify-center py-8">
                                    <button onClick={handleDropboxPick} className="px-6 py-3 bg-white border-2 rounded-xl font-medium text-gray-700 hover:border-indigo-500 shadow-sm flex items-center gap-3">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg" className="w-5 h-5" alt="" /> Open Dropbox
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                }

                {/* Password Step */}
                {
                    step === "password" && (
                        <div className="w-full max-w-md mx-auto p-8 bg-white border rounded-2xl shadow-sm overflow-hidden animate-fade-in text-center">
                            <span className="text-4xl mb-4 block">{mode === 'protect' ? 'Locking File 🔒' : 'Unlocking File 🔓'}</span>
                            <p className="font-bold text-lg text-gray-800 mb-1">{fileName}</p>
                            <p className="text-sm text-gray-500 mb-6 border-b pb-6">
                                {mode === 'protect'
                                    ? "Enter the password you want to secure this PDF with."
                                    : "Enter the correct password to decrypt and remove protection."}
                            </p>

                            <form onSubmit={handleProcess}>
                                <div className="text-left mb-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        {mode === 'protect' ? 'Set Password' : 'PDF Password'}
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Enter password..."
                                        autoFocus
                                        required
                                    />
                                    {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}
                                </div>
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => { setStep("upload"); setFile(null); setPassword(""); setErrorMsg(""); }} className="px-5 py-3 border text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition">Back</button>
                                    <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-md">
                                        {mode === 'protect' ? 'Encrypt & Secure PDF' : 'Remove Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )
                }

                {/* Processing Step */}
                {
                    step === "processing" && (
                        <div className="w-full max-w-md mx-auto mt-10 p-8 bg-white border rounded-2xl shadow-xl flex flex-col items-center animate-fade-in">
                            <div className="relative mb-6">
                                <div className="w-16 h-16 rounded-full border-4 border-gray-100 flex items-center justify-center">
                                    <span className="text-2xl animate-pulse">⚙️</span>
                                </div>
                                <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4">{mode === 'protect' ? 'Encrypting with AES...' : 'Decrypting PDF...'}</h3>
                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                                <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                            </div>
                            <p className="text-xs text-gray-400 mt-6 text-center">Files are automatically deleted after processing.</p>
                        </div>
                    )
                }

                {/* Success Step */}
                {
                    step === "success" && (
                        <div className="w-full max-w-lg mx-auto mt-10 p-8 bg-white border border-indigo-200 rounded-3xl shadow-xl flex flex-col items-center animate-fade-in">
                            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                                <span className="text-4xl text-indigo-600">✓</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{mode === 'protect' ? 'PDF Secured!' : 'PDF Unlocked!'}</h2>
                            <p className="text-gray-500 text-center mb-8">
                                {mode === 'protect'
                                    ? 'Your PDF has been encrypted with a password.'
                                    : 'Password removed. You can now open this PDF freely.'}
                            </p>

                            <a href={downloadUrl} download className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg rounded-xl font-bold shadow transition flex items-center justify-center gap-2 mb-4">
                                Download PDF
                            </a>

                            <div className="flex gap-4 w-full">
                                <button onClick={() => handleModeSwitch(mode)} className="flex-1 py-3 text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition border">Process Another</button>
                            </div>
                        </div>
                    )
                }

                {/* Error Step */}
                {
                    step === "error" && (
                        <div className="w-full max-w-lg mx-auto mt-10 p-8 bg-red-50 border border-red-200 rounded-3xl flex flex-col items-center animate-fade-in">
                            <span className="text-5xl mb-4">🛑</span>
                            <h3 className="text-xl font-bold text-red-800 mb-2">Oops! Something went wrong</h3>
                            <p className="text-red-600 text-center mb-6">{errorMsg}</p>
                            <button onClick={() => { setStep("upload"); setFile(null); setPassword(""); setErrorMsg(""); }} className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-md">
                                Try Again
                            </button>
                        </div>
                    )
                }

                <style jsx>{`
          .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
            </div >
        </>
    );
}
