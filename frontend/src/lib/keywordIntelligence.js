/**
 * Keyword Intelligence System for ATS Optimization
 */

// Role-based keyword database
const ROLE_KEYWORDS = {
    'software-engineer': {
        technical: ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'Git', 'AWS', 'Docker', 'API', 'Agile', 'CI/CD'],
        soft: ['problem solving', 'collaboration', 'communication', 'teamwork', 'code review'],
        tools: ['GitHub', 'Jira', 'VS Code', 'Jenkins', 'Kubernetes']
    },
    'data-scientist': {
        technical: ['Python', 'R', 'SQL', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Statistics', 'A/B Testing'],
        soft: ['analytical thinking', 'communication', 'problem solving', 'business acumen'],
        tools: ['Jupyter', 'Tableau', 'Power BI', 'Spark', 'Hadoop']
    },
    'product-manager': {
        technical: ['Product Strategy', 'Roadmap', 'User Research', 'Analytics', 'SQL', 'A/B Testing', 'Metrics', 'KPIs'],
        soft: ['leadership', 'communication', 'stakeholder management', 'prioritization', 'collaboration'],
        tools: ['Jira', 'Confluence', 'Figma', 'Google Analytics', 'Mixpanel']
    },
    'marketing-manager': {
        technical: ['Digital Marketing', 'SEO', 'SEM', 'Content Strategy', 'Social Media', 'Email Marketing', 'Analytics', 'ROI'],
        soft: ['creativity', 'communication', 'analytical thinking', 'project management'],
        tools: ['Google Analytics', 'HubSpot', 'Mailchimp', 'Adobe Creative Suite', 'Hootsuite']
    },
    'frontend-developer': {
        technical: ['JavaScript', 'React', 'HTML', 'CSS', 'TypeScript', 'Responsive Design', 'Accessibility', 'Performance'],
        soft: ['attention to detail', 'collaboration', 'problem solving', 'user-centric design'],
        tools: ['Git', 'Webpack', 'npm', 'Figma', 'Chrome DevTools']
    },
    'backend-developer': {
        technical: ['Node.js', 'Python', 'Java', 'SQL', 'REST API', 'Microservices', 'Database Design', 'Security', 'Scalability'],
        soft: ['problem solving', 'collaboration', 'system thinking', 'attention to detail'],
        tools: ['Docker', 'Kubernetes', 'AWS', 'PostgreSQL', 'Redis']
    }
};

/**
 * Extract keywords from job description text
 */
export function extractKeywordsFromJobDescription(jobDescription) {
    if (!jobDescription || typeof jobDescription !== 'string') {
        return { technical: [], soft: [], tools: [] };
    }

    const lowerDesc = jobDescription.toLowerCase();
    const keywords = { technical: [], soft: [], tools: [] };

    // Common technical keywords to look for
    const techKeywords = [
        'javascript', 'python', 'java', 'react', 'node.js', 'sql', 'aws', 'docker',
        'machine learning', 'data analysis', 'api', 'agile', 'scrum', 'git',
        'kubernetes', 'tensorflow', 'analytics', 'seo', 'marketing', 'design'
    ];

    techKeywords.forEach(keyword => {
        if (lowerDesc.includes(keyword)) {
            keywords.technical.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
        }
    });

    return keywords;
}

/**
 * Get expected keywords for a role
 */
export function getExpectedKeywords(roleKey) {
    return ROLE_KEYWORDS[roleKey] || { technical: [], soft: [], tools: [] };
}

/**
 * Extract keywords from resume
 */
export function extractKeywordsFromResume(resumeData) {
    const keywords = new Set();
    if (!resumeData) return [];

    // From skills
    resumeData.skills?.forEach(skillGroup => {
        skillGroup.items?.forEach(skill => keywords.add(skill.toLowerCase()));
    });

    // From experience bullets
    resumeData.experience?.forEach(job => {
        job.points?.forEach(point => {
            // Extract technical terms (simplified - could be enhanced with NLP)
            const techTerms = point.match(/\b[A-Z][a-z]+(?:[A-Z][a-z]+)*\b/g) || [];
            techTerms.forEach(term => keywords.add(term.toLowerCase()));
        });
    });

    return Array.from(keywords);
}

