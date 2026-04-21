import ATSClassic from "./templates/ATSClassic";
import ProfessionalSidebar from "./templates/ProfessionalSidebar";
import TechFocused from "./templates/TechFocused";

export default function ResumeRenderer({ templateId, data }) {
  if (!templateId || !data) {
    return (
      <div className="text-center text-gray-500 p-10">
        No template selected
      </div>
    );
  }

  // ===== GROUP TEMPLATE IDS =====
  const ATS_TEMPLATES = [
    "ats-classic-1",
    "ats-classic-2",
    "ats-classic-3",
    "ats-elite",
    "ats-fresher",
    "academic-cv",
    "research-scholar"
  ];

  const PROFESSIONAL_TEMPLATES = [
    "pro-modern-1",
    "pro-modern-2",
    "pro-dark",
    "pro-light",
    "mba-executive",
    "product-manager",
    "business-lead"
  ];

  const TECH_TEMPLATES = [
    "tech-minimal",
    "tech-pro",
    "tech-dark"
  ];

  // ===== AUTO-GENERATED FALLBACK =====
  if (templateId.startsWith("template-")) {
    return <ProfessionalSidebar data={data} />;
  }

  // ===== RENDER MATCH =====
  if (ATS_TEMPLATES.includes(templateId)) {
    return <ATSClassic data={data} />;
  }

  if (PROFESSIONAL_TEMPLATES.includes(templateId)) {
    return <ProfessionalSidebar data={data} />;
  }

  if (TECH_TEMPLATES.includes(templateId)) {
    return <TechFocused data={data} />;
  }

  return (
    <div className="text-center text-red-500 p-10">
      Template not supported yet: {templateId}
    </div>
  );
}
