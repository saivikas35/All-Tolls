"use client";

import { useState } from "react";
import TemplateSelector from "@/components/resume/TemplateSelector";
import ResumeEditor from "@/components/resume/ResumeEditor";
import templates from "@/components/resume/templatesData";
import sampleResumeData from "@/components/resume/sampleResumeData";

export default function ResumeBuilderPage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  if (!selectedTemplateId) {
    return <TemplateSelector onSelect={setSelectedTemplateId} />;
  }

  // Find the full template object to get its persona
  const templateConfig = templates.find(t => t.id === selectedTemplateId);
  const initialData = templateConfig?.persona || sampleResumeData;

  return (
    <ResumeEditor
      template={selectedTemplateId}
      data={initialData}
    />
  );
}
