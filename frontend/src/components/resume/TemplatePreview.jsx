import ResumeRenderer from "./ResumeRenderer";
import previewResumeData from "./previewResumeData";

export default function TemplatePreview({ templateId, data }) {
  return (
    <div className="h-[660px] overflow-hidden flex justify-center bg-white">
      {/* Larger preview canvas like Overleaf */}
      <div
        style={{
          width: "820px",
          height: "1100px",
          transform: "scale(0.60)",
          transformOrigin: "top center",
          overflow: "hidden"
        }}
      >
        <ResumeRenderer
          resumeData={data || previewResumeData}
          templateId={templateId}
        />
      </div>
    </div>
  );
}

