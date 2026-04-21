export default function Experience({ data = [], variant = "minimal", colors = {} }) {
  if (!data.length) return null;

  const sectionStyles = {
    minimal: "mt-6",
    line: "mt-6 border-t pt-4",
    card: "mt-6 bg-gray-50 p-4 rounded-lg",
    highlight: "mt-6 border-l-4 border-black pl-4"
  };

  return (
    <section className={sectionStyles[variant]} style={{ borderColor: colors.primary }}>
      <h2 className="text-sm font-bold uppercase mb-3" style={{ color: colors.primary }}>
        Experience
      </h2>

      {data.map((item, idx) => (
        <div key={idx} className="mb-4">
          <div className="flex justify-between">
            <p className="font-semibold text-sm">
              {item.role}
            </p>
            <p className="text-xs text-gray-500">
              {item.duration}
            </p>
          </div>

          <p className="italic text-xs">
            {item.company}
          </p>

          <ul className="list-disc ml-4 mt-1 text-xs">
            {item.points?.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
