"use client";

export default function TechFocused({ data }) {
  if (!data) return null;

  const { basics, projects, skills, sectionsEnabled = {} } = data;

  return (
    <div className="grid grid-cols-3 gap-6 text-sm">

      {/* LEFT */}
      <div className="col-span-1 bg-slate-50 p-4 rounded-lg">
        <h1 className="text-xl font-bold">{basics?.name}</h1>
        <p className="text-gray-600 mb-4">{basics?.title}</p>

        {sectionsEnabled.skills !== false && (
          <>
            <h3 className="font-semibold mb-1">Tech Stack</h3>
            <p>{skills?.technical?.join(", ")}</p>
          </>
        )}
      </div>

      {/* RIGHT */}
      <div className="col-span-2">
        {sectionsEnabled.projects !== false && (
          <section>
            <h2 className="font-semibold mb-3">Projects</h2>
            {projects?.map((p, i) => (
              <div key={i} className="mb-4">
                <strong>{p.name}</strong>
                <p className="text-xs text-gray-500">
                  {p.tech?.join(", ")}
                </p>
                <p>{p.description}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
