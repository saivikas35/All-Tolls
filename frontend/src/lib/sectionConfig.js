// Section configuration utilities for resume customization

export const AVAILABLE_SECTIONS = [
    { id: 'summary', name: 'Professional Summary', required: false },
    { id: 'experience', name: 'Work Experience', required: true },
    { id: 'education', name: 'Education', required: true },
    { id: 'skills', name: 'Skills', required: true },
    { id: 'projects', name: 'Projects', required: false },
    { id: 'certifications', name: 'Certifications', required: false },
    { id: 'publications', name: 'Publications', required: false },
    { id: 'internships', name: 'Internships', required: false },
    { id: 'languages', name: 'Languages', required: false },
    { id: 'awards', name: 'Awards & Honors', required: false }
];

// Default section configuration
export const DEFAULT_SECTION_CONFIG = [
    { id: 'summary', enabled: true, order: 0 },
    { id: 'experience', enabled: true, order: 1 },
    { id: 'education', enabled: true, order: 2 },
    { id: 'skills', enabled: true, order: 3 },
    { id: 'projects', enabled: false, order: 4 },
    { id: 'certifications', enabled: false, order: 5 },
    { id: 'publications', enabled: false, order: 6 },
    { id: 'internships', enabled: false, order: 7 },
    { id: 'languages', enabled: false, order: 8 },
    { id: 'awards', enabled: false, order: 9 }
];

/**
 * Get ordered and enabled sections
 * @param {Array} sectionConfig - Section configuration array
 * @returns {Array} - Enabled sections sorted by order
 */
export function getEnabledSections(sectionConfig = DEFAULT_SECTION_CONFIG) {
    return sectionConfig
        .filter(section => section.enabled)
        .sort((a, b) => a.order - b.order);
}

/**
 * Toggle section visibility
 * @param {Array} sectionConfig - Current section configuration
 * @param {string} sectionId - Section ID to toggle
 * @returns {Array} - Updated section configuration
 */
export function toggleSection(sectionConfig, sectionId) {
    return sectionConfig.map(section =>
        section.id === sectionId
            ? { ...section, enabled: !section.enabled }
            : section
    );
}

/**
 * Move section up in order
 * @param {Array} sectionConfig - Current section configuration
 * @param {string} sectionId - Section ID to move
 * @returns {Array} - Updated section configuration
 */
export function moveSectionUp(sectionConfig, sectionId) {
    const index = sectionConfig.findIndex(s => s.id === sectionId);
    if (index <= 0) return sectionConfig;

    const newConfig = [...sectionConfig];
    [newConfig[index - 1], newConfig[index]] = [newConfig[index], newConfig[index - 1]];

    // Update order values
    return newConfig.map((section, i) => ({ ...section, order: i }));
}

/**
 * Move section down in order
 * @param {Array} sectionConfig - Current section configuration
 * @param {string} sectionId - Section ID to move
 * @returns {Array} - Updated section configuration
 */
export function moveSectionDown(sectionConfig, sectionId) {
    const index = sectionConfig.findIndex(s => s.id === sectionId);
    if (index < 0 || index >= sectionConfig.length - 1) return sectionConfig;

    const newConfig = [...sectionConfig];
    [newConfig[index], newConfig[index + 1]] = [newConfig[index + 1], newConfig[index]];

    // Update order values
    return newConfig.map((section, i) => ({ ...section, order: i }));
}

/**
 * Get section data from resume data
 * @param {Object} resumeData - Full resume data object
 * @param {string} sectionId - Section ID to retrieve
 * @returns {any} - Section data
 */
export function getSectionData(resumeData, sectionId) {
    const sectionMap = {
        summary: resumeData.summary,
        experience: resumeData.experience,
        education: resumeData.education,
        skills: resumeData.skills,
        projects: resumeData.projects,
        certifications: resumeData.certifications,
        publications: resumeData.publications,
        internships: resumeData.internships,
        languages: resumeData.languages,
        awards: resumeData.awards
    };

    return sectionMap[sectionId];
}

/**
 * Check if section has data
 * @param {any} sectionData - Section data to check
 * @returns {boolean} - True if section has data
 */
export function hasSectionData(sectionData) {
    if (!sectionData) return false;
    if (Array.isArray(sectionData)) return sectionData.length > 0;
    if (typeof sectionData === 'string') return sectionData.trim().length > 0;
    if (typeof sectionData === 'object') return Object.keys(sectionData).length > 0;
    return false;
}
