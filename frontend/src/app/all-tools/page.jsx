// frontend/src/app/all-tools/page.jsx
import ToolGrid from "@/components/ToolGrid";
import tools from "@/lib/tools";
import Link from "next/link";

export const metadata = {
  title: "All Tools — AllTools",
  description: "Browse all conversion, compression, archive and productivity tools",
};

export default function AllToolsPage() {
  // derive categories from tools metadata (unique)
  const categories = Array.from(new Set(tools.map(t => t.category))).filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">All Tools</h1>
            <p className="text-gray-500 mt-1">Browse converters, compressors, archive utilities, and more — built for engineers & students.</p>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <Link href="/" className="text-sm text-indigo-600 hover:underline">Back to home</Link>
            <Link href="/convert" className="text-sm text-gray-700 hover:text-indigo-600">Convert</Link>
            <Link href="/archive" className="text-sm text-gray-700 hover:text-indigo-600">Archive</Link>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-gray-600">Filter by category</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {/* Client component ToolGrid will render interactive category chips */}
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm">All</span>
                {categories.slice(0,8).map(cat => (
                  <span key={cat} className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">{cat}</span>
                ))}
              </div>
            </div>

            <div className="w-full sm:w-72">
              {/* simple search that navigates to homepage search or to /all-tools?q= */}
              <form action="/all-tools" method="get" className="flex items-center gap-2">
                <input
                  name="q"
                  type="text"
                  placeholder="Search all tools..."
                  className="w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm outline-none focus:ring-1 focus:ring-indigo-400"
                />
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm">Search</button>
              </form>
            </div>
          </div>
        </div>

        {/* Client-side interactive grid (ToolGrid is client component) */}
        <ToolGrid initialTools={tools} />
      </div>
    </div>
  );
}
