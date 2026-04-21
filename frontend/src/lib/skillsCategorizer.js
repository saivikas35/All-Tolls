/**
 * Smart Skills Categorizer and Optimizer
 */

// Skill categories with common skills
const SKILL_CATEGORIES = {
    languages: {
        name: 'Programming Languages',
        keywords: ['javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust', 'typescript', 'php', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl', 'shell', 'bash']
    },
    frameworks: {
        name: 'Frameworks & Libraries',
        keywords: ['react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel', '.net', 'next.js', 'nuxt', 'svelte', 'tensorflow', 'pytorch', 'keras', 'pandas', 'numpy']
    },
    tools: {
        name: 'Tools & Technologies',
        keywords: ['git', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins', 'ci/cd', 'jira', 'linux', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'graphql', 'rest api']
    },
    soft: {
        name: 'Soft Skills',
        keywords: ['leadership', 'communication', 'problem solving', 'teamwork', 'agile', 'scrum', 'project management', 'critical thinking', 'collaboration', 'time management']
    }
};

// Role-based skill suggestions
const ROLE_SKILLS = {
    'software engineer': ['JavaScript', 'Python', 'Git', 'Docker', 'REST API', 'SQL', 'Agile'],
    'data scientist': ['Python', 'R', 'TensorFlow', 'Pandas', 'SQL', 'Machine Learning', 'Statistics'],
    'product manager': ['Agile', 'Scrum', 'Jira', 'Product Strategy', 'User Research', 'SQL', 'Analytics'],
    'frontend developer': ['JavaScript', 'React', 'HTML/CSS', 'TypeScript', 'Git', 'Responsive Design'],
    'backend developer': ['Python', 'Node.js', 'SQL', 'REST API', 'Docker', 'Microservices'],
    'full stack developer': ['JavaScript', 'React', 'Node.js', 'SQL', 'Git', 'Docker', 'AWS'],
    'devops engineer': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Python', 'Terraform'],
    'marketing manager': ['SEO', 'Google Analytics', 'Social Media', 'Content Strategy', 'A/B Testing']
};

/**
 * Auto-categorize skills array
 * @param {Array} skills - Flat array of skill strings or array of {category, items}
 * @returns {Array} - Categorized skills [{category, items}]
 */
export function categorizeSkills(skills) {
    if (!skills || skills.length === 0) return [];

    // If already categorized, return as-is
    if (skills[0]?.category && skills[0]?.items) {
        return skills;
    }

    // Flatten if needed
    const flatSkills = Array.isArray(skills) ? skills : [];

    const categorized = {
        languages: [],
        frameworks: [],
        tools: [],
        soft: [],
        other: []
    };

    flatSkills.forEach(skill => {
        const skillLower = skill.toLowerCase();
        let categorized_flag = false;

        for (const [category, config] of Object.entries(SKILL_CATEGORIES)) {
            if (config.keywords.some(keyword => skillLower.includes(keyword))) {
                categorized[category].push(skill);
                categorized_flag = true;
                break;
            }
        }

        if (!categorized_flag) {
            categorized.other.push(skill);
        }
    });

    // Build result array
    const result = [];

    if (categorized.languages.length > 0) {
        result.push({ category: 'Programming Languages', items: categorized.languages });
    }
    if (categorized.frameworks.length > 0) {
        result.push({ category: 'Frameworks & Libraries', items: categorized.frameworks });
    }
    if (categorized.tools.length > 0) {
        result.push({ category: 'Tools & Technologies', items: categorized.tools });
    }
    if (categorized.soft.length > 0) {
        result.push({ category: 'Soft Skills', items: categorized.soft });
    }
    if (categorized.other.length > 0) {
        result.push({ category: 'Other Skills', items: categorized.other });
    }

    return result;
}

/**
 * Optimize skills to prevent keyword stuffing
 * @param {Array} categorizedSkills - Array of {category, items}
 * @param {number} maxPerCategory - Max skills per category
 * @returns {Array} - Optimized skills
 */
export function optimizeSkills(categorizedSkills, maxPerCategory = 8) {
    return categorizedSkills.map(skillGroup => ({
        category: skillGroup.category,
        items: skillGroup.items.slice(0, maxPerCategory)
    }));
}

/**
 * Suggest missing skills based on job role
 * @param {Array} currentSkills - Current skills array
 * @param {string} jobRole - Target job role
 * @returns {Array} - Suggested skills to add
 */
export function suggestSkills(currentSkills, jobRole) {
    if (!jobRole) return [];

    const roleLower = jobRole.toLowerCase();
    let suggestedSkills = [];

    // Find matching role
    for (const [role, skills] of Object.entries(ROLE_SKILLS)) {
        if (roleLower.includes(role)) {
            suggestedSkills = skills;
            break;
        }
    }

    if (suggestedSkills.length === 0) return [];

    // Filter out skills user already has
    const currentSkillsLower = currentSkills.flat().map(s =>
        typeof s === 'string' ? s.toLowerCase() : s.items?.map(i => i.toLowerCase())
    ).flat();

    const missing = suggestedSkills.filter(skill =>
        !currentSkillsLower.some(current => current?.includes(skill.toLowerCase()))
    );

    return missing.slice(0, 5); // Return top 5 missing skills
}

/**
 * Check if skills section has keyword stuffing
 * @param {Array} skills - Skills array
 * @returns {Object} - {isStuffed, totalCount, recommendation}
 */
export function checkKeywordStuffing(skills) {
    const totalCount = skills.reduce((acc, sg) => {
        return acc + (sg.items?.length || 0);
    }, 0);

    const isStuffed = totalCount > 25;
    const isTooFew = totalCount < 5;

    return {
        isStuffed,
        isTooFew,
        totalCount,
        recommendation: isStuffed
            ? 'Consider removing less relevant skills (aim for 15-20)'
            : isTooFew
                ? 'Add more relevant skills for better ATS matching (aim for 10-15)'
                : 'Skill count looks good!'
    };
}
