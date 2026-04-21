// frontend/src/app/convert/[id]/ToolConvertPage.jsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * ToolConvertPage (client)
 *
 * Props:
 *  - toolId: string (received from the server page component)
 *
 * This component is purely client-side. It implements a simple upload / convert
 * flow (placeholder) and exposes Drive/Dropbox placeholders to plug in real SDKs later.
 */

export default function ToolConvertPage({ toolId = "unknown-tool" }) {
  const router = useRouter();

  // UI / state
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [status, setStatus] = useState("idle"); // idle | uploaded | converting | ready | error
  const [downloadUrl, setDownloadUrl] = useState("");
  const fileInputRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Reset when toolId changes
  useEffect(() => {
    setErrorMsg("");
    setStatus("idle");
    setFile(null);
    setSourceUrl("");
    setDownloadUrl("");
  }, [toolId]);

  // drag / drop handlers
  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);
  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);
  const onDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const f = e.dataTransfer?.files?.[0];
    if (f) {
      setFile(f);
      setSourceUrl("");
      setStatus("uploaded");
    }
  }, []);

  function onChooseFileClick() {
    fileInputRef.current?.click();
  }
  function onFileChange(e) {
    const f = e.target.files && e.target.files[0];
    if (f) {
      setFile(f);
      setSourceUrl("");
      setStatus("uploaded");
    }
  }

  async function handleConvert() {
    setErrorMsg("");
    if (!file && !sourceUrl) {
      setErrorMsg("Please provide a file or a URL to convert.");
      return;
    }

    try {
      setStatus("converting");

      // TODO: Replace this simulated delay with actual upload + conversion API call.
      // Example: upload to backend at `${process.env.NEXT_PUBLIC_API_BASE}/convert/${toolId}`
      await new Promise((res) => setTimeout(res, 1400));

      // Simulate a converted file blob (text) and create object URL so download works in-browser
      const simulatedContent = `Converted: ${toolId}\nSource: ${file ? file.name : sourceUrl}\nTime: ${new Date().toISOString()}`;
      const blob = new Blob([simulatedContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setStatus("ready");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMsg("Conversion failed. Try again.");
    }
  }

  function handleDownload() {
    if (!downloadUrl) return;
    // create an anchor to download
    const a = document.createElement("a");
    a.href = downloadUrl;
    // name it based on tool id
    a.download = `${toolId}-result.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // optional: revoke after a bit
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 60 * 1000);
  }

  function handleUseUrlExample() {
    // quick example put in URL field (useful while developing)
    setSourceUrl("https://example.com/sample.pdf");
    setFile(null);
    setStatus("uploaded");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6">
        <button
          className="text-sm text-gray-600 hover:underline"
          onClick={() => router.push("/all-tools")}
          type="button"
        >
          ← Back to tools
        </button>
      </div>

      <header className="mb-6">
        <h1 className="text-2xl font-bold">Convert — {toolId.replace(/-/g, " ")}</h1>
        <p className="text-sm text-gray-500 mt-1">Upload a file, paste a file URL, or choose cloud storage.</p>
      </header>

      <section
        onDragOver={onDragOver}
        onDragEnter={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`rounded-lg border-2 p-6 transition-colors ${dragOver ? "border-indigo-400 bg-indigo-50" : "border-gray-100 bg-white"}`}
        aria-label="File upload area"
      >
        <div className="flex items-center gap-6">
          <div style={{ minWidth: 140 }} className="flex-shrink-0">
            <div className="w-28 h-28 rounded-md bg-gray-50 flex items-center justify-center text-gray-400">
              {/* icon placeholder */}
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M7 7h10v10H7z" stroke="#c7c7d2" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-3">
              <strong className="block">Upload file</strong>
              <div className="text-sm text-gray-500">Drag & drop here or choose a file from your device.</div>
            </div>

            <div className="flex gap-3 items-center">
              <button onClick={onChooseFileClick} className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700" type="button">
                Choose file
              </button>

              <button onClick={handleUseUrlExample} className="px-3 py-2 rounded border text-sm text-gray-700" type="button">
                Use example URL
              </button>

              <div className="text-sm text-gray-500">or paste file URL:</div>
              <input
                value={sourceUrl}
                onChange={(e) => {
                  setSourceUrl(e.target.value);
                  setFile(null);
                  setStatus(e.target.value.trim() ? "uploaded" : "idle");
                }}
                placeholder="https://..."
                className="ml-2 px-3 py-2 border rounded w-full max-w-lg"
                aria-label="File URL"
              />
            </div>

            <input ref={fileInputRef} onChange={onFileChange} type="file" className="hidden" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => {
              // placeholder for Google Drive picker integration
              alert("Google Drive integration placeholder — add picker flow here.");
            }}
            className="px-4 py-2 rounded border text-sm"
            type="button"
          >
            Google Drive
          </button>

          <button
            onClick={() => {
              // placeholder for Dropbox flow
              alert("Dropbox integration placeholder — add Dropbox chooser here.");
            }}
            className="px-4 py-2 rounded border text-sm"
            type="button"
          >
            Dropbox
          </button>

          <div className="text-sm text-gray-600">
            {status === "idle" && "No file selected."}
            {status === "uploaded" && (file ? `Selected: ${file.name}` : `URL ready: ${sourceUrl}`)}
            {status === "converting" && "Converting…"}
            {status === "ready" && "Conversion ready — download below."}
            {status === "error" && <span className="text-red-600">{errorMsg}</span>}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={handleConvert} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded" disabled={status === "converting"} type="button">
            {status === "converting" ? "Converting…" : "Convert"}
          </button>

          <button
            onClick={() => {
              setFile(null);
              setSourceUrl("");
              setStatus("idle");
              setDownloadUrl("");
              setErrorMsg("");
            }}
            className="px-4 py-2 border rounded"
            type="button"
          >
            Reset
          </button>

          {status === "ready" && (
            <button onClick={handleDownload} className="px-4 py-2 bg-indigo-600 text-white rounded" type="button">
              Download result
            </button>
          )}
        </div>

        {errorMsg && <div className="mt-3 text-sm text-red-600">{errorMsg}</div>}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">How it works</h2>
        <ol className="list-decimal ml-5 mt-3 text-sm text-gray-600">
          <li>Choose a file or paste a URL (or pick from Drive/Dropbox — integrate their SDKs).</li>
          <li>Press Convert — the site will upload/convert using your backend API (wire this in later).</li>
          <li>When ready, a download link will appear; press Download to save the converted file.</li>
        </ol>
      </section>
    </div>
  );
}
