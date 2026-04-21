/**
 * Smart Resume Defaults
 * Auto-detect experience level and optimize resume accordingly
 */

/**
 * Detect experience level from resume data
 */
export function detectExperienceLevel(resumeData) {
    const experience = resumeData.experience || [];
    const education = resumeData.education || [];
    const publications = resumeData.publications || [];

    // Calculate years of experience
    let totalYears = 0;
    experience.forEach(job => {
        const startYear = parseInt(job.start) || 0;
        const endYear = job.end === 'Present' ? new Date().getFullYear() : parseInt(job.end) || 0;
        if (startYear && endYear) {
            totalYears += (endYear - startYear);
        }
    });

    // Determine level
    if (publications.length >= 3) {
        return 'academic'; // Research/Academic background
    } else if (totalYears === 0 && education.length > 0) {
        return 'fresher'; // Fresh graduate
    } else if (totalYears < 3) {
        return 'junior'; // Early career
    } else if (totalYears >= 7 || resumeData.header?.title?.toLowerCase().includes('manager')) {
        return 'manager'; // Senior/Manager level
    } else {
        return 'professional'; // Mid-level professional
    }
}

/**
 * Get smart defaults for resume based on experience level
 */
export function getSmartDefaults(experienceLevel) {
    const defaults = {
        fresher: {
            name: 'Fresh Graduate / Entry Level',
            sectionOrder: ['summary', 'education', 'projects', 'skills', 'experience', 'certifications', 'languages'],
            emphasisSections: ['education', 'projects', 'skills'],
            summaryGuidance: 'Focus on education, academic projects, and eagerness to learn',
            fontFamily: 'modern', // Clean, modern look
            fontSize: 'default',
            lineSpacing: 'normal'
        },
        junior: {
            name: 'Junior Professional (0-3 years)',
            sectionOrder: ['summary', 'experience', 'skills', 'education', 'projects', 'certifications'],
            emphasisSections: ['experience', 'skills'],
            summaryGuidance: 'Highlight recent experience and growing expertise',
            fontFamily: 'sans',
            fontSize: 'default',
            lineSpacing: 'normal'
        },
        professional: {
            name: 'Mid-Level Professional (3-7 years)',
            sectionOrder: ['summary', 'experience', 'skills', 'education', 'projects', 'certifications'],
            emphasisSections: ['experience', 'skills'],
            summaryGuidance: 'Emphasize achievements, impact, and expertise',
            fontFamily: 'sans',
            fontSize: 'default',
            lineSpacing: 'normal'
        },
        manager: {
            name: 'Senior / Manager Level (7+ years)',
            sectionOrder: ['summary', 'experience', 'skills', 'education', 'certifications'],
            emphasisSections: ['summary', 'experience'],
            summaryGuidance: 'Focus on leadership, strategic impact, and team achievements',
            fontFamily: 'serif', // More executive look
            fontSize: 'default',
            lineSpacing: 'relaxed'
        },
        academic: {
            name: 'Academic / Research',
            sectionOrder: ['summary', 'education', 'publications', 'research', 'teaching', 'experience', 'skills'],
            emphasisSections: ['education', 'publications', 'research'],
            summaryGuidance: 'Highlight research contributions and academic credentials',
            fontFamily: 'serif', // Traditional academic style
            fontSize: 'default',
            lineSpacing: 'relaxed'
        }
    };

    return defaults[experienceLevel] || defaults.professional;
}

/**
 * Generate optimized resume configuration
 */
export function generateOptimizedConfig(resumeData) {
    const level = detectExperienceLevel(resumeData);
    const defaults = getSmartDefaults(level);

    return {
        experienceLevel: level,
        levelName: defaults.name,
        sectionOrder: defaults.sectionOrder,
        emphasisSections: defaults.emphasisSections,
        styling: {
            fontFamily: defaults.fontFamily,
            fontSize: defaults.fontSize,
            lineSpacing: defaults.lineSpacing
        },
        guidance: {
            summary: defaults.summaryGuidance
        }
    };
}

/**
 * Check if user should see certain sections prominently
 */
export function shouldEmphasizeSection(sectionId, experienceLevel) {
    const defaults = getSmartDefaults(experienceLevel);
    return defaults.emphasisSections.includes(sectionId);
}
