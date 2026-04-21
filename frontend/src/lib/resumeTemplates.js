export const resumeTemplates = [
  {
    id: "ats_single_column",
    name: "ATS Single Column",
    category: "ATS Friendly",
    recommendedFor: ["freshers", "experienced"],
    columns: 1,
    font: "Inter",
    colorScheme: "black",
    sections: [
      "header",
      "summary",
      "skills",
      "experience",
      "education"
    ],
    atsScoreWeight: 95
  },

  {
    id: "modern_two_column",
    name: "Modern Two Column",
    category: "Modern",
    recommendedFor: ["tech", "design"],
    columns: 2,
    font: "Poppins",
    colorScheme: "blue",
    sections: [
      "header",
      "skills",
      "experience",
      "projects",
      "education"
    ],
    atsScoreWeight: 80
  },

  {
    id: "executive_minimal",
    name: "Executive Minimal",
    category: "Professional",
    recommendedFor: ["experienced", "manager"],
    columns: 1,
    font: "Merriweather",
    colorScheme: "gray",
    sections: [
      "header",
      "summary",
      "experience",
      "education"
    ],
    atsScoreWeight: 92
  },

  // 🔁 You can scale this to 100+ safely
];
