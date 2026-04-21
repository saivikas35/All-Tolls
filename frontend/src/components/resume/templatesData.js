import { resumePersonas } from './previewResumeData';

const templates = [
  // 1. SOFTWARE ENGINEER / TECHNICAL (The "Modern Professional")
  {
    id: "ats-classic-1",
    name: "Modern Professional",
    description: "Skills-first layout optimized for technical roles and scanners.",
    category: "modern",
    tags: ["dense", "technical", "skills-first"],
    atsScore: 98,
    isPopular: true,
    isNew: false,
    level: "professional",
    purpose: "software-engineer",
    purposeLabel: "Software Engineer / Technical",
    persona: resumePersonas.techEngineer
  },

  // 2. FRESH GRADUATE (The "Student Fresher")
  {
    id: "ats-fresher",
    name: "Fresh Graduate",
    description: "Education-first layout highlighting coursework and projects.",
    category: "ats",
    tags: ["academic", "projects", "education-first"],
    atsScore: 94,
    isPopular: true,
    isNew: true,
    level: "entry",
    purpose: "fresh-graduate",
    purposeLabel: "Fresh Graduate / Student",
    persona: resumePersonas.fresher
  },

  // 3. EXECUTIVE / MANAGER (The "Executive Leadership")
  {
    id: "ats-elite",
    name: "Executive Leadership",
    description: "Authoritative design focusing on leadership and business impact.",
    category: "classic",
    tags: ["serif", "executive", "summary-focused"],
    atsScore: 99,
    isPopular: false,
    isNew: true,
    level: "senior",
    purpose: "manager-executive",
    purposeLabel: "Manager / Executive",
    persona: resumePersonas.projectManager // Using PM persona for Executive layout
  },

  // 4. ACADEMIC / RESEARCH (The "Academic CV")
  {
    id: "academic-cv",
    name: "Academic CV",
    description: "Rigorous format for PhDs and researchers with publications.",
    category: "academic",
    tags: ["publications", "research", "detailed"],
    atsScore: 96,
    isPopular: false,
    isNew: true,
    level: "expert",
    purpose: "academic-research",
    purposeLabel: "Academic / Research",
    persona: resumePersonas.dataScientist // Scientist fits academic well
  },

  // 5. CREATIVE / DESIGNER (The "Creative Portfolio")
  {
    id: "creative-portfolio",
    name: "Creative Portfolio",
    description: "Visual grid layout showcasing projects and portfolio work.",
    category: "creative",
    tags: ["portfolio", "visual", "grid"],
    atsScore: 92, // Slightly lower due to columns, but acceptable for creatives
    isPopular: true,
    isNew: true,
    level: "professional",
    purpose: "creative-portfolio",
    purposeLabel: "Creative / Designer",
    persona: resumePersonas.productDesigner
  },

  // 6. IVY LEAGUE (Classic Serif)
  {
    id: "ivy-league",
    name: "Ivy League",
    description: "Prestigious, conservative serif design used by top firms.",
    category: "classic",
    tags: ["finance", "law", "consulting", "serif"],
    atsScore: 99,
    isPopular: true,
    isNew: true,
    level: "expert",
    purpose: "finance-law",
    purposeLabel: "Finance / Consulting",
    persona: resumePersonas.projectManager // PM fits corporate
  },

  // 7. MINIMALIST MONO (Tech)
  {
    id: "minimalist-mono",
    name: "Minimalist Mono",
    description: "Brutalist code-inspired layout for developers.",
    category: "modern",
    tags: ["developer", "tech", "code", "startup"],
    atsScore: 95,
    isPopular: false,
    isNew: true,
    level: "entry",
    purpose: "software-engineer",
    purposeLabel: "Developer / Hacker",
    persona: resumePersonas.techEngineer
  },

  // 8. CORPORATE BLUE (Standard)
  {
    id: "corporate-blue",
    name: "Corporate Blue",
    description: "Safe, standard professional layout for any industry.",
    category: "classic",
    tags: ["corporate", "safe", "admin", "business"],
    atsScore: 98,
    isPopular: false,
    isNew: true,
    level: "professional",
    purpose: "general-business",
    purposeLabel: "General Business",
    persona: resumePersonas.marketingPro
  }
];

export default templates;
