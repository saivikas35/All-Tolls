export default function Skills({ data = [], variant = "minimal", colors = {} }) {
  if (!data || data.length === 0) return null;

  const styles = {
    minimal: "mt-6",
    soft: "mt-6 bg-gray-50 p-3 rounded",
    card: "mt-6 border p-4 rounded-lg",
    line: "mt-6 border-b pb-4",
    highlight: "mt-6 border-l-4 border-black pl-4"
  };

  // Check if data is categorized (array of objects with category/items)
  const isCategorized = data[0]?.category !== undefined;

  return (
    <section className={styles[variant] || styles.minimal} style={{ borderColor: colors.primary }}>
      <h2 className="text-sm font-bold uppercase mb-3" style={{ color: colors.primary }}>
        Skills
      </h2>

      {isCategorized ? (
        // Categorized skills format
        <div className="space-y-3">
          {data.map((skillGroup, i) => (
            <div key={i}>
              <h3 className="text-xs font-semibold mb-1">
                {skillGroup.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillGroup.items.map((skill, j) => (
                  <span
                    key={j}
                    className="text-xs border px-2 py-1 rounded bg-white"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Flat skills format (backward compatibility)
        <div className="flex flex-wrap gap-2">
          {data.map((skill, i) => (
            <span
              key={i}
              className="text-xs border px-2 py-1 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
