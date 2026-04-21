export default function Projects({ data = [], variant = "minimal", colors = {} }) {
  if (!data.length) return null;

  const styles = {
    minimal: "mt-6",
    line: "mt-6 border-t pt-4",
    card: "mt-6 bg-gray-50 p-4 rounded-lg",
    highlight: "mt-6 border-l-4 border-black pl-4"
  };

  return (
    <section className={styles[variant]} style={{ borderColor: colors.primary }}>
      <h2 className="text-sm font-bold uppercase mb-3" style={{ color: colors.primary }}>
        Projects
      </h2>

      {data.map((project, idx) => (
        <div key={idx} className="mb-4">
          <p className="font-semibold text-sm">
            {project.title}
          </p>

          {project.tech && (
            <p className="text-xs italic text-gray-600">
              {project.tech.join(" • ")}
            </p>
          )}

          <p className="text-xs mt-1">
            {project.description}
          </p>
        </div>
      ))}
    </section>
  );
}
