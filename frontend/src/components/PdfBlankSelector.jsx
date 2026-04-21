import { useState } from "react";

export default function PdfBlankSelector({ pages, onConfirm }) {
  const [selected, setSelected] = useState(() =>
    pages.filter(p => p.is_candidate_blank).map(p => p.page)
  );

  function toggle(page) {
    setSelected(sel => sel.includes(page) ? sel.filter(x => x !== page) : [...sel, page]);
  }
  function selectAllCandidates() {
    setSelected(pages.filter(p => p.is_candidate_blank).map(p => p.page));
  }
  function clearAll() { setSelected([]); }
  function invertSelection() {
    const all = pages.map(p => p.page);
    setSelected(sel => all.filter(p => !sel.includes(p)));
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button className="px-3 py-1 bg-gray-100 rounded" onClick={selectAllCandidates}>Select suggested</button>
        <button className="px-3 py-1 bg-gray-100 rounded" onClick={clearAll}>Clear</button>
        <button className="px-3 py-1 bg-gray-100 rounded" onClick={invertSelection}>Invert</button>
        <div className="ml-auto text-sm text-gray-500">Selected: {selected.length}/{pages.length}</div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {pages.map(p => (
          <div key={p.page} className="border rounded p-2">
            <div className="relative">
              <img src={p.thumbnail} alt={`Page ${p.page}`} className="w-full h-auto" />
              <div className="absolute top-1 left-1 bg-white/80 px-1 text-xs rounded">#{p.page}</div>
              <div className="absolute top-1 right-1">
                <input type="checkbox" checked={selected.includes(p.page)} onChange={() => toggle(p.page)} />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              {p.is_candidate_blank ? <span className="text-red-600">Suggested blank</span> : <span>Has content</span>}
              <div>Text: {p.text_length} · Images: {p.image_count}</div>
              <div>Confidence: {Math.round(p.confidence*100)}%</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          className="px-4 py-2 bg-red-600 text-white rounded"
          onClick={() => onConfirm(selected)}
          disabled={selected.length === 0}
        >
          Remove selected pages
        </button>
      </div>
    </div>
  );
}
