// frontend/src/components/SearchHero.jsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import tools from "@/lib/tools";

/* ---------- helper: scoring (same logic you had) ---------- */
function scoreQuery(tool, q) {
  if (!q) return 0;
  const s = q.trim().toLowerCase();
  let sc = 0;
  const title = (tool.title || "").toLowerCase();
  if (title === s) sc += 100;
  if (title.startsWith(s)) sc += 50;
  if (title.includes(s)) sc += 20;
  for (const kw of tool.keywords || []) {
    const k = kw.toLowerCase();
    if (k === s) sc += 60;
    else if (k.includes(s)) sc += 15;
  }
  if (tool.category && tool.category.toLowerCase().includes(s)) sc += 8;
  return sc;
}

/* ---------- Initials placeholder SVG ---------- */
function InitialsIcon({ text, size = 44 }) {
  const initials = (text || "")
    .split(" ")
    .slice(0, 2)
    .map((w) => (w[0] || ""))
    .join("")
    .toUpperCase();

  const fontSize = Math.round(size * 0.32);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden>
      <rect width={size} height={size} rx={Math.round(size * 0.18)} fill="rgba(79,70,229,0.06)" />
      <text
        x="50%"
        y="52%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="Inter, Arial, sans-serif"
        fontWeight="700"
        fontSize={fontSize}
        fill="#4f46e5"
      >
        {initials || "TO"}
      </text>
    </svg>
  );
}

/* ---------- Robust icon loader: try remote -> local -> initials ---------- */
function IconOrInitials({ remote, local, title, size = 44, alt }) {
  const [src, setSrc] = useState(null);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    let mounted = true;
    setErrored(false);
    setSrc(null);

    // attempt remote first
    if (remote) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        if (mounted) setSrc(remote);
      };
      img.onerror = () => {
        if (local) {
          const i2 = new Image();
          i2.onload = () => { if (mounted) setSrc(local); };
          i2.onerror = () => { if (mounted) setErrored(true); };
          i2.src = local;
        } else {
          if (mounted) setErrored(true);
        }
      };
      img.src = remote;
      return () => { mounted = false; };
    }

    // if no remote, try local
    if (local) {
      const i2 = new Image();
      i2.onload = () => setSrc(local);
      i2.onerror = () => setErrored(true);
      i2.src = local;
      return () => { mounted = false; };
    }

    setErrored(true);
    return () => { mounted = false; };
  }, [remote, local]);

  if (src) {
    return (
      <img
        src={src}
        alt={alt || title}
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: "contain", display: "block", borderRadius: Math.round(size * 0.18) }}
      />
    );
  }

  if (errored) {
    return <InitialsIcon text={title} size={size} />;
  }

  // loading placeholder while checking
  return <div style={{ width: size, height: size, borderRadius: Math.round(size * 0.18), background: "rgba(0,0,0,0.03)" }} aria-hidden />;
}

