export const templateSchemas = {
  "ats-classic": {
    basics: ["name", "title", "email", "phone", "location", "summary"],
    skills: {
      technical: "array",
      tools: "array"
    },
    experience: {
      fields: {
        role: "string",
        company: "string",
        start: "string",
        end: "string",
        points: "array"
      }
    },
    education: {
      fields: {
        degree: "string",
        institution: "string",
        year: "string"
      }
    }
  },

  professional: {
    skills: {
      technical: "array"
    },
    experience: {
      fields: {
        role: "string",
        company: "string",
        points: "array"
      }
    }
  },

  tech: {
    projects: {
      fields: {
        name: "string",
        tech: "array",
        description: "string"
      }
    }
  }
};
