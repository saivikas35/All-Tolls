// frontend/src/components/ToolCard.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* Small SVG initials fallback */
function InitialsIcon({ text, size = 40 }) {
  const initials = (text || "")
    .split(" ")
    .slice(0, 2)
    .map((w) => (w[0] || ""))
    .join("")
    .toUpperCase();
  const fontSize = Math.round(size * 0.36);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden>
      <rect width={size} height={size} rx={8} fill="rgba(79,70,229,0.06)" />
      <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontWeight="700" fontSize={fontSize} fill="#4f46e5">
        {initials || "TO"}
      </text>
    </svg>
  );
}

/* Icon loader: try remote, then local, then initials */
function IconOrInitials({ remote, local, title, size = 28 }) {
  const [src, setSrc] = useState(null);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    let mounted = true;
    setSrc(null);
    setErrored(false);

    if (remote) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => { if (mounted) setSrc(remote); };
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
    return <img src={src} alt={title} width={size} height={size} style={{ width: size, height: size, objectFit: "contain" }} />;
  }
  if (errored) return <InitialsIcon text={title} size={size + 8} />;
  return <div style={{ width: size, height: size, borderRadius: 6, background: "rgba(0,0,0,0.03)" }} />;
}

export default function ToolCard({ tool }) {
  const router = useRouter();

  return (
    <div
      className="tool-card toolcard-hover"
      role="article"
      aria-label={tool.title}
      onClick={() => { if (tool.path) router.push(tool.path); else router.push(`/tools/${tool.id}`); }}
      style={{
        cursor: "pointer",
        borderRadius: 12,
        padding: 18,
        background: "white",
        border: "1px solid rgba(8,20,40,0.04)",
        boxShadow: "0 6px 18px rgba(2,6,23,0.04)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "160px"
      }}
    >
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <div
          className="tool-badge"
          aria-hidden
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            display: "grid",
            placeItems: "center",
            flex: "0 0 56px",
            background: tool.badgeColor || "rgba(0,0,0,0.04)"
          }}
        >
          <div style={{ width: 32, height: 32 }}>
            <IconOrInitials remote={tool.icon} local={tool.iconLocal} title={tool.title} size={32} />
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{tool.title}</div>
          <div style={{ color: "#6b7280", fontSize: 13 }}>{tool.category}</div>
        </div>
      </div>

      <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: "#6b7280", fontSize: 13 }}>{(tool.keywords || []).slice(0, 4).join(", ")}</div>
        <div style={{ color: "#7c3aed", fontWeight: 700 }}>Open →</div>
      </div>
    </div>
  );
}