/* ---------- Main component (fixed useEffect handlers using refs) ---------- */
export default function SearchHero({ initialQuery = "" }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(-1); // -1 = none
  const [bounce, setBounce] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Refs to hold latest values for event handlers attached once
  const openRef = useRef(open);
  const suggestionsLenRef = useRef(0);
  const selectedRef = useRef(selected);

  // suggestions: score & sort
  const suggestions = useMemo(() => {
    const q = (query || "").trim();
    if (!q) return [];
    const scored = tools.map((t) => ({ t, s: scoreQuery(t, q) }));
    return scored
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map((x) => x.t);
  }, [query]);

  // keep refs in sync when these states change
  useEffect(() => { openRef.current = open; }, [open]);
  useEffect(() => { suggestionsLenRef.current = suggestions.length; }, [suggestions.length]);
  useEffect(() => { selectedRef.current = selected; }, [selected]);

  // Use a single effect to register global listeners once.
  useEffect(() => {
    function onDocClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setSelected(-1);
      }
    }

    function onKey(e) {
      const suggestionsCount = suggestionsLenRef.current;
      // If suggestions closed but user presses arrow, open suggestion list (if any)
      if (!openRef.current && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
        if (suggestionsCount > 0) {
          setOpen(true);
          setSelected(0);
          e.preventDefault();
        }
        return;
      }

      if (e.key === "Escape") {
        setOpen(false);
        setSelected(-1);
        inputRef.current?.blur();
      } else if (e.key === "ArrowDown") {
        if (suggestionsCount === 0) return;
        e.preventDefault();
        setOpen(true);
        setSelected((s) => {
          const next = Math.min(s + 1, suggestionsCount - 1);
          // if s was -1 -> go to 0
          return s === -1 ? 0 : next;
        });
      } else if (e.key === "ArrowUp") {
        if (suggestionsCount === 0) return;
        e.preventDefault();
        setSelected((s) => {
          if (s === -1) return suggestionsCount - 1;
          return Math.max(s - 1, 0);
        });
      }
    }

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
    // empty dependency - hook registers listeners once and uses refs to read latest values
  }, []);

  // reset selection when suggestions list changes
  useEffect(() => {
    setSelected(-1);
  }, [suggestions.length]);

  // when 'selected' changes, scroll that element into view and animate highlight
  useEffect(() => {
    if (!suggestionsRef.current) return;
    const idx = selected;
    if (idx >= 0) {
      setOpen(true);
      const el = suggestionsRef.current.querySelector(`[data-index="${idx}"]`);
      if (el && typeof el.scrollIntoView === "function") {
        el.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
        el.classList.add("highlight-animate");
        const t = setTimeout(() => el.classList.remove("highlight-animate"), 420);
        return () => clearTimeout(t);
      }
    }
  }, [selected]);

  // preview value shown in input when arrow navigating — do not replace original 'query' until user types/presses enter
  const displayValue = selected >= 0 && suggestions[selected] ? suggestions[selected].title : query;

  function navigateToTool(tool) {
    setOpen(false);
    setSelected(-1);
    if (tool.path) router.push(tool.path);
    else if (tool.href) router.push(tool.href);
    else router.push(`/tools/${tool.id}`);
  }

  function handleFocus() {
    setFocused(true);
    setOpen(Boolean(query.trim()));
    if (!bounce) {
      setBounce(true);
      setTimeout(() => setBounce(false), 520);
    }
  }

  function handleBlur() {
    setFocused(false);
    // delay so suggestion clicks register
    setTimeout(() => {
      if (!document.activeElement || !containerRef.current?.contains(document.activeElement)) {
        setOpen(false);
        setSelected(-1);
      }
    }, 150);
  }

  // ---- IMPORTANT FIX: use the displayed value to decide label lift
  const isLifted = focused || Boolean(displayValue && displayValue.toString().trim().length > 0);
  const wrapperClass = `search-wrapper ${isLifted ? "lifted" : ""} ${bounce ? "bounce" : ""}`;

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold">Type what you need — we'll suggest the right tool</h1>
        <p className="text-gray-500 mt-2">Try “pdf to word”, “compress pdf”, “jpg to png”, or “remove blank pages”.</p>
      </div>

      <div className="flex justify-center">
        <div className={`${wrapperClass} ${query.trim().length > 0 ? "has-value" : ""} w-full max-w-6xl relative`}>
          {/* Search base */}
          <div className="search-base" role="search" aria-label="Site search">
            <div className="search-highlight" aria-hidden />

            <div className="search-icon" aria-hidden>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="5.2" stroke="currentColor" strokeWidth="1.6" />
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="relative flex-1">
              <label
                className={`search-label ${focused || (query && query.toString().trim().length > 0) ? "active" : ""}`}
                htmlFor="siteSearchPremium"
              >
                E.g. “convert pdf to word”
              </label>

              <input
                id="siteSearchPremium"
                ref={inputRef}
                className="search-input"
                value={displayValue}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelected(-1);
                  setOpen(Boolean(e.target.value.trim()));
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (selected >= 0 && suggestions[selected]) {
                      navigateToTool(suggestions[selected]);
                    } else if (query.trim()) {
                      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                      setOpen(false);
                      setSelected(-1);
                    }
                  } else if (e.key === "Escape") {
                    setOpen(false);
                    setSelected(-1);
                    inputRef.current?.blur();
                  }
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder=""
                aria-label="Search tools"
                autoComplete="off"
              />
            </div>

            <div className="flex-shrink-0">
              <button
                className="search-btn"
                onClick={() => {
                  if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                  else inputRef.current?.focus();
                }}
                aria-label="Search"
                type="button"
              >
                Search
              </button>
            </div>
          </div>

          {/* suggestions & backdrop */}
          {open && suggestions.length > 0 && (
            <>
              {/* small backdrop under the popup to separate suggestions */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: "100%",
                  height: "340px",
                  pointerEvents: "none",
                  backdropFilter: "blur(6px)",
                  background: "rgba(255,255,255,0.34)",
                  zIndex: 5
                }}
                aria-hidden
              />

              <div
                ref={suggestionsRef}
                className="suggestion-container"
                role="listbox"
                aria-label="Search suggestions"
                tabIndex={-1}
              >
                {suggestions.map((tool, i) => {
                  const isSelected = i === selected;
                  return (
                    <div
                      key={tool.id}
                      data-index={i}
                      role="option"
                      aria-selected={isSelected}
                      className={`suggestion-row ${isSelected ? "selected" : ""}`}
                      onMouseEnter={() => setSelected(i)}
                      onMouseLeave={() => setSelected(-1)}
                      onMouseDown={(e) => e.preventDefault()} // keep focus in input
                      onClick={() => navigateToTool(tool)}
                    >
                      <div className="suggestion-ico" aria-hidden>
                        <IconOrInitials remote={tool.icon} local={tool.iconLocal} title={tool.title} size={44} alt={tool.title} />
                      </div>

                      <div style={{ flex: 1 }}>
                        <div className="suggestion-title">{tool.title}</div>
                        <div className="suggestion-sub">{tool.category}</div>
                      </div>

                      <div style={{ marginLeft: 12, color: "#7c3aed", fontWeight: 600 }}>→</div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
