import ATSClassicNew from "./templates/ATSClassicNew";
import ModernSidebarNew from "./templates/ModernSidebarNew";
import MinimalCleanNew from "./templates/MinimalCleanNew";
import TwoColumnSplit from "./templates/TwoColumnSplit";
import CompactProfessional from "./templates/CompactProfessional";
import BoldHeader from "./templates/BoldHeader";
import IvyLeague from "./templates/IvyLeague";
import MinimalistMono from "./templates/MinimalistMono";
import CorporateBlue from "./templates/CorporateBlue";
import { resumePersonas } from "./previewResumeData";

export default function ResumeRenderer({ resumeData, templateId = "ats-classic-1" }) {
  if (!resumeData) {
    return <div className="text-center text-gray-500 p-10">No resume data available</div>;
  }

  // Explicit Mapping: ID -> Component + Persona Index
  // Ensure the Preview (Card) and Editor (Renderer) always match.
  const TEMPLATE_MAP = {
    // 1. Modern Professional (Alex) -> Standard clean layout
    "ats-classic-1": { component: ATSClassicNew, personaIndex: 0 },

    // 2. Fresh Graduate (Priya) -> Bold Pink Header (Matches "New/Fresher" vibe)
    "ats-fresher": { component: BoldHeader, personaIndex: 5 },

    // 3. Executive Leadership (James) -> Two Column Serif (Matches "Executive" vibe)
    "ats-elite": { component: TwoColumnSplit, personaIndex: 4 },

    // 4. Academic CV (Michael) -> Modern Sidebar (Dense, organized)
    // Sidebar layout often used for CVs to separate skills/contact from heavy research text
    "academic-cv": { component: ModernSidebarNew, personaIndex: 2 },

    // 5. Creative Portfolio (Emma) -> Minimal Clean with Accents
    // "Creative Modern" component fits the "Creative Portfolio" ID best
    "creative-portfolio": { component: MinimalCleanNew, personaIndex: 3 },

    // NEW EXPANSION
    "ivy-league": { component: IvyLeague, personaIndex: 4 },
    "minimalist-mono": { component: MinimalistMono, personaIndex: 0 },
    "corporate-blue": { component: CorporateBlue, personaIndex: 1 }
  };

  // Fallback
  const selection = TEMPLATE_MAP[templateId] || TEMPLATE_MAP["ats-classic-1"];
  const TemplateComponent = selection.component;

  // We simply render the component with the passed data (which is either the user's data or persona data from the preview card)
  return <TemplateComponent data={resumeData} />;
}
