// frontend/src/components/ToolGrid.jsx
"use client";

import { useMemo, useState } from "react";
import ToolCard from "./ToolCard";

export default function ToolGrid({ initialTools = [] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = useMemo(() => ["All", ...Array.from(new Set(initialTools.map(t => t.category))).filter(Boolean)], [initialTools]);

  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    return initialTools.filter(t => {
      if (category !== "All" && t.category !== category) return false;
      if (!q) return true;
      const inTitle = t.title.toLowerCase().includes(q);
      const inKeywords = (t.keywords || []).some(k => k.toLowerCase().includes(q));
      const inCategory = t.category && t.category.toLowerCase().includes(q);
      return inTitle || inKeywords || inCategory;
    });
  }, [initialTools, query, category]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm ${category === cat ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"} transition`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools by name or keyword..."
            className="px-3 py-2 rounded-md border border-gray-200 w-64 focus:ring-1 focus:ring-indigo-400 outline-none"
          />
          <button onClick={() => { setQuery(""); setCategory("All"); }} className="text-sm text-gray-600 hover:underline">Reset</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-12 bg-white rounded-lg shadow-sm">
            No tools match your search.
          </div>
        ) : filtered.map(tool => (
          <div key={tool.id} className="bg-white rounded-lg p-4 shadow hover:shadow-md transition toolcard-hover">
            <ToolCard tool={tool} />
          </div>
        ))}
      </div>

      <div className="sm:hidden mt-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools..."
          className="w-full px-3 py-2 rounded-md border border-gray-200 focus:ring-1 focus:ring-indigo-400 outline-none"
        />
      </div>
    </div>
  );
}