/**
 * Compare resume keywords vs expected keywords
 */
export function compareKeywords(resumeData, roleKey, jobDescription = null) {
    const resumeKeywords = extractKeywordsFromResume(resumeData);

    // Get expected keywords from role or job description
    let expectedKeywords = getExpectedKeywords(roleKey);

    if (jobDescription) {
        const extractedKeywords = extractKeywordsFromJobDescription(jobDescription);
        expectedKeywords = {
            technical: [...new Set([...expectedKeywords.technical, ...extractedKeywords.technical])],
            soft: expectedKeywords.soft,
            tools: expectedKeywords.tools
        };
    }

    // Flatten expected keywords
    const allExpectedKeywords = [
        ...expectedKeywords.technical,
        ...expectedKeywords.soft,
        ...expectedKeywords.tools
    ].map(k => k.toLowerCase());

    // Find matches and misses
    const matched = [];
    const missing = [];
    const overused = [];

    allExpectedKeywords.forEach(keyword => {
        const keywordCount = resumeKeywords.filter(rk => rk.includes(keyword)).length;

        if (keywordCount > 0) {
            matched.push({ keyword, count: keywordCount });
            if (keywordCount > 3) {
                overused.push({ keyword, count: keywordCount });
            }
        } else {
            missing.push(keyword);
        }
    });

    // Calculate match percentage
    const matchPercentage = allExpectedKeywords.length > 0
        ? Math.round((matched.length / allExpectedKeywords.length) * 100)
        : 0;

    return {
        matched,
        missing: missing.map(k => k.charAt(0).toUpperCase() + k.slice(1)),
        overused,
        matchPercentage,
        totalExpected: allExpectedKeywords.length,
        totalMatched: matched.length
    };
}

/**
 * Analyze keyword placement in resume
 */
export function analyzeKeywordPlacement(resumeData, keywords) {
    const placement = {
        inSkills: 0,
        inExperience: 0,
        inSummary: 0,
        missingFromSkills: []
    };

    keywords.forEach(keyword => {
        const keywordLower = keyword.toLowerCase();

        // Check in skills
        const inSkills = resumeData.skills?.some(sg =>
            sg.items?.some(item => item.toLowerCase().includes(keywordLower))
        );
        if (inSkills) placement.inSkills++;
        else placement.missingFromSkills.push(keyword);

        // Check in experience
        const inExperience = resumeData.experience?.some(job =>
            job.points?.some(point => point.toLowerCase().includes(keywordLower))
        );
        if (inExperience) placement.inExperience++;

        // Check in summary
        if (resumeData.summary?.toLowerCase().includes(keywordLower)) {
            placement.inSummary++;
        }
    });

    return placement;
}

/**
 * Generate keyword suggestions
 */
export function generateKeywordSuggestions(missing, resumeData) {
    const suggestions = [];

    missing.slice(0, 5).forEach(keyword => {
        // Check where to add
        const category = categorizeKeyword(keyword);

        suggestions.push({
            keyword,
            action: 'add',
            section: category === 'skill' ? 'Skills' : 'Experience',
            suggestion: category === 'skill'
                ? `Add "${keyword}" to your Skills section`
                : `Mention "${keyword}" in your experience bullets`
        });
    });

    return suggestions;
}

/**
 * Categorize keyword type
 */
function categorizeKeyword(keyword) {
    const techTerms = ['javascript', 'python', 'java', 'react', 'sql', 'aws', 'docker'];
    const softTerms = ['leadership', 'communication', 'collaboration', 'teamwork'];

    const keywordLower = keyword.toLowerCase();

    if (techTerms.some(term => keywordLower.includes(term))) return 'skill';
    if (softTerms.some(term => keywordLower.includes(term))) return 'soft';
    return 'skill'; // Default
}
