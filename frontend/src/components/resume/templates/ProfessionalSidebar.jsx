"use client";

export default function ProfessionalSidebar({ data }) {
  if (!data) return null;

  const { basics, skills, experience, education, sectionsEnabled = {} } = data;

  return (
    <div className="grid grid-cols-4 gap-6 text-sm text-black">

      {/* LEFT SIDEBAR */}
      <aside className="col-span-1 bg-gray-100 p-4 rounded-lg">
        <h2 className="font-bold text-base mb-3">Profile</h2>
        <p className="mb-4">{basics?.summary}</p>

        {sectionsEnabled.skills !== false && (
          <>
            <h3 className="font-semibold mb-2">Skills</h3>
            <ul className="list-disc ml-4 space-y-1">
              {skills?.technical?.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <main className="col-span-3 space-y-6">
        <header>
          <h1 className="text-2xl font-bold">{basics?.name}</h1>
          <p className="text-gray-600">{basics?.title}</p>
        </header>

        {sectionsEnabled.experience !== false && (
          <section>
            <h2 className="font-semibold mb-2">Experience</h2>
            {experience?.map((job, i) => (
              <div key={i} className="mb-3">
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

        {sectionsEnabled.education !== false && (
          <section>
            <h2 className="font-semibold mb-1">Education</h2>
            {education?.map((edu, i) => (
              <p key={i}>{edu.degree}, {edu.institution}</p>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
