"use client";

export default function ATSClassic({ data }) {
  if (!data) return null;

  const {
    basics,
    skills,
    experience,
    education,
    sectionsEnabled = {}
  } = data;

  return (
    <div className="text-black text-sm leading-relaxed">

      {/* HEADER */}
      <header className="border-b pb-4 mb-4">
        <h1 className="text-3xl font-bold">
          {basics?.name}
        </h1>
        <p className="text-gray-600">
          {basics?.title}
        </p>
        <p className="text-xs text-gray-500">
          {basics?.email} | {basics?.phone} | {basics?.location}
        </p>
      </header>

      {/* SUMMARY */}
      {sectionsEnabled.summary !== false && (
        <section className="mb-4">
          <h2 className="font-semibold">Summary</h2>
          <p>{basics?.summary}</p>
        </section>
      )}

      {/* SKILLS */}
      {sectionsEnabled.skills !== false && (
        <section className="mb-4">
          <h2 className="font-semibold">Skills</h2>

          {Array.isArray(skills?.technical) && (
            <p>
              <strong>Technical:</strong>{" "}
              {skills.technical.join(", ")}
            </p>
          )}

          {Array.isArray(skills?.tools) && (
            <p>
              <strong>Tools:</strong>{" "}
              {skills.tools.join(", ")}
            </p>
          )}
        </section>
      )}

      {/* EXPERIENCE */}
      {sectionsEnabled.experience !== false && (
        <section className="mb-4">
          <h2 className="font-semibold">Experience</h2>

          {Array.isArray(experience) &&
            experience.map((job, i) => (
              <div key={i} className="mb-3">
                <strong>
                  {job.role} – {job.company}
                </strong>
                <div className="text-xs text-gray-500">
                  {job.start} – {job.end}
                </div>
                <ul className="list-disc ml-5">
                  {Array.isArray(job.points) &&
                    job.points.map((pt, j) => (
                      <li key={j}>{pt}</li>
                    ))}
                </ul>
              </div>
            ))}
        </section>
      )}

      {/* EDUCATION */}
      {sectionsEnabled.education !== false && (
        <section>
          <h2 className="font-semibold">Education</h2>

          {Array.isArray(education) &&
            education.map((edu, i) => (
              <p key={i}>
                {edu.degree}, {edu.institution} ({edu.year})
              </p>
            ))}
        </section>
      )}

    </div>
  );
}
