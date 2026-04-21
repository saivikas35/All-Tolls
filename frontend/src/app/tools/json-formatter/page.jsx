"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function JsonFormatterPage() {
    const router = useRouter();

    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [errorLine, setErrorLine] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [copyStatus, setCopyStatus] = useState("Copy");

    // Auto-format on paste or typing delay
    useEffect(() => {
        if (!input.trim()) {
            setOutput("");
            setErrorMsg("");
            setErrorLine(null);
            return;
        }

        const timer = setTimeout(() => {
            formatJson();
        }, 500);
        return () => clearTimeout(timer);
    }, [input]);

    const parseAndSetError = (raw) => {
        try {
            const parsed = JSON.parse(raw);
            setErrorMsg("");
            setErrorLine(null);
            return parsed;
        } catch (err) {
            setErrorMsg(err.message);
            // Simple regex extraction for line numbers from standard V8 JSON errors
            const match = err.message.match(/line (\d+)/);
            if (match) {
                setErrorLine(parseInt(match[1], 10));
            } else {
                setErrorLine(0);
            }
            return null;
        }
    };

    const formatJson = (spaces = 2) => {
        const parsed = parseAndSetError(input);
        if (parsed) {
            setOutput(JSON.stringify(parsed, null, spaces));
        }
    };

    const minifyJson = () => {
        const parsed = parseAndSetError(input);
        if (parsed) {
            setOutput(JSON.stringify(parsed));
        }
    };

    const copyToClipboard = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopyStatus("Copied!");
        setTimeout(() => setCopyStatus("Copy"), 2000);
    };

    const clearAll = () => {
        setInput("");
        setOutput("");
        setErrorMsg("");
        setErrorLine(null);
    };

    const loadExample = () => {
        setInput(`{
  "name": "AllTools User",
  "plan": "Premium",
  "features": [
    "JSON Formatter",
    "Background Remover",
    "PDF Splitter"
  ],
  "active": true
}`);
    };

    return (
        <>
            <Head>
                <title>JSON Formatter & Validator - AllTools</title>
                <meta name="description" content="Free online JSON formatter, beautifier, minifier, and validator with syntax error highlighting." />
            </Head>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <button className="text-sm text-gray-500 hover:text-indigo-600 hover:underline mb-6 flex items-center gap-1" onClick={() => router.push("/all-tools")}>
                    ← Back to tools
                </button>

                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">JSON Formatter & Validator</h1>
                        <p className="text-gray-500">
                            Format, beautify, minify, and validate JSON data instantly in your browser. No data is sent to the server.
                        </p>
                    </div>
                    <div className="flex gap-2 hidden md:flex">
                        <button onClick={loadExample} className="px-4 py-2 bg-white border rounded-lg text-sm font-medium hover:bg-gray-50">Example</button>
                        <button onClick={clearAll} className="px-4 py-2 bg-white border rounded-lg text-sm font-medium hover:bg-red-50 text-red-600">Clear</button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="bg-white border rounded-t-xl p-3 flex flex-wrap gap-2 border-b-0 shadow-sm">
                    <button onClick={() => formatJson(2)} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition">Format (2 spaces)</button>
                    <button onClick={() => formatJson(4)} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition">Format (4 spaces)</button>
                    <button onClick={minifyJson} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition">Minify</button>
                </div>

                {/* Editor Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border rounded-b-xl shadow-sm overflow-hidden bg-white h-[600px]">

                    {/* Left: Input */}
                    <div className="h-full border-b lg:border-b-0 lg:border-r relative flex flex-col">
                        <div className="bg-gray-50 px-4 py-2 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider flex justify-between">
                            Raw Input
                            {errorMsg && <span className="text-red-500 lowercase normal-case">Invalid JSON</span>}
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Paste your raw JSON string here..."
                            className="flex-1 w-full p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 bg-gray-50/50"
                            spellCheck="false"
                        />
                        {/* Error Ribbon */}
                        {errorMsg && (
                            <div className="absolute bottom-0 left-0 right-0 bg-red-100/95 border-t border-red-200 text-red-800 px-4 py-3 text-sm font-mono flex items-start gap-2 backdrop-blur-sm z-10">
                                <span className="text-lg">✖</span>
                                <div>
                                    <p className="font-bold">JSON Error:</p>
                                    <p>{errorMsg}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Output */}
                    <div className="h-full bg-white relative flex flex-col">
                        <div className="bg-gray-50 px-4 py-2 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider flex justify-between items-center">
                            <span>Result</span>
                            {output && (
                                <button onClick={copyToClipboard} className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 font-medium group">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                    {copyStatus}
                                </button>
                            )}
                        </div>
                        <div className="flex-1 w-full p-4 overflow-auto">
                            {output ? (
                                <pre className="font-mono text-sm text-gray-800 whitespace-pre-wrap">{output}</pre>
                            ) : (
                                <div className="flex h-full items-center justify-center text-gray-400 font-medium">
                                    {errorMsg ? "Fix errors to see result" : "Output will appear here"}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
