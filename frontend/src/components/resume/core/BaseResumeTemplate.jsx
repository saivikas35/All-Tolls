import Header from "../blocks/Header";
import Experience from "../blocks/Experience";
import Education from "../blocks/Education";
import Skills from "../blocks/Skills";
import Projects from "../blocks/Projects";

export default function BaseResumeTemplate({ data, variant = {} }) {
  const {
    layout = "single",
    spacing = "normal",
    header = "left",
    sectionStyle = "minimal",
    colorScheme = "black",
    font = "Inter"
  } = variant;

  // Color scheme definitions - Enhanced for better visual distinction
  const colorSchemes = {
    black: {
      primary: "#000000",
      accent: "#374151",
      bg: "#ffffff",
      text: "#000000",
      border: "#d1d5db"
    },
    blue: {
      primary: "#1d4ed8",
      accent: "#2563eb",
      bg: "#dbeafe",
      text: "#1e40af",
      border: "#3b82f6"
    },
    gray: {
      primary: "#1f2937",
      accent: "#4b5563",
      bg: "#e5e7eb",
      text: "#111827",
      border: "#6b7280"
    },
    purple: {
      primary: "#6b21a8",
      accent: "#7c3aed",
      bg: "#e9d5ff",
      text: "#581c87",
      border: "#8b5cf6"
    },
    teal: {
      primary: "#0f766e",
      accent: "#14b8a6",
      bg: "#ccfbf1",
      text: "#115e59",
      border: "#14b8a6"
    },
    green: {
      primary: "#047857",
      accent: "#10b981",
      bg: "#d1fae5",
      text: "#065f46",
      border: "#10b981"
    },
    burgundy: {
      primary: "#881337",
      accent: "#be123c",
      bg: "#fecdd3",
      text: "#881337",
      border: "#be123c"
    }
  };

  const colors = colorSchemes[colorScheme] || colorSchemes.black;

  // Font family mapping
  const fontFamilies = {
    "Inter": "Inter, sans-serif",
    "Poppins": "Poppins, sans-serif",
    "Roboto": "Roboto, sans-serif",
    "Merriweather": "Merriweather, serif",
    "Roboto Mono": "Roboto Mono, monospace",
    "Fira Code": "Fira Code, monospace",
    "Source Code Pro": "Source Code Pro, monospace",
    "Times New Roman": "Times New Roman, serif",
    "Georgia": "Georgia, serif",
    "Lato": "Lato, sans-serif",
    "Open Sans": "Open Sans, sans-serif",
    "Montserrat": "Montserrat, sans-serif",
    "Nunito": "Nunito, sans-serif",
    "Work Sans": "Work Sans, sans-serif"
  };

  const pageClasses = `
    mx-auto
    ${layout === "two-column" ? "grid grid-cols-3 gap-6" : "block"}
    ${spacing === "compact" ? "p-6" : "p-10"}
  `;

  const pageStyles = {
    backgroundColor: colors.bg,
    color: colors.text,
    fontFamily: fontFamilies[font] || fontFamilies["Inter"],
    maxWidth: "820px",
    borderLeft: colorScheme !== "black" ? `6px solid ${colors.primary}` : "none",
    borderTop: colorScheme !== "black" ? `2px solid ${colors.border}` : "none"
  };

  return (
    <div className={pageClasses} style={pageStyles}>
      {/* DEBUG: Show which variant is being used */}
      <div style={{
        backgroundColor: colors.primary,
        color: 'white',
        padding: '4px 8px',
        fontSize: '10px',
        marginBottom: '8px',
        borderRadius: '4px'
      }}>
        ID: {variant.id} | Color: {colorScheme} | Font: {font}
      </div>

      {/* HEADER */}
      <div
        className={layout === "two-column" ? "col-span-3" : ""}
        style={{
          borderBottom: header === "boxed" ? "none" : `2px solid ${colors.border}`,
          paddingBottom: "1rem",
          marginBottom: "1rem"
        }}
      >
        <Header data={data.header} variant={header} colors={colors} />
      </div>

      {/* MAIN COLUMN */}
      <div className={layout === "two-column" ? "col-span-2" : ""}>
        {data.experience?.length > 0 && (
          <Experience
            data={data.experience}
            variant={sectionStyle}
            colors={colors}
          />
        )}

        {data.projects?.length > 0 && (
          <Projects
            data={data.projects}
            variant={sectionStyle}
            colors={colors}
          />
        )}
      </div>

      {/* SIDE COLUMN */}
      <div className={layout === "two-column" ? "bg-gray-50 p-4 rounded" : ""}>
        {data.skills?.length > 0 && (
          <Skills
            data={data.skills}
            variant={sectionStyle}
            colors={colors}
          />
        )}

        {data.education?.length > 0 && (
          <Education
            data={data.education}
            variant={sectionStyle}
            colors={colors}
          />
        )}
      </div>
    </div>
  );
}

