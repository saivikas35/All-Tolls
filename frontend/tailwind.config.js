export default {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/lib/**/*.{js,ts}",
    "./src/pages/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 10px 25px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
