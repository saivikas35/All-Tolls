"use client";

import { useState, useRef } from "react";

// --- STRICT ATS READINESS ENGINE ---
function evaluateATSReadiness(resumeText) {
    const text = resumeText.toLowerCase();

    // 1) Parsability & Formatting (40 points)
    let parsabilityScore = 40;
    let allChecks = [];

    // Length check
    const words = text.split(/\s+/).filter(Boolean).length;
    if (words < 200) {
        parsabilityScore -= 20;
        allChecks.push({ section: "Format", location: "Overall Length", passed: false, impact: "-20 pts", text: "Your resume is too short. Try to elaborate on your experiences and add more relevant details to hit at least 300 words." });
    } else if (words > 1500) {
        parsabilityScore -= 10;
        allChecks.push({ section: "Format", location: "Overall Length", passed: false, impact: "-10 pts", text: "Your resume is excessively long. Try to condense your descriptions and focus on your most relevant accomplishments to make it easier for ATS to digest." });
    } else {
        allChecks.push({ section: "Format", location: "Overall Length", passed: true, text: "Word count is within the optimal sweet spot for ATS parsers (200 - 1500 words)." });
    }

    // Weird characters / bad encoding check (tables, columns, graphics often parse as garbled text or huge empty spaces)
    const tabMatches = resumeText.match(/\t/g);
    if (tabMatches && tabMatches.length > 30) {
        parsabilityScore -= 15;
        allChecks.push({ section: "Format", location: "Document Formatting", passed: false, impact: "-15 pts", text: "Heavy usage of tabs detected, which often indicates multi-column layouts. Stick to a standard single-column format to ensure proper reading order." });
    } else {
        allChecks.push({ section: "Format", location: "Document Formatting", passed: true, text: "No complex multi-column layouts or heavy tab usage detected. Excellent for linear ATS reading." });
    }

    const weirdCharsMatch = resumeText.match(/[\uFFFD\u0000-\u001F]/g); // unprintable/replacement chars
    if (weirdCharsMatch && weirdCharsMatch.length > 10) {
        parsabilityScore -= 20;
        allChecks.push({ section: "Format", location: "Document Encoding", passed: false, impact: "-20 pts", text: "Corrupted text was detected. Remove any special icons, complex tables, or heavy graphics that might confuse a parser." });
    } else {
        allChecks.push({ section: "Format", location: "Document Encoding", passed: true, text: "Document encoding is clean. No unreadable or corrupted characters detected." });
    }

    // 2) Section Completeness (30 points)
    let completenessScore = 30;

    const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(text);
    const hasPhone = /\d{3}[-\.\s]?\d{3}[-\.\s]?\d{4}/.test(text) || /\(\d{3}\)\s*\d{3}-\d{4}/.test(text) || /\+[\d\s]+/.test(text);

    if (!hasEmail) {
        completenessScore -= 10;
        allChecks.push({ section: "Complete", location: "Contact Information (Email)", passed: false, impact: "-10 pts", text: "Make sure your email address is clearly written in standard text so the ATS can contact you." });
    } else {
        allChecks.push({ section: "Complete", location: "Contact Information (Email)", passed: true, text: "Email address successfully parsed." });
    }

    if (!hasPhone) {
        completenessScore -= 5;
        allChecks.push({ section: "Complete", location: "Contact Information (Phone)", passed: false, impact: "-5 pts", text: "Include a clear, standard phone number format so recruiters can reach you." });
    } else {
        allChecks.push({ section: "Complete", location: "Contact Information (Phone)", passed: true, text: "Phone number successfully parsed." });
    }

    const hasSkillsHeader = /\b(skills|technologies|core competencies|technical skills)\b/.test(text);
    if (!hasSkillsHeader) {
        completenessScore -= 5;
        allChecks.push({ section: "Complete", location: "Skills Section", passed: false, impact: "-5 pts", text: "Add a clear header titled 'Skills' or 'Technical Skills' so the ATS can accurately categorize your proficiencies." });
    } else {
        allChecks.push({ section: "Complete", location: "Skills Section", passed: true, text: "'Skills' header clearly identified by parser." });
    }

    const hasExpHeader = /\b(experience|employment|work history|professional background)\b/.test(text);
    if (!hasExpHeader) {
        completenessScore -= 10;
        allChecks.push({ section: "Complete", location: "Experience Section", passed: false, impact: "-10 pts", text: "Ensure your work background is clearly marked with a standard header like 'Experience' or 'Work History'." });
    } else {
        allChecks.push({ section: "Complete", location: "Experience Section", passed: true, text: "'Experience' header clearly identified by parser." });
    }

    const hasEduHeader = /\b(education|academic|degree|university|college)\b/.test(text);
    if (!hasEduHeader) {
        completenessScore -= 5;
        allChecks.push({ section: "Complete", location: "Education Section", passed: false, impact: "-5 pts", text: "Use explicitly titled headers like 'Education' so the parser can locate your degree information." });
    } else {
        allChecks.push({ section: "Complete", location: "Education Section", passed: true, text: "'Education' header clearly identified by parser." });
    }

    // 3) Clarity & Consistency (30 points)
    let clarityScore = 30;

    // Check for consistent dates
    const dateMatches = text.match(/\b(20[0-2]\d|199\d)\b/g) || [];
    const uniqueYears = new Set(dateMatches);
    if (uniqueYears.size === 0) {
        clarityScore -= 20;
        allChecks.push({ section: "Clarity", location: "Experience Dates", passed: false, impact: "-20 pts", text: "Make sure to list your employment dates clearly including the four-digit year (e.g. 2021) so the ATS can track your duration." });
    } else if (uniqueYears.size < 3) {
        clarityScore -= 10;
        allChecks.push({ section: "Clarity", location: "Experience Dates", passed: false, impact: "-10 pts", text: "Very few dates were detected. Ensure every position clearly lists standard starting and ending years." });
    } else {
        allChecks.push({ section: "Clarity", location: "Experience Dates", passed: true, text: "Four-digit employment dates properly parsed. Work duration history is clear." });
    }

    // Check for bullet points or lists (bullet characters like •, -, *)
    const bulletMatches = resumeText.match(/[•\-\*]\s/g) || [];
    if (bulletMatches.length < 2) { // Relaxed to 2 to account for bad PDF extraction losing bullet characters
        clarityScore -= 15;
        allChecks.push({ section: "Clarity", location: "Bullet Points", passed: false, impact: "-15 pts", text: "Use standard bullet points (•) to break up your text. Custom graphics or dense paragraphs are penalized." });
    } else {
        allChecks.push({ section: "Clarity", location: "Bullet Points", passed: true, text: "Standard bullet points detected. Excellent readability." });
    }

    const vagueWords = ["familiar with", "basic knowledge of", "hard worker", "team player", "synergy"];
    const foundVague = vagueWords.filter(v => text.includes(v));
    if (foundVague.length > 0) {
        clarityScore -= 5;
        allChecks.push({ section: "Clarity", location: "Content Clarity", passed: false, impact: "-5 pts", text: `Avoid vague terminology like "${foundVague[0]}". State your exact tools, metrics, and achievements objectively.` });
    } else {
        allChecks.push({ section: "Clarity", location: "Content Clarity", passed: true, text: "No common vague buzzwords detected. Language is highly objective." });
    }

    parsabilityScore = Math.max(0, parsabilityScore);
    completenessScore = Math.max(0, completenessScore);
    clarityScore = Math.max(0, clarityScore);

    const totalScore = parsabilityScore + completenessScore + clarityScore;

    let parsingVerdict = "Poorly Parseable";
    if (totalScore >= 75) parsingVerdict = "Fully Parseable";
    else if (totalScore >= 50) parsingVerdict = "Partially Parseable";

    let honestVerdict = "";
    if (totalScore >= 80) honestVerdict = "Resume is cleanly structured and well-formatted. Excellent job defining sections clearly.";
    else if (totalScore >= 60) honestVerdict = "Solid foundation, but the parser struggled with some data. Look at the specific feedback below to push your score over 80.";
    else if (totalScore >= 40) honestVerdict = "Severe structural issues detected. Critical contact, date, or experience markers failed to parse correctly. Needs heavy formatting revision.";
    else honestVerdict = "Document is almost entirely unreadable to standard ATS parsers. Remove complex multi-column layouts and custom graphics immediately.";

    return {
        score: totalScore,
        parsingVerdict,
        breakdown: {
            parsability: parsabilityScore,
            completeness: completenessScore,
            clarity: clarityScore
        },
        allChecks,
        honestVerdict
    };
}


