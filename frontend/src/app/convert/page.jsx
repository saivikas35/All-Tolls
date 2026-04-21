import Link from "next/link";

const tools = [
  { id: "pdf", title: "PDF Tools", href: "/convert/pdf", desc: "Remove blank pages, merge, split, compress." },
  { id: "archives", title: "Archive Tools", href: "/convert/archives", desc: "ZIP ↔ RAR, extract, pack and convert." },
  { id: "word", title: "Word Tools", href: "/convert/word", desc: "DOCX → PDF, remove blank pages, convert." },
  { id: "images", title: "Image Tools", href: "/convert/images", desc: "Image → PDF, compress, resize." }
];

export default function ConvertIndex() {
  return (
    <div className="py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Convert</h1>
        <p className="text-gray-600 mb-6">Select a single conversion tool to open a focused workspace with a clean UI and helpful options.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {tools.map(t => (
            <Link key={t.id} href={t.href} className="group block p-6 bg-white rounded-lg shadow hover:shadow-lg border hover:border-indigo-200 transition">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold group-hover:text-indigo-600">{t.title}</h2>
                <div className="text-indigo-500">→</div>
              </div>
              <p className="text-sm text-gray-500 mt-3">{t.desc}</p>
              <div className="mt-4 text-sm text-gray-400">Open tool →</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
