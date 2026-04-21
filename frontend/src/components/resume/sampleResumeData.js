const sampleResumeData = {
  basics: {
    name: "Alex Morgan",
    title: "Software Engineer",
    email: "alex.morgan@example.com",
    phone: "+1 555 234 7890",
    location: "San Francisco, CA",
    summary:
      "Results-driven software engineer with experience building scalable, ATS-friendly applications."
  },

  skills: {
    technical: [
      "JavaScript",
      "React",
      "Next.js",
      "Node.js",
      "HTML",
      "CSS"
    ],
    tools: [
      "Git",
      "Docker",
      "Postman",
      "VS Code"
    ]
  },

  experience: [
    {
      role: "Software Engineer",
      company: "NovaTech Solutions",
      start: "2022",
      end: "Present",
      points: [
        "Built reusable UI components using React",
        "Improved API performance by 30%",
        "Collaborated with cross-functional teams"
      ]
    }
  ],

  education: [
    {
      degree: "B.Tech in Computer Science",
      institution: "Westbridge University",
      year: "2021"
    }
  ],

  projects: [
    {
      name: "AI Resume Builder",
      tech: ["React", "Next.js", "Tailwind"],
      description:
        "Developed a resume builder with ATS-friendly templates and live preview."
    }
  ],

  /* ✅ ONLY NEW ADDITION */
  sectionsEnabled: {
    summary: true,
    skills: true,
    experience: true,
    education: true,
    projects: true,
    certifications: false,
    languages: false,
    awards: false
  }
};

export default sampleResumeData;
