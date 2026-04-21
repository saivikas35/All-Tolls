"use client";
import { useState } from "react";

export default function ResumeSteps({ onComplete }) {
  const [step, setStep] = useState(1);

  const [resume, setResume] = useState({
    role: "",
    level: "",
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    summary: "",
    skills: {
      languages: "",
      frameworks: "",
      tools: "",
      databases: ""
    },
    projects: [],
    experience: [],
    education: "",
    certifications: []
  });

  const update = (field, value) => {
    setResume(prev => ({ ...prev, [field]: value }));
  };

  const updateSkill = (field, value) => {
    setResume(prev => ({
      ...prev,
      skills: { ...prev.skills, [field]: value }
    }));
  };

  // ---------------- STEPS ----------------

  if (step === 1) {
    return (
      <Step title="Target Role">
        <Input label="Target Role" onChange={v => update("role", v)} />
        <Select label="Experience Level" options={["Student","Fresher","Experienced"]}
          onChange={v => update("level", v)} />
        <Next setStep={setStep} step={step} />
      </Step>
    );
  }

  if (step === 2) {
    return (
      <Step title="Personal Details">
        <Input label="Full Name" onChange={v => update("name", v)} />
        <Input label="Email" onChange={v => update("email", v)} />
        <Input label="Phone" onChange={v => update("phone", v)} />
        <Input label="Location" onChange={v => update("location", v)} />
        <Input label="LinkedIn (optional)" onChange={v => update("linkedin", v)} />
        <Input label="GitHub / Portfolio (optional)" onChange={v => update("github", v)} />
        <Nav step={step} setStep={setStep} />
      </Step>
    );
  }

  if (step === 3) {
    return (
      <Step title="Professional Summary">
        <Textarea onChange={v => update("summary", v)} />
        <Nav step={step} setStep={setStep} />
      </Step>
    );
  }

  if (step === 4) {
    return (
      <Step title="Skills">
        <Textarea label="Programming Languages" onChange={v => updateSkill("languages", v)} />
        <Textarea label="Frameworks / Libraries" onChange={v => updateSkill("frameworks", v)} />
        <Textarea label="Tools / Platforms" onChange={v => updateSkill("tools", v)} />
        <Textarea label="Databases" onChange={v => updateSkill("databases", v)} />
        <Nav step={step} setStep={setStep} />
      </Step>
    );
  }

  if (step === 5) {
    return (
      <Step title="Projects">
        <Textarea
          label="Each project in new line"
          onChange={v => update("projects", v.split("\n"))}
        />
        <Nav step={step} setStep={setStep} />
      </Step>
    );
  }

  if (step === 6) {
    return (
      <Step title="Experience (Optional)">
        <Textarea
          label="Each experience in new line"
          onChange={v => update("experience", v.split("\n"))}
        />
        <Nav step={step} setStep={setStep} />
      </Step>
    );
  }

  if (step === 7) {
    return (
      <Step title="Education">
        <Textarea onChange={v => update("education", v)} />
        <Nav step={step} setStep={setStep} />
      </Step>
    );
  }

  if (step === 8) {
    return (
      <Step title="Certifications">
        <Textarea
          label="Each certification in new line"
          onChange={v => update("certifications", v.split("\n"))}
        />
        <button
          onClick={() => onComplete(resume)}
          className="mt-4 px-4 py-2 bg-black text-white rounded"
        >
          Finish Resume
        </button>
      </Step>
    );
  }
}

/* ---------- helper UI wrappers (NO layout change) ---------- */

const Step = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

const Input = ({ label, onChange }) => (
  <>
    {label && <label className="font-medium">{label}</label>}
    <input
      className="w-full border rounded px-3 py-2 mb-3"
      onChange={e => onChange(e.target.value)}
    />
  </>
);

const Textarea = ({ label, onChange }) => (
  <>
    {label && <label className="font-medium">{label}</label>}
    <textarea
      className="w-full border rounded px-3 py-2 mb-3 h-28"
      onChange={e => onChange(e.target.value)}
    />
  </>
);

const Select = ({ label, options, onChange }) => (
  <>
    <label className="font-medium">{label}</label>
    <select
      className="w-full border rounded px-3 py-2 mb-3"
      onChange={e => onChange(e.target.value)}
    >
      <option value="">Select</option>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  </>
);

const Nav = ({ step, setStep }) => (
  <div className="flex justify-between mt-4">
    <button disabled={step===1} onClick={() => setStep(step-1)}>Back</button>
    <button onClick={() => setStep(step+1)}>Next</button>
  </div>
);

const Next = ({ setStep, step }) => (
  <button onClick={() => setStep(step+1)} className="mt-4">
    Next
  </button>
);
