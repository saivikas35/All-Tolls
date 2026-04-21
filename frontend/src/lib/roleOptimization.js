/**
 * Role-based resume optimization
 * Automatically adjusts resume based on target role
 */

// Role configurations with optimal section order and action verbs
export const ROLE_CONFIGS = {
    'software-engineer': {
        name: 'Software Engineer',
        sectionOrder: ['summary', 'experience', 'skills', 'projects', 'education', 'certifications'],
        actionVerbs: [
            'architected', 'developed', 'implemented', 'optimized', 'automated',
            'designed', 'built', 'deployed', 'refactored', 'scaled', 'debugged',
            'integrated', 'migrated', 'engineered', 'programmed'
        ],
        keywords: ['agile', 'git', 'code review', 'testing', 'CI/CD', 'REST API', 'microservices', 'cloud'],
        summaryTemplate: 'Software Engineer with {X} years of experience building scalable applications. Expertise in {skill1}, {skill2}, and {skill3}. Passionate about clean code and solving complex technical challenges.'
    },
    'data-scientist': {
        name: 'Data Scientist',
        sectionOrder: ['summary', 'experience', 'skills', 'projects', 'education', 'publications'],
        actionVerbs: [
            'analyzed', 'modeled', 'predicted', 'visualized', 'trained', 'optimized',
            'discovered', 'identified', 'evaluated', 'researched', 'experimented',
            'derived', 'quantified', 'interpreted', 'validated'
        ],
        keywords: ['machine learning', 'statistical analysis', 'python', 'SQL', 'A/B testing', 'data visualization', 'predictive modeling'],
        summaryTemplate: 'Data Scientist with {X} years turning data into actionable insights. Skilled in {skill1}, {skill2}, and statistical modeling. Track record of driving business decisions through advanced analytics.'
    },
    'product-manager': {
        name: 'Product Manager',
        sectionOrder: ['summary', 'experience', 'skills', 'education', 'certifications'],
        actionVerbs: [
            'launched', 'defined', 'prioritized', 'strategized', 'coordinated', 'drove',
            'aligned', 'partnered', 'influenced', 'delivered', 'owned', 'advocated',
            'validated', 'iterated', 'roadmapped', 'shipped'
        ],
        keywords: ['product strategy', 'roadmap', 'stakeholders', 'user research', 'metrics', 'agile', 'KPIs', 'cross-functional'],
        summaryTemplate: 'Product Manager with {X} years delivering user-centric products. Expert in {skill1}, {skill2}, and cross-functional leadership. Proven ability to drive product vision from concept to launch.'
    },
    'marketing-manager': {
        name: 'Marketing Manager',
        sectionOrder: ['summary', 'experience', 'skills', 'education', 'certifications'],
        actionVerbs: [
            'increased', 'drove', 'grew', 'generated', 'optimized', 'launched',
            'developed', 'executed', 'managed', 'coordinated', 'analyzed', 'crafted',
            'amplified', 'converted', 'engaged', 'branded'
        ],
        keywords: ['ROI', 'digital marketing', 'social media', 'SEO', 'content strategy', 'analytics', 'brand awareness', 'lead generation'],
        summaryTemplate: 'Marketing Manager with {X} years driving growth through data-driven campaigns. Expertise in {skill1}, {skill2}, and brand strategy. Proven track record of increasing ROI and customer engagement.'
    },
    'frontend-developer': {
        name: 'Frontend Developer',
        sectionOrder: ['summary', 'experience', 'skills', 'projects', 'education'],
        actionVerbs: [
            'designed', 'developed', 'implemented', 'optimized', 'built', 'created',
            'enhanced', 'modernized', 'refactored', 'styled', 'animated', 'debugged',
            'integrated', 'collaborated', 'prototyped'
        ],
        keywords: ['React', 'JavaScript', 'responsive design', 'UI/UX', 'CSS', 'HTML', 'accessibility', 'performance'],
        summaryTemplate: 'Frontend Developer with {X} years crafting responsive, user-friendly interfaces. Proficient in {skill1}, {skill2}, and modern web technologies. Committed to pixel-perfect design and optimal user experience.'
    },
    'backend-developer': {
        name: 'Backend Developer',
        sectionOrder: ['summary', 'experience', 'skills', 'projects', 'education'],
        actionVerbs: [
            'architected', 'developed', 'implemented', 'optimized', 'designed', 'built',
            'scaled', 'secured', 'automated', 'deployed', 'integrated', 'maintained',
            'migrated', 'debugged', 'refactored'
        ],
        keywords: ['API', 'database', 'microservices', 'scalability', 'cloud', 'security', 'performance', 'architecture'],
        summaryTemplate: 'Backend Developer with {X} years building robust, scalable server-side applications. Expert in {skill1}, {skill2}, and system architecture. Focus on performance optimization and reliable infrastructure.'
    },
    'fresher': {
        name: 'Recent Graduate / Fresher',
        sectionOrder: ['summary', 'education', 'projects', 'skills', 'internships', 'certifications'],
        actionVerbs: [
            'learned', 'developed', 'created', 'built', 'collaborated', 'contributed',
            'implemented', 'designed', 'completed', 'achieved', 'studied', 'participated',
            'assisted', 'supported', 'researched'
        ],
        keywords: ['quick learner', 'team player', 'coursework', 'academic projects', 'internship', 'certifications'],
        summaryTemplate: 'Recent {degree} graduate with a passion for {field}. Skilled in {skill1}, {skill2}, and {skill3}. Eager to apply academic knowledge and contribute to innovative projects.'
    },
    'designer': {
        name: 'UI/UX Designer',
        sectionOrder: ['summary', 'experience', 'skills', 'projects', 'education'],
        actionVerbs: [
            'designed', 'created', 'prototyped', 'researched', 'collaborated', 'refined',
            'conceptualized', 'illustrated', 'crafted', 'iterated', 'tested', 'implemented',
            'enhanced', 'transformed', 'visualized'
        ],
        keywords: ['user research', 'wireframes', 'prototyping', 'Figma', 'usability testing', 'design systems', 'user-centered'],
        summaryTemplate: 'UI/UX Designer with {X} years creating intuitive, user-centered experiences. Proficient in {skill1}, {skill2}, and design thinking. Passionate about solving user problems through elegant design.'
    }
};

