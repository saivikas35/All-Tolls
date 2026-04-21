export default function Header({ data, variant = "left", colors = {} }) {
  if (!data) return null;

  const {
    primary = "#000000",
    text = "#000000"
  } = colors;

  const base = "mb-6";

  const variants = {
    left: `
      ${base}
      text-left
    `,
    center: `
      ${base}
      text-center
    `,
    boxed: `
      ${base}
      text-left
      border p-4 rounded-lg
    `
  };

  return (
    <header
      className={variants[variant]}
      style={{ borderColor: colors.border }}
    >
      <h1
        className="text-2xl font-bold tracking-wide"
        style={{ color: primary }}
      >
        {data.name}
      </h1>

      <p
        className="text-sm font-medium mt-1"
        style={{ color: text }}
      >
        {data.title}
      </p>

      <p className="text-xs mt-1" style={{ color: colors.accent }}>
        {data.email} • {data.phone} • {data.location}
      </p>
    </header>
  );
}

