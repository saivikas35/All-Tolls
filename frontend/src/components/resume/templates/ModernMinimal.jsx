"use client";

export default function ModernMinimal({ data }) {
  if (!data) return null;

  const { basics, experience, sectionsEnabled = {} } = data;

  return (
    <div className="p-10 text-sm text-black">

      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold">{basics?.name}</h1>
        <p className="text-gray-500">{basics?.title}</p>
      </header>

      {sectionsEnabled.experience !== false && (
        <section>
          <h2 className="font-semibold mb-4">Experience</h2>
          {experience?.map((job, i) => (
            <div key={i} className="mb-4">
              <strong>{job.role}</strong> – {job.company}
              <ul className="list-disc ml-5">
                {job.points?.map((pt, j) => (
                  <li key={j}>{pt}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
