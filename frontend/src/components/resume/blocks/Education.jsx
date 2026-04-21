export default function Education({ data = [], variant = "minimal", colors = {} }) {
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
        Education
      </h2>

      {data.map((edu, idx) => (
        <div key={idx} className="mb-3">
          <p className="font-semibold text-sm">
            {edu.degree}
          </p>

          <p className="text-xs italic">
            {edu.institution}
          </p>

          <p className="text-xs text-gray-600">
            {edu.year}
          </p>
        </div>
      ))}
    </section>
  );
}
