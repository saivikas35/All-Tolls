// frontend/src/app/page.jsx
import SearchHero from "@/components/SearchHero";
import ToolCard from "@/components/ToolCard";
import tools from "@/lib/tools";
import Link from "next/link";

export default function Home() {
  const popular = tools.slice(0, 12);

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow p-8">
          <SearchHero />
        </div>
      </div>

      {/* FEATURES */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-8">
          <div className="bg-white rounded-lg p-5 shadow">
            <h3 className="text-lg font-semibold mb-2">Fast & Accurate</h3>
            <p className="text-sm text-gray-600">High-quality conversions, preserve layout and images.</p>
          </div>

          <div className="bg-white rounded-lg p-5 shadow">
            <h3 className="text-lg font-semibold mb-2">Private & Secure</h3>
            <p className="text-sm text-gray-600">Files are removed after processing. We don't store or share your files without permission.</p>
          </div>

          <div className="bg-white rounded-lg p-5 shadow">
            <h3 className="text-lg font-semibold mb-2">Bulk & Batch Ready</h3>
            <p className="text-sm text-gray-600">Upload multiple files for batch actions — compress, convert, archive with one click.</p>
          </div>
        </div>
      </div>

      {/* POPULAR TOOLS */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Popular Tools</h2>
          <Link href="/all-tools" className="text-sm text-indigo-600 hover:underline">View all tools</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {popular.map((t) => (
            <div key={t.id} className="bg-white rounded-lg p-4 shadow hover:shadow-md transition toolcard-hover">
              <ToolCard tool={t} />
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className="text-2xl font-bold">Need bulk conversions or automated workflows?</h3>
            <p className="mt-2 text-indigo-100">Sign up for API access, batch processing, and priority conversions.</p>
            <div className="mt-4 flex gap-3">
              <Link href="/signup" className="px-4 py-2 bg-white text-indigo-700 rounded-md font-medium">Sign up free</Link>
              <Link href="/pricing" className="px-4 py-2 border border-white/30 rounded-md text-white/90">See pricing</Link>
            </div>
          </div>

          <div className="w-48 h-36 bg-white/10 rounded-lg flex items-center justify-center">
            <div className="text-white/90 text-center">
              <div className="text-3xl font-semibold">📁</div>
              <div className="text-sm mt-1">Batch Ready</div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">© {new Date().getFullYear()} AllTools — Built for students & engineers.</div>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-sm text-gray-600 hover:underline">Privacy</Link>
            <Link href="/terms" className="text-sm text-gray-600 hover:underline">Terms</Link>
            <Link href="/contact" className="text-sm text-gray-600 hover:underline">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
