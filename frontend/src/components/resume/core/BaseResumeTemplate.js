import Header from "../blocks/Header";
import Experience from "../blocks/Experience";
import Education from "../blocks/Education";
import Skills from "../blocks/Skills";
import Projects from "../blocks/Projects";

export default function BaseResumeTemplate({ data, variant }) {
  const {
    layout = "single",
    spacing = "normal",
    header = "left",
    sectionStyle = "minimal"
  } = variant || {};

  return (
    <div
      className={`
        bg-white text-black mx-auto
        ${layout === "two-column" ? "grid grid-cols-3 gap-6" : "block"}
        ${spacing === "compact" ? "p-6" : "p-10"}
      `}
      style={{ maxWidth: "820px" }}
    >
      {/* HEADER */}
      <div className={layout === "two-column" ? "col-span-3" : ""}>
        <Header data={data.header} variant={header} />
      </div>

      {/* LEFT / MAIN COLUMN */}
      <div className={layout === "two-column" ? "col-span-2" : ""}>
        {data.experience?.length > 0 && (
          <Experience data={data.experience} variant={sectionStyle} />
        )}

        {data.projects?.length > 0 && (
          <Projects data={data.projects} variant={sectionStyle} />
        )}
      </div>

      {/* RIGHT / SIDE COLUMN */}
      <div>
        {data.skills?.length > 0 && (
          <Skills data={data.skills} variant={sectionStyle} />
        )}

        {data.education?.length > 0 && (
          <Education data={data.education} variant={sectionStyle} />
        )}
      </div>
    </div>
  );
}