// --- UI COMPONENTS ---

function ScoreRing({ score }) {
    const color =
        score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
    const r = 56;
    const circ = 2 * Math.PI * r;
    const dash = (score / 100) * circ;

    return (
        <div className="relative flex justify-center items-center w-40 h-40 mx-auto">
            <svg width="150" height="150" viewBox="0 0 140 140" className="transform -rotate-90">
                <circle cx="70" cy="70" r={r} fill="none" stroke="#f1f5f9" strokeWidth="12" />
                <circle
                    cx="70" cy="70" r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth="12"
                    strokeDasharray={`${dash} ${circ}`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dasharray 1s ease-out" }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-slate-800 tracking-tight">{score}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">/ 100</span>
            </div>
        </div>
    );
}

export default function ATSScorePage() {
    const [result, setResult] = useState(null);
    const [isExtracting, setIsExtracting] = useState(false);
    const fileRef = useRef(null);

    let API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        API_BASE = "http://localhost:8000";
    }

    async function handleFileRead(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsExtracting(true);
        setResult(null);

        try {
            let extractedText = "";

            if (file.name.endsWith('.txt') || file.type === 'text/plain') {
                const reader = new FileReader();
                extractedText = await new Promise((resolve) => {
                    reader.onload = (ev) => resolve(ev.target.result || "");
                    reader.readAsText(file);
                });
            } else {
                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch(`${API_BASE}/api/convert/extract-text`, {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.detail || "Failed to parse document. Unrecognized format.");
                }

                const data = await res.json();
                if (data.success && data.text) {
                    extractedText = data.text;
                } else {
                    throw new Error("No readable text isolated in document.");
                }
            }

            if (extractedText.trim()) {
                const analysisResult = evaluateATSReadiness(extractedText);
                setResult({ ...analysisResult, filename: file.name });
            } else {
                throw new Error("Document is completely empty.");
            }
        } catch (error) {
            alert("SYSTEM ERROR: " + error.message);
        } finally {
            setIsExtracting(false);
            if (fileRef.current) fileRef.current.value = "";
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Header */}
            <div className="bg-indigo-600 text-white w-full py-16 px-4 shadow-md bg-gradient-to-r from-indigo-600 to-indigo-800">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6 shadow-sm">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">ATS Resume Checker</h1>
                    <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                        Evaluate your resume's formatting, complete sections, and clarity. Find out exactly where to improve to pass Applicant Tracking Systems.
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 w-full flex-1 -mt-8 pb-20 z-10">
                {!result ? (
                    // --- UPLOAD STATE ---
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-12 text-center max-w-2xl mx-auto transform transition-all hover:shadow-2xl hover:-translate-y-1">

                        <div className="flex-1 flex flex-col items-center justify-center w-full">
                            {isExtracting ? (
                                <div className="space-y-6 py-6">
                                    <div className="w-14 h-14 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto shadow-sm"></div>
                                    <div className="text-lg font-bold text-slate-700">Evaluating Document...</div>
                                    <p className="text-slate-500 text-sm">Checking structural integrity and reading metrics.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="p-4 bg-indigo-50 text-indigo-500 rounded-full mb-6 ring-8 ring-indigo-50/50">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Select Resume to Check</h2>
                                    <div className="text-sm text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
                                        Supports PDF, DOCX, and TXT files. Feedback is generated securely and instantly.
                                    </div>
                                    <button
                                        onClick={() => fileRef.current?.click()}
                                        className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 active:scale-95 w-full sm:w-auto"
                                    >
                                        Upload Document
                                    </button>
                                </>
                            )}
                        </div>

                        <input
                            ref={fileRef}
                            type="file"
                            accept=".txt,.text,.pdf,.docx"
                            className="hidden"
                            onChange={handleFileRead}
                        />
                    </div>
                ) : (
                    // --- RESULTS DISPLAY ---
                    <div className="space-y-8 animate-fade-in">
                        <button
                            onClick={() => setResult(null)}
                            className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-2 mb-2 group transition-colors"
                        >
                            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                            Check Another Document
                        </button>

                        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                            <div className="bg-slate-50 border-b border-slate-200 px-8 py-5 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    Assessment Overview
                                </h3>
                                <div className="text-sm text-slate-500 font-medium truncate max-w-[200px]">
                                    {result.filename}
                                </div>
                            </div>

                            <div className="p-8 grid md:grid-cols-12 gap-10 items-center">
                                {/* Score Indicator */}
                                <div className="md:col-span-4 flex flex-col items-center border-b md:border-b-0 md:border-r border-slate-100 pb-8 md:pb-0">
                                    <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Readiness Score</div>
                                    <ScoreRing score={result.score} />
                                    <div className={`mt-6 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm border ${result.score >= 75 ? 'bg-green-50 text-green-700 border-green-200' :
                                        result.score >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                            'bg-red-50 text-red-700 border-red-200'
                                        }`}>
                                        Verdict: {result.parsingVerdict}
                                    </div>
                                </div>

                                {/* Metrics Breakdown & Assessment */}
                                <div className="md:col-span-8 flex flex-col justify-center">
                                    <div className="mb-8">
                                        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">System Assessment</div>
                                        <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-xl text-slate-700 leading-relaxed font-medium">
                                            {result.honestVerdict}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Metric Breakdown</div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="border border-slate-100 bg-slate-50 rounded-xl p-5 hover:bg-slate-100 transition-colors">
                                                <div className="text-xs font-bold tracking-wider uppercase text-slate-500 mb-3 block">Format</div>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-3xl font-extrabold text-slate-800">{Math.round((result.breakdown.parsability / 40) * 100)}%</span>
                                                    <span className="text-sm text-slate-400 font-medium ml-1">({result.breakdown.parsability}/40)</span>
                                                </div>
                                            </div>
                                            <div className="border border-slate-100 bg-slate-50 rounded-xl p-5 hover:bg-slate-100 transition-colors">
                                                <div className="text-xs font-bold tracking-wider uppercase text-slate-500 mb-3 block">Complete</div>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-3xl font-extrabold text-slate-800">{Math.round((result.breakdown.completeness / 30) * 100)}%</span>
                                                    <span className="text-sm text-slate-400 font-medium ml-1">({result.breakdown.completeness}/30)</span>
                                                </div>
                                            </div>
                                            <div className="border border-slate-100 bg-slate-50 rounded-xl p-5 hover:bg-slate-100 transition-colors">
                                                <div className="text-xs font-bold tracking-wider uppercase text-slate-500 mb-3 block">Clarity</div>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-3xl font-extrabold text-slate-800">{Math.round((result.breakdown.clarity / 30) * 100)}%</span>
                                                    <span className="text-sm text-slate-400 font-medium ml-1">({result.breakdown.clarity}/30)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Complete Rule Checklist */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="bg-slate-50 border-b border-slate-200 px-8 py-5 flex items-center justify-between">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                                    Complete ATS Rules Checklist
                                </h3>
                                <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                                    {result.allChecks.filter(c => c.passed).length} / {result.allChecks.length} Passed
                                </span>
                            </div>

                            <div className="p-8">
                                <div className="space-y-8">
                                    {['Format', 'Complete', 'Clarity'].map(sectionName => {
                                        const sectionChecks = result.allChecks.filter(i => i.section === sectionName);
                                        if (sectionChecks.length === 0) return null;
                                        return (
                                            <div key={sectionName}>
                                                <h4 className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-4 border-b border-slate-100 pb-2">{sectionName} Checks</h4>
                                                <div className="space-y-3">
                                                    {sectionChecks.map((check, idx) => (
                                                        <div key={idx} className={`flex gap-4 p-4 border rounded-xl shadow-sm transition-all hover:shadow-md ${check.passed ? 'bg-green-50/20 border-green-100' : 'bg-red-50/30 border-red-100'}`}>
                                                            <div className="shrink-0 mt-0.5">
                                                                {check.passed ? (
                                                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                                ) : (
                                                                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                                                )}
                                                            </div>
                                                            <div className="text-sm leading-relaxed w-full">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className={`font-bold ${check.passed ? 'text-green-900' : 'text-slate-900'}`}>{check.location}</span>
                                                                    {!check.passed && (
                                                                        <span className="text-red-500 text-xs font-mono bg-white px-2 py-0.5 rounded border border-red-200 shadow-sm">{check.impact}</span>
                                                                    )}
                                                                </div>
                                                                <div className={check.passed ? 'text-green-700/80 font-medium' : 'text-slate-600 font-medium'}>{check.text}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>

        </div>
    );
}
