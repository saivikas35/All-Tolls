"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* Minimal icons */
const Icon = {
  jpg: (props = {}) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" aria-hidden><rect x="2" y="3" width="20" height="18" rx="2" fill="#FFB300" /><circle cx="9" cy="10" r="2.5" fill="#fff" /></svg>
  ),
  word: (props = {}) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" aria-hidden><rect x="3" y="3" width="18" height="18" rx="2" fill="#2B6CB0" /></svg>
  ),
  ppt: (props = {}) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" aria-hidden><rect x="3" y="3" width="18" height="18" rx="2" fill="#E35D3D" /></svg>
  ),
  zip: (props = {}) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" aria-hidden><rect x="3" y="3" width="18" height="18" rx="2" fill="#6B7280" /></svg>
  ),
  rar: (props = {}) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" aria-hidden><rect x="3" y="3" width="18" height="18" rx="2" fill="#9B59B6" /></svg>
  ),
  settings: (props = {}) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" aria-hidden><circle cx="12" cy="12" r="3" fill="#94A3B8" /></svg>
  ),
};

export default function Navbar() {
  // open states
  const [convertOpen, setConvertOpen] = useState(false);
  const [archiverOpen, setArchiverOpen] = useState(false);

  // refs for wrappers and buffers
  const convertRef = useRef(null);
  const convertPanelRef = useRef(null);
  const convertBufferRef = useRef(null);
  const convertTimer = useRef(null);

  const archiverRef = useRef(null);
  const archiverPanelRef = useRef(null);
  const archiverBufferRef = useRef(null);
  const archiverTimer = useRef(null);

  const CLOSE_DELAY = 150; // ms

  // helpers: clear timers
  function clearConvertTimer() {
    if (convertTimer.current) { clearTimeout(convertTimer.current); convertTimer.current = null; }
  }
  function clearArchiverTimer() {
    if (archiverTimer.current) { clearTimeout(archiverTimer.current); archiverTimer.current = null; }
  }

  // global click: close if outside respective wrappers
  useEffect(() => {
    function onDocClick(e) {
      if (convertRef.current && !convertRef.current.contains(e.target)) {
        setConvertOpen(false);
        clearConvertTimer();
      }
      if (archiverRef.current && !archiverRef.current.contains(e.target)) {
        setArchiverOpen(false);
        clearArchiverTimer();
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Open/close helpers for Convert
  function openConvert() {
    clearConvertTimer();
    setConvertOpen(true);
  }
  function scheduleCloseConvert() {
    clearConvertTimer();
    convertTimer.current = setTimeout(() => setConvertOpen(false), CLOSE_DELAY);
  }

  // Open/close helpers for Archiver
  function openArchiver() {
    clearArchiverTimer();
    setArchiverOpen(true);
  }
  function scheduleCloseArchiver() {
    clearArchiverTimer();
    archiverTimer.current = setTimeout(() => setArchiverOpen(false), CLOSE_DELAY);
  }

  // compute buffer style for a wrapper: position the buffer between trigger and panel
  // We update buffer position when menu opens. Use small timeout to wait for DOM.
  useEffect(() => {
    if (!convertOpen) return;
    // place buffer only when both trigger and panel exist
    const trigger = convertRef.current?.querySelector("button");
    const panel = convertPanelRef.current;
    const buffer = convertBufferRef.current;
    if (!trigger || !panel || !buffer) return;

    // compute bounding rects
    const tRect = trigger.getBoundingClientRect();
    const pRect = panel.getBoundingClientRect();

    // We want to cover the gap between bottom of trigger and top of panel, horizontally spanning overlap
    const left = Math.min(tRect.left, pRect.left);
    const right = Math.max(tRect.right, pRect.right);
    const width = Math.max(24, right - left); // minimal width
    const top = Math.min(tRect.bottom, pRect.top) - 6; // place slightly above gap
    const height = Math.max(24, Math.abs(pRect.top - tRect.bottom) + 12); // small height to cover gap

    // Convert to page coordinates (buffer is absolutely positioned relative to viewport via fixed)
    Object.assign(buffer.style, {
      position: "fixed",
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
      pointerEvents: "auto", // accept hover
      zIndex: 9999
    });
  }, [convertOpen]);

  useEffect(() => {
    if (!archiverOpen) return;
    const trigger = archiverRef.current?.querySelector("button");
    const panel = archiverPanelRef.current;
    const buffer = archiverBufferRef.current;
    if (!trigger || !panel || !buffer) return;

    const tRect = trigger.getBoundingClientRect();
    const pRect = panel.getBoundingClientRect();

    const left = Math.min(tRect.left, pRect.left);
    const right = Math.max(tRect.right, pRect.right);
    const width = Math.max(24, right - left);
    const top = Math.min(tRect.bottom, pRect.top) - 6;
    const height = Math.max(24, Math.abs(pRect.top - tRect.bottom) + 12);

    Object.assign(buffer.style, {
      position: "fixed",
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
      pointerEvents: "auto",
      zIndex: 9999
    });
  }, [archiverOpen]);

  // Hide buffers when not open
  useEffect(() => {
    if (!convertOpen && convertBufferRef.current) {
      convertBufferRef.current.style.pointerEvents = "none";
    }
  }, [convertOpen]);

  useEffect(() => {
    if (!archiverOpen && archiverBufferRef.current) {
      archiverBufferRef.current.style.pointerEvents = "none";
    }
  }, [archiverOpen]);

  return (
    <>
      {/* Invisible buffers appended at root so they sit above layout gaps.
          They are only active (pointerEvents) when menu is open. */}
      <div
        ref={convertBufferRef}
        onMouseEnter={() => { clearConvertTimer(); openConvert(); }}
        onMouseLeave={() => scheduleCloseConvert()}
        style={{ pointerEvents: "none" }}
      />
      <div
        ref={archiverBufferRef}
        onMouseEnter={() => { clearArchiverTimer(); openArchiver(); }}
        onMouseLeave={() => scheduleCloseArchiver()}
        style={{ pointerEvents: "none" }}
      />

      <nav className="bg-white/95 backdrop-blur-md border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* Left items */}
            <div className="flex items-center gap-6">
              <Link href="/" className="text-xl font-bold">AllTools</Link>

              {/* Convert wrapper: contains trigger + panel */}
              <div
                ref={convertRef}
                className="relative"
                onMouseEnter={() => { clearConvertTimer(); openConvert(); }}
                onMouseLeave={() => scheduleCloseConvert()}
              >
                <button
                  className="px-3 py-2 rounded hover:bg-gray-100 focus:outline-none"
                  onClick={() => { clearConvertTimer(); setConvertOpen(v => !v); }}
                  aria-expanded={convertOpen}
                >
                  Convert
                </button>

                {/* Panel */}
                <div
                  ref={convertPanelRef}
                  onMouseEnter={() => { clearConvertTimer(); openConvert(); }}
                  onMouseLeave={() => scheduleCloseConvert()}
                  className={`absolute left-0 mt-2 w-[760px] bg-white rounded-lg shadow-2xl border transform origin-top-left transition-all duration-150
                    ${convertOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'}`}
                >
                  <div className="p-5 grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Convert to PDF</h4>
                      <ul className="space-y-2">
                        <li>
                          <Link href="/convert/images-to-pdf" className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                            <Icon.jpg className="w-5 h-5" />
                            <div>
                              <div className="font-medium">JPG → PDF</div>
                              <div className="text-xs text-gray-500">Image to PDF</div>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link href="/convert/word-to-pdf" className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                            <Icon.word className="w-5 h-5" />
                            <div>
                              <div className="font-medium">DOCX → PDF</div>
                              <div className="text-xs text-gray-500">Word to PDF</div>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link href="/convert/ppt-to-pdf" className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                            <Icon.ppt className="w-5 h-5" />
                            <div>
                              <div className="font-medium">PPTX → PDF</div>
                              <div className="text-xs text-gray-500">PowerPoint to PDF</div>
                            </div>
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Convert from PDF</h4>
                      <ul className="space-y-2">
                        <li>
                          <Link href="/convert/pdf-to-jpg" className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                            <Icon.jpg className="w-5 h-5" />
                            <div>
                              <div className="font-medium">PDF → JPG</div>
                              <div className="text-xs text-gray-500">Extract images</div>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link href="/convert/pdf-to-word" className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                            <Icon.word className="w-5 h-5" />
                            <div>
                              <div className="font-medium">PDF → DOCX</div>
                              <div className="text-xs text-gray-500">PDF to Word</div>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link href="/convert/pdf-to-ppt" className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                            <Icon.ppt className="w-5 h-5" />
                            <div>
                              <div className="font-medium">PDF → PPTX</div>
                              <div className="text-xs text-gray-500">PDF to PowerPoint</div>
                            </div>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* top-level links */}
              <Link href="/convert/pdf-merge" className="px-3 py-2 rounded hover:bg-gray-100">Merge</Link>
              <Link href="/resume" className="px-3 py-2 rounded hover:bg-gray-100">Resume Builder</Link>
              <Link href="/ats-score" className="px-3 py-2 rounded hover:bg-gray-100">ATS Score</Link>
              <Link href="/feedback" className="px-3 py-2 rounded font-medium text-indigo-600 hover:bg-indigo-50">Feedback</Link>

              {/* Archiver wrapper */}
              <div
                ref={archiverRef}
                className="relative"
                onMouseEnter={() => { clearArchiverTimer(); openArchiver(); }}
                onMouseLeave={() => scheduleCloseArchiver()}
              >
                <button
                  className="px-3 py-2 rounded hover:bg-gray-100 focus:outline-none"
                  onClick={() => { clearArchiverTimer(); setArchiverOpen(v => !v); }}
                  aria-expanded={archiverOpen}
                >
                  Archiver
                </button>

                <div
                  ref={archiverPanelRef}
                  onMouseEnter={() => { clearArchiverTimer(); openArchiver(); }}
                  onMouseLeave={() => scheduleCloseArchiver()}
                  className={`absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border transform origin-top transition-all duration-150
                    ${archiverOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'}`}
                >
                  <ul className="p-3 space-y-2">
                    <li>
                      <Link href="/convert/zip-to-rar" className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
                        <Icon.zip className="w-5 h-5" /> ZIP → RAR
                      </Link>
                    </li>
                    <li>
                      <Link href="/convert/rar-to-zip" className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
                        <Icon.rar className="w-5 h-5" /> RAR → ZIP
                      </Link>
                    </li>
                    <li>
                      <Link href="/all-tools" className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
                        <Icon.settings className="w-5 h-5" /> All Tools
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right: auth */}
            <div className="flex items-center gap-3">
              <Link href="/login" className="px-3 py-2 border rounded">Login</Link>
              <Link href="/signup" className="px-3 py-2 bg-indigo-600 text-white rounded">Signup</Link>
            </div>

          </div>
        </div>
      </nav>
    </>
  );
}
