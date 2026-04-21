"use client";

export default function ResumePreview({ resumeData }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Live Preview</h2>

      <div className="space-y-4 text-sm">
        <div>
          <h1 className="text-lg font-bold">{resumeData.name || "Your Name"}</h1>
          <p className="text-gray-600">
            {resumeData.email} {resumeData.phone && `| ${resumeData.phone}`}
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Professional Summary</h3>
          <p className="text-gray-700">
            {resumeData.summary || "Your summary will appear here."}
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Target Role</h3>
          <p>{resumeData.role}</p>
        </div>

        <div>
          <h3 className="font-semibold">Experience Level</h3>
          <p>{resumeData.level}</p>
        </div>
      </div>
    </div>
  );
}
