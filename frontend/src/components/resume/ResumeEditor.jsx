"use client";


import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';

// Import new High-Quality templates
// Import new High-Quality templates
import ResumeForm from "./ResumeForm";
import ATSScoreBadge from "./ATSScoreBadge";
import PageBalanceIndicator from "./PageBalanceIndicator";
import KeywordMatcher from "./KeywordMatcher";

import ATSClassicNew from "./templates/ATSClassicNew";
import ModernSidebarNew from "./templates/ModernSidebarNew";
import MinimalCleanNew from "./templates/MinimalCleanNew";
import TwoColumnSplit from "./templates/TwoColumnSplit";
import CompactProfessional from "./templates/CompactProfessional";
import BoldHeader from "./templates/BoldHeader";
import IvyLeague from "./templates/IvyLeague";
import MinimalistMono from "./templates/MinimalistMono";
import CorporateBlue from "./templates/CorporateBlue";

// Legacy templates (fallback)
import ATSClassic from "./templates/ATSClassic";
import ModernMinimal from "./templates/ModernMinimal";
import ProfessionalSidebar from "./templates/ProfessionalSidebar";
import TechFocused from "./templates/TechFocused";

const AVAILABLE_SECTIONS = [
  "summary",
  "skills",
  "experience",
  "education",
  "projects",
  "certifications",
  "languages",
  "awards"
];

export default function ResumeEditor({ template, data: initialData, setData: parentSetData }) {
  const [internalData, setInternalData] = useState({
    ...initialData,
    sectionsEnabled: initialData?.sectionsEnabled || {
      summary: true,
      skills: true,
      experience: true,
      education: true,
      projects: true,
      certifications: true,
      languages: true,
      awards: true
    }
  });

  // Sync internal state when initialData prop changes
  useEffect(() => {
    if (initialData) {
      setInternalData({
        ...initialData,
        sectionsEnabled: initialData.sectionsEnabled || {
          summary: true,
          skills: true,
          experience: true,
          education: true,
          projects: true,
          certifications: true,
          languages: true,
          awards: true
        }
      });
    }
  }, [initialData]);

  const data = parentSetData ? initialData : internalData;
  // If parent data doesn't have sectionsEnabled, use internal or default
  if (parentSetData && !data.sectionsEnabled) {
    data.sectionsEnabled = {
      summary: true,
      skills: true,
      experience: true,
      education: true,
      projects: true,
      certifications: true,
      languages: true,
      awards: true
    };
  }

  const setData = parentSetData || setInternalData;

  const [html2pdf, setHtml2pdf] = useState(null);

  // ✅ Dynamically load html2pdf only on client
  useEffect(() => {
    import("html2pdf.js").then((mod) => {
      setHtml2pdf(() => mod.default);
    });
  }, []);

  if (!template || !data) {
    return <div className="text-center py-20">No resume data</div>;
  }

  const toggleSection = (section) => {
    setData(prev => ({
      ...prev,
      sectionsEnabled: {
        ...prev.sectionsEnabled,
        [section]: !prev.sectionsEnabled[section]
      }
    }));
  };

  const downloadPDF = () => {
    if (!html2pdf) return;

    const element = document.getElementById("resume-download");

    html2pdf()
      .set({
        margin: 0,
        filename: "My_Resume.pdf",
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true
        },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" }
      })
      .from(element)
      .save()
      .catch(err => {
        console.error("PDF generation error:", err);
        alert("Error generating PDF. Please try a different template or check console for details.");
      });
  };

  const renderTemplate = () => {
    switch (template) {
      // New Purpose-Driven Templates (Synced with ResumeRenderer)
      case 'ats-classic-1': return <ATSClassicNew data={data} />;
      case 'ats-fresher': return <BoldHeader data={data} />;        // Pink Header
      case 'ats-elite': return <TwoColumnSplit data={data} />;      // Executive Serif
      case 'academic-cv': return <ModernSidebarNew data={data} />;  // Blue Sidebar
      case 'creative-portfolio': return <MinimalCleanNew data={data} />; // Cyan Accents
      case 'ivy-league': return <IvyLeague data={data} />;
      case 'minimalist-mono': return <MinimalistMono data={data} />;
      case 'corporate-blue': return <CorporateBlue data={data} />;

      // Fallback/Legacy Logic
      default:
        if (template.startsWith("ats")) return <ATSClassic data={data} />;
        if (template.startsWith("modern")) return <ModernMinimal data={data} />;
        if (template.startsWith("pro")) return <ProfessionalSidebar data={data} />;
        if (template.startsWith("tech")) return <TechFocused data={data} />;
        return <ATSClassicNew data={data} />; // Default to best one
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6 max-w-[1920px] mx-auto px-6 py-6 h-[calc(100vh-64px)]">

      {/* LEFT: EDITOR FORM (4 Cols) */}
      <div className="col-span-12 lg:col-span-4 xl:col-span-3 h-full overflow-hidden">
        <ResumeForm data={data} setData={setData} />
      </div>

      {/* MIDDLE: RESUME PREVIEW (5 Cols) */}
      <div className="col-span-12 lg:col-span-5 xl:col-span-6 h-full overflow-y-auto bg-gray-100 p-8 rounded-xl shadow-inner border border-gray-200 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4 px-4 max-w-[210mm]">
          <div className="text-sm text-gray-500 font-medium">Live Preview</div>
          <button
            onClick={downloadPDF}
            disabled={!html2pdf}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <span>Download PDF</span>
          </button>
        </div>

        <div
          id="resume-download"
          className="bg-white shadow-2xl rounded-sm origin-top text-left"
          style={{ width: '210mm', minHeight: '297mm' }} // A4 dimensions
        >
          {renderTemplate()}
        </div>
      </div>

      {/* RIGHT: INTELLIGENCE HUB (3 Cols) */}
      <div className="col-span-12 lg:col-span-3 xl:col-span-3 h-full overflow-y-auto space-y-4 pr-1">
        {/* ATS Score */}
        <ATSScoreBadge data={data} />

        {/* Page Density */}
        <PageBalanceIndicator data={data} />

        {/* Keyword Matcher */}
        <KeywordMatcher
          currentText={JSON.stringify(data)}
          targetRole={data.header?.title || "General"}
        />
      </div>
    </div>
  );
}
