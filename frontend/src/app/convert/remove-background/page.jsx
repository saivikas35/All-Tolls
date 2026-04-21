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

export default function RemoveBackgroundPage() {
    const router = useRouter();

    const [file, setFile] = useState(null);
    const [dragOver, setDragOver] = useState(false);

    // Upload method: "device" | "url" | "drive" | "dropbox"
    const [uploadMethod, setUploadMethod] = useState("device");
    const [sourceUrl, setSourceUrl] = useState("");
    const [dropboxReady, setDropboxReady] = useState(false);

    // States: "upload", "configuring", "processing", "success", "error"
    const [step, setStep] = useState("upload");
    const [errorMsg, setErrorMsg] = useState("");
    const [progress, setProgress] = useState(0);
    const [downloadUrl, setDownloadUrl] = useState("");
    const [previewOriginal, setPreviewOriginal] = useState("");

    // Tool specific options
    const [bgColor, setBgColor] = useState(""); // empty means transparent

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

    function handleUrlSelected(url) {
        setSourceUrl(url);
        setFile(null);
        setPreviewOriginal(url);
        setStep("configuring");
    }

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
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(f.type)) {
            setErrorMsg("Please upload a JPG, PNG, or WEBP image.");
            setStep("error");
            return;
        }

        // 20MB limit
        if (f.size > 20 * 1024 * 1024) {
            setErrorMsg("File size exceeds 20MB limit.");
            setStep("error");
            return;
        }

        setFile(f);
        setSourceUrl("");
        setPreviewOriginal(URL.createObjectURL(f));
        setStep("configuring");
    }

    async function handleProcess() {
        let progressInterval;
        try {
            setStep("processing");
            setErrorMsg("");
            setProgress(0);

            progressInterval = setInterval(() => {
                setProgress(prev => Math.min(prev + Math.floor(Math.random() * 8) + 2, 95));
            }, 800);

            const formData = new FormData();
            if (file) formData.append("file", file);
            else if (sourceUrl) formData.append("url", sourceUrl);
            if (bgColor) {
                formData.append("bgcolor", bgColor);
            }

            const res = await fetch(`${API_BASE}/api/convert/remove-background`, {
                method: "POST",
                body: formData,
            });

            clearInterval(progressInterval);
            const text = await res.text();
            if (!res.ok) throw new Error(JSON.parse(text).detail || "Failed to process image.");

            const data = JSON.parse(text);
            setProgress(100);
            setDownloadUrl(`${API_BASE}${data.downloadUrl}`.replace('/uploads/', '/api/download/'));

            setTimeout(() => setStep("success"), 500);

        } catch (err) {
            console.error(err);
            if (progressInterval) clearInterval(progressInterval);
            setProgress(0);
            setErrorMsg(err.message || "Failed to remove background.");
            setStep("error");
        }
    }

    return (
        <>
            <Head>
                <title>Remove Image Background - AllTools</title>
                <meta name="description" content="Free AI image background remover. Make image backgrounds transparent instantly." />
            </Head>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <button className="text-sm text-gray-500 hover:text-indigo-600 hover:underline mb-6 flex items-center gap-1" onClick={() => router.push("/all-tools")}>
                    ← Back to tools
                </button>

                <h1 className="text-3xl font-bold mb-2">AI Background Remover</h1>
                <p className="text-gray-500 mb-8 max-w-2xl">
                    Instantly remove backgrounds from images online. Download as a transparent PNG or pick a solid background color.
                </p>

                {/* Upload Step */}
                {step === "upload" && (
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
                            <div onClick={() => fileInputRef.current?.click()} className="text-center cursor-pointer py-10 border-2 border-dashed rounded-xl border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50">
                                <span className="text-6xl mb-4 block">🖼️</span>
                                <p className="font-bold text-xl text-gray-800">Select an Image</p>
                                <p className="text-gray-500 mt-2">or drag and drop it here</p>
                                <div className="mt-6 flex items-center justify-center gap-3 text-sm font-medium text-gray-400">
                                    <span className="px-3 py-1 bg-gray-100 rounded-full">JPG</span>
                                    <span className="px-3 py-1 bg-gray-100 rounded-full">PNG</span>
                                    <span className="px-3 py-1 bg-gray-100 rounded-full">WEBP</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-4">Max file size: 20MB</p>
                                <input ref={fileInputRef} type="file" accept="image/jpeg, image/png, image/webp" onChange={onFileChange} className="hidden" />
                            </div>
                        )}

                        {uploadMethod === "url" && (
                            <div className="max-w-xl mx-auto space-y-4 py-8">
                                <input type="url" value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} placeholder="https://example.com/image.jpg" className="w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                                <button onClick={() => handleUrlSelected(sourceUrl)} disabled={!sourceUrl.trim()} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold disabled:opacity-50">Continue</button>
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
                )}

                {/* Configurations Step */}
                {step === "configuring" && (
                    <div className="bg-white border rounded-2xl shadow-sm overflow-hidden animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="bg-gray-100 p-6 flex flex-col items-center justify-center border-r border-gray-200">
                                <p className="text-sm font-medium text-gray-500 mb-4 w-full text-left">Original Image:</p>
                                <div className="relative w-full max-w-xs aspect-square rounded-xl overflow-hidden shadow-sm bg-white p-2">
                                    <img src={previewOriginal} alt="Original" className="w-full h-full object-contain" />
                                </div>
                            </div>
                            <div className="p-8 flex flex-col justify-center">
                                <h3 className="text-xl font-bold text-gray-800 mb-6">Customize Output</h3>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <input type="radio" id="bg-transparent" name="bg-type" checked={!bgColor} onChange={() => setBgColor("")} className="w-4 h-4 text-indigo-600" />
                                                <label htmlFor="bg-transparent" className="text-gray-700">Transparent (PNG)</label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input type="radio" id="bg-color" name="bg-type" checked={!!bgColor} onChange={() => setBgColor("#ffffff")} className="w-4 h-4 text-indigo-600" />
                                                <label htmlFor="bg-color" className="text-gray-700">Solid Color (JPG)</label>
                                            </div>
                                        </div>
                                        {!!bgColor && (
                                            <div className="mt-3 flex items-center gap-3 animate-fade-in">
                                                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0 p-0" />
                                                <span className="text-sm font-mono text-gray-500 uppercase">{bgColor}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-10 flex gap-3">
                                    <button onClick={() => { setStep("upload"); setFile(null); }} className="px-5 py-3 border text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition">Cancel</button>
                                    <button onClick={handleProcess} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-md">
                                        Remove Background
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Processing Step */}
                {step === "processing" && (
                    <div className="w-full max-w-md mx-auto mt-16 p-8 bg-white border rounded-2xl shadow-xl flex flex-col items-center animate-fade-in">
                        <div className="relative mb-6">
                            <div className="w-16 h-16 rounded-full border-4 border-gray-100 flex items-center justify-center">
                                <span className="text-2xl animate-pulse">✨</span>
                            </div>
                            <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Erasing Background...</h3>
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="flex justify-between w-full text-xs font-medium text-gray-500">
                            <span>AI Processing</span>
                            <span>{progress}%</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-6 text-center">Files are automatically deleted after processing.</p>
                    </div>
                )}

                {/* Success Step */}
                {step === "success" && (
                    <div className="w-full max-w-lg mx-auto mt-10 p-8 bg-white border border-green-200 rounded-3xl shadow-xl flex flex-col items-center animate-fade-in">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <span className="text-4xl text-green-600">✓</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Background Removed!</h2>
                        <p className="text-gray-500 text-center mb-8">Your image has been processed using U2Net AI.</p>

                        <a href={downloadUrl} download className="w-full py-4 bg-green-600 hover:bg-green-700 text-white text-lg rounded-xl font-bold shadow transition flex items-center justify-center gap-2 mb-4">
                            Download Image
                        </a>

                        <div className="flex gap-4 w-full">
                            <button onClick={() => { setStep("upload"); setFile(null); }} className="flex-1 py-3 text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition border">Process Another</button>
                        </div>
                    </div>
                )}

                {/* Error Step */}
                {step === "error" && (
                    <div className="w-full max-w-lg mx-auto mt-10 p-8 bg-red-50 border border-red-200 rounded-3xl flex flex-col items-center animate-fade-in">
                        <span className="text-5xl mb-4">🛑</span>
                        <h3 className="text-xl font-bold text-red-800 mb-2">Oops! Something went wrong</h3>
                        <p className="text-red-600 text-center mb-6">{errorMsg}</p>
                        <button onClick={() => { setStep("upload"); setFile(null); }} className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-md">
                            Try Again
                        </button>
                    </div>
                )}

                <style jsx>{`
          .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
            </div>
        </>
    );
}