/**
 * Get role configuration by key
 */
export function getRoleConfig(roleKey) {
    return ROLE_CONFIGS[roleKey] || ROLE_CONFIGS['software-engineer'];
}

/**
 * Reorder resume sections based on role
 */
export function reorderSectionsByRole(sections, roleKey) {
    const config = getRoleConfig(roleKey);
    const order = config.sectionOrder;

    // Create a map of section priorities
    const priorityMap = {};
    order.forEach((sectionId, index) => {
        priorityMap[sectionId] = index;
    });

    // Sort sections based on priority
    return [...sections].sort((a, b) => {
        const priorityA = priorityMap[a.id] ?? 999;
        const priorityB = priorityMap[b.id] ?? 999;
        return priorityA - priorityB;
    });
}

/**
 * Get action verb suggestions for role
 */
export function getActionVerbSuggestions(roleKey) {
    const config = getRoleConfig(roleKey);
    return config.actionVerbs || [];
}

/**
 * Get keyword suggestions for role
 */
export function getKeywordSuggestions(roleKey) {
    const config = getRoleConfig(roleKey);
    return config.keywords || [];
}

/**
 * Generate summary template with placeholders
 */
export function getSummaryTemplate(roleKey, yearsOfExperience = 'X', topSkills = []) {
    const config = getRoleConfig(roleKey);
    let template = config.summaryTemplate;

    // Replace placeholders
    template = template.replace('{X}', yearsOfExperience);

    if (topSkills.length > 0) {
        template = template.replace('{skill1}', topSkills[0] || 'skill1');
        template = template.replace('{skill2}', topSkills[1] || 'skill2');
        template = template.replace('{skill3}', topSkills[2] || 'skill3');
        template = template.replace('{field}', topSkills[0] || 'technology');
        template = template.replace('{degree}', topSkills[0] || 'Computer Science');
    }

    return template;
}

/**
 * Highlight role-relevant keywords in text
 */
export function highlightRoleKeywords(text, roleKey) {
    const keywords = getKeywordSuggestions(roleKey);
    const lowerText = text.toLowerCase();

    const foundKeywords = keywords.filter(keyword =>
        lowerText.includes(keyword.toLowerCase())
    );

    return foundKeywords;
}

/**
 * Check if experience bullets use role-appropriate action verbs
 */
export function checkActionVerbs(experiencePoints, roleKey) {
    const suggestedVerbs = getActionVerbSuggestions(roleKey);
    const results = [];

    experiencePoints.forEach(point => {
        const lowerPoint = point.toLowerCase();
        const usesGoodVerb = suggestedVerbs.some(verb =>
            lowerPoint.startsWith(verb.toLowerCase())
        );

        results.push({
            text: point,
            usesGoodVerb,
            suggestedVerbs: usesGoodVerb ? [] : suggestedVerbs.slice(0, 3)
        });
    });

    return results;
}
