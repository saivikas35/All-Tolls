import ArchiveConverter from "@/components/ArchiveConverter";

export default function ConvertArchivesPage() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Archive Converter</h1>
          <p className="text-gray-600 mt-2">Convert between ZIP and RAR, extract archives, and download converted results.</p>
        </header>

        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <ArchiveConverter />
        </div>
      </div>
    </div>
  );
}
