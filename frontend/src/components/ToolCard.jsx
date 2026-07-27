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
      className="tool-card group transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl cursor-pointer rounded-2xl p-4 bg-white border border-gray-100/80 shadow-sm flex flex-col justify-between h-[165px] relative overflow-hidden"
      role="article"
      aria-label={tool.title}
      onClick={() => { if (tool.path) router.push(tool.path); else router.push(`/tools/${tool.id}`); }}
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-50/40 to-purple-50/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <div
          className="tool-badge transition-transform duration-300 group-hover:scale-105"
          aria-hidden
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            display: "grid",
            placeItems: "center",
            flex: "0 0 52px",
            background: tool.badgeColor || "rgba(0,0,0,0.04)"
          }}
        >
          <div style={{ width: 30, height: 30 }}>
            <IconOrInitials remote={tool.icon} local={tool.iconLocal} title={tool.title} size={30} />
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div className="font-bold text-gray-900 text-base group-hover:text-indigo-600 transition-colors">{tool.title}</div>
          <div className="text-gray-400 text-xs font-medium mt-0.5">{tool.category}</div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between pt-3 border-t border-gray-50">
        <div className="text-gray-400 text-xs truncate max-w-[70%] font-normal">{(tool.keywords || []).slice(0, 3).join(", ")}</div>
        <div className="text-indigo-600 font-semibold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          <span>Open</span>
          <span>→</span>
        </div>
      </div>
    </div>
  );
}
