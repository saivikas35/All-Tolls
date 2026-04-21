"use client";

import { useState } from "react";
import { TEMPLATE_SCHEMAS } from "./templateSchemas";

export default function ResumeSteps({ templateId, onComplete }) {
  const schema = TEMPLATE_SCHEMAS[templateId];
  const [data, setData] = useState({});

  if (!schema) {
    return <p className="text-center">Template schema not found</p>;
  }

  function handleSubmit() {
    onComplete(data);
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold mb-6">
        Enter your resume details
      </h2>

      {/* ===== BASICS ===== */}
      {schema.basics && (
        <section className="mb-6">
          <h3 className="font-semibold mb-3">Basic Information</h3>

          {Object.keys(schema.basics).map((field) => (
            <input
              key={field}
              required={schema.basics[field].required}
              placeholder={field}
              className="w-full border p-2 mb-2 rounded"
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  basics: {
                    ...prev.basics,
                    [field]: e.target.value
                  }
                }))
              }
            />
          ))}
        </section>
      )}

      {/* ===== EXPERIENCE ===== */}
      {schema.experience && (
        <section className="mb-6">
          <h3 className="font-semibold mb-3">Experience</h3>

          <textarea
            placeholder="Bullet points (one per line)"
            className="w-full border p-2 rounded"
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                experience: [
                  {
                    company: "Company Name",
                    role: "Role",
                    start: "2022",
                    end: "Present",
                    points: e.target.value.split("\n") // 🔒 GUARANTEED ARRAY
                  }
                ]
              }))
            }
          />
        </section>
      )}

      <button
        onClick={handleSubmit}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded"
      >
        Generate Resume
      </button>
    </div>
  );
}
