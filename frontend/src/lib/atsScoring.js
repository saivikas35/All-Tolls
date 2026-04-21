/**
 * Transparent ATS Scoring Engine
 * Real-time, dynamic scoring with detailed explanations
 */

const STRONG_ACTION_VERBS = [
    'achieved', 'improved', 'increased', 'reduced', 'generated', 'developed',
    'created', 'designed', 'implemented', 'launched', 'managed', 'led',
    'optimized', 'streamlined', 'automated', 'architected', 'built', 'drove',
    'executed', 'delivered', 'spearheaded', 'transformed', 'accelerated',
    'established', 'pioneered', 'orchestrated', 'elevated', 'modernized'
];

const WEAK_VERBS = ['worked on', 'helped with', 'responsible for', 'assisted', 'participated'];

/**
 * STRICT ATS FORMATTING VALIDATION RULES
 */
const ATS_RULES = {
    noTables: {
        name: 'No Tables for Core Content',
        reason: 'ATS systems cannot parse tables correctly - content may be lost or scrambled',
        severity: 'critical'
    },
    noIconsAsText: {
        name: 'No Icons Replacing Text',
        reason: 'Icons (✉, 📱) may not be recognized by ATS - use actual text labels',
        severity: 'warning'
    },
    singleColumn: {
        name: 'Single-Column Reading Order',
        reason: 'Multi-column layouts confuse ATS reading order - use linear top-to-bottom structure',
        severity: 'warning'
    },
    standardHeadings: {
        name: 'Standard Section Headings',
        reason: 'Use "Experience", "Education", "Skills" - not creative names like "My Journey"',
        severity: 'warning'
    },
    noHeaderFooter: {
        name: 'No Critical Info in Headers/Footers',
        reason: 'ATS often ignores headers/footers - keep contact info in main body',
        severity: 'critical'
    }
};

/**
 * Calculate comprehensive ATS score
 * @param {Object} resumeData - Full resume data
 * @param {Object} templateConfig - Template configuration
 * @returns {Object} - Score breakdown and warnings
 */
export function calculateATSScore(resumeData, templateConfig = {}) {
    if (!resumeData) {
        return {
            totalScore: 0,
            breakdown: {
                formatting: { score: 0, issues: [], warnings: [] },
                keywords: { score: 0, issues: [], warnings: [] },
                actionVerbs: { score: 0, issues: [], warnings: [] },
                completeness: { score: 0, issues: [], warnings: [] }
            },
            warnings: [],
            grade: 'F'
        };
    }

    const scores = {
        formatting: analyzeFormatting(resumeData, templateConfig),      // 30%
        keywords: analyzeKeywords(resumeData),                          // 30%
        actionVerbs: analyzeActionVerbs(resumeData),                    // 20%
        completeness: analyzeCompleteness(resumeData)                   // 20%
    };

    // Calculate weighted total
    const totalScore = Math.round(
        scores.formatting.score * 0.30 +
        scores.keywords.score * 0.30 +
        scores.actionVerbs.score * 0.20 +
        scores.completeness.score * 0.20
    );

    // Collect all warnings
    const warnings = [
        ...scores.formatting.warnings,
        ...scores.keywords.warnings,
        ...scores.actionVerbs.warnings,
        ...scores.completeness.warnings
    ];

    return {
        totalScore,
        breakdown: {
            formatting: scores.formatting,
            keywords: scores.keywords,
            actionVerbs: scores.actionVerbs,
            completeness: scores.completeness
        },
        warnings,
        grade: getGrade(totalScore)
    };
}

/**
 * 1. FORMATTING & STRUCTURE (30%)
 */
function analyzeFormatting(resumeData, templateConfig) {
    let score = 100;
    const warnings = [];
    const issues = [];

    // Check contact information
    if (!resumeData.header) {
        score -= 40;
        issues.push('Missing Header');
        warnings.push({ type: 'critical', message: 'Add personal information', rule: 'contactInfo' });
        return {
            score: 0,
            weight: 30,
            issues,
            warnings,
            details: 'Header completely missing'
        };
    }

    if (!resumeData.header.name) {
        score -= 15;
        issues.push('Missing name');
        warnings.push({ type: 'critical', message: 'Add your full name to header', rule: 'contactInfo' });
    }
    if (!resumeData.header?.email) {
        score -= 10;
        issues.push('Missing email');
        warnings.push({ type: 'critical', message: 'Add email address', rule: 'contactInfo' });
    }
    if (!resumeData.header?.phone) {
        score -= 8;
        issues.push('Missing phone');
        warnings.push({ type: 'warning', message: 'Add phone number for better reachability', rule: 'contactInfo' });
    }

    // Validate template is ATS-safe
    if (templateConfig.usesTables) {
        score -= 25;
        warnings.push({
            type: 'critical',
            message: ATS_RULES.noTables.reason,
            rule: 'noTables'
        });
    }

    if (templateConfig.usesIcons) {
        score -= 10;
        warnings.push({
            type: 'warning',
            message: ATS_RULES.noIconsAsText.reason,
            rule: 'noIconsAsText'
        });
    }

    if (templateConfig.isMultiColumn && templateConfig.isMultiColumn > 1) {
        score -= 15;
        warnings.push({
            type: 'warning',
            message: ATS_RULES.singleColumn.reason,
            rule: 'singleColumn'
        });
    }

    // Check section headings
    const nonStandardHeadings = checkNonStandardHeadings(resumeData);
    if (nonStandardHeadings.length > 0) {
        score -= 5;
        warnings.push({
            type: 'warning',
            message: `Use standard headings: ${nonStandardHeadings.join(', ')}`,
            rule: 'standardHeadings'
        });
    }

    return {
        score: Math.max(score, 0),
        weight: 30,
        issues,
        warnings,
        details: 'Clean structure, contact info, ATS-safe layout'
    };
}

/**
 * 2. KEYWORD RELEVANCE (30%)
 */
function analyzeKeywords(resumeData) {
    let score = 70;
    const warnings = [];
    const issues = [];

    // Count skills
    const skillCount = resumeData.skills?.reduce((acc, sg) => acc + (sg.items?.length || 0), 0) || 0;

    if (skillCount === 0) {
        score = 20;
        issues.push('No skills listed');
        warnings.push({ type: 'critical', message: 'Add 10-20 relevant skills for ATS matching', rule: 'keywords' });
    } else if (skillCount < 8) {
        score = 50;
        issues.push('Too few skills');
        warnings.push({ type: 'warning', message: 'Add more skills (aim for 10-15)', rule: 'keywords' });
    } else if (skillCount > 30) {
        score = 65;
        issues.push('Keyword stuffing detected');
        warnings.push({ type: 'warning', message: 'Too many skills may appear as keyword stuffing - reduce to 20-25', rule: 'keywords' });
    } else if (skillCount >= 10 && skillCount <= 20) {
        score = 100;
    } else {
        score = 85;
    }

    // Check if skills are categorized
    const hasCategorizedSkills = resumeData.skills?.some(sg => sg.category);
    if (hasCategorizedSkills) {
        score = Math.min(score + 5, 100);
    }

    return {
        score: Math.max(Math.min(score, 100), 0),
        weight: 30,
        issues,
        warnings,
        details: `${skillCount} skills listed - optimal range is 10-20`
    };
}

/**
 * 3. ACTION VERBS & IMPACT METRICS (20%)
 */
function analyzeActionVerbs(resumeData) {
    let strongVerbCount = 0;
    let weakVerbCount = 0;
    let totalBullets = 0;
    let metricsCount = 0;
    const warnings = [];
    const issues = [];

    resumeData.experience?.forEach(job => {
        job.points?.forEach(point => {
            totalBullets++;
            const lowerPoint = point.toLowerCase();

            // Check for strong verbs
            if (STRONG_ACTION_VERBS.some(verb => lowerPoint.startsWith(verb))) {
                strongVerbCount++;
            }
            // Check for weak verbs
            else if (WEAK_VERBS.some(phrase => lowerPoint.includes(phrase))) {
                weakVerbCount++;
            }

            // Check for metrics
            if (/(\$[\d,.]+[KMB]?|\d+%|\d+x|\d+[KMB]\+?|\d{2,})/.test(point)) {
                metricsCount++;
            }
        });
    });

    if (totalBullets === 0) {
        return {
            score: 50,
            weight: 20,
            issues: ['No experience bullets'],
            warnings: [{ type: 'warning', message: 'Add bullet points to experience section', rule: 'actionVerbs' }],
            details: 'No bullets to analyze'
        };
    }

    const strongRatio = strongVerbCount / totalBullets;
    const metricsRatio = metricsCount / totalBullets;

    // Score based on strong verbs (50% of this component)
    let verbScore = 0;
    if (strongRatio >= 0.8) verbScore = 100;
    else if (strongRatio >= 0.6) verbScore = 85;
    else if (strongRatio >= 0.4) verbScore = 70;
    else if (strongRatio >= 0.2) verbScore = 50;
    else verbScore = 30;

    // Score based on metrics (50% of this component)
    let metricsScore = 0;
    if (metricsRatio >= 0.7) metricsScore = 100;
    else if (metricsRatio >= 0.5) metricsScore = 85;
    else if (metricsRatio >= 0.3) metricsScore = 65;
    else metricsScore = 40;

    const finalScore = Math.round((verbScore + metricsScore) / 2);

    // Generate warnings
    if (strongRatio < 0.6) {
        warnings.push({
            type: 'warning',
            message: `Only ${Math.round(strongRatio * 100)}% of bullets use strong action verbs - aim for 70%+`,
            rule: 'actionVerbs'
        });
    }

    if (metricsRatio < 0.5) {
        warnings.push({
            type: 'warning',
            message: `Only ${Math.round(metricsRatio * 100)}% of bullets have metrics - add numbers (%, $, x) to 50%+ of bullets`,
            rule: 'metrics'
        });
    }

    if (weakVerbCount > 0) {
        warnings.push({
            type: 'warning',
            message: `Remove weak phrases like "responsible for" - found in ${weakVerbCount} bullets`,
            rule: 'weakVerbs'
        });
    }

    return {
        score: Math.max(finalScore, 0),
        weight: 20,
        issues,
        warnings,
        details: `${strongVerbCount}/${totalBullets} strong verbs, ${metricsCount}/${totalBullets} with metrics`
    };
}

/**
 * 4. SECTION COMPLETENESS (20%)
 */
function analyzeCompleteness(resumeData) {
    let score = 0;
    const warnings = [];
    const issues = [];

    // Required sections
    const hasExperience = resumeData.experience && resumeData.experience.length > 0;
    const hasEducation = resumeData.education && resumeData.education.length > 0;
    const hasSkills = resumeData.skills && resumeData.skills.length > 0;

    if (hasExperience) score += 40;
    else {
        issues.push('Missing Experience');
        warnings.push({ type: 'critical', message: 'Add work experience or internships', rule: 'completeness' });
    }

    if (hasEducation) score += 35;
    else {
        issues.push('Missing Education');
        warnings.push({ type: 'critical', message: 'Add education information', rule: 'completeness' });
    }

    if (hasSkills) score += 25;
    else {
        issues.push('Missing Skills');
        warnings.push({ type: 'critical', message: 'Add skills section', rule: 'completeness' });
    }

    // Optional but valuable sections
    if (resumeData.summary && resumeData.summary.length > 50) {
        score = Math.min(score + 5, 100);
    }

    if (resumeData.projects && resumeData.projects.length > 0) {
        score = Math.min(score + 5, 100);
    }

    return {
        score: Math.max(score, 0),
        weight: 20,
        issues,
        warnings,
        details: 'Experience, Education, Skills sections'
    };
}

/**
 * Helper: Check for non-standard headings
 */
function checkNonStandardHeadings(resumeData) {
    // This is a placeholder - actual implementation would check custom heading names
    return [];
}

/**
 * Get letter grade from score
 */
function getGrade(score) {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 75) return 'C+';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
}

/**
 * Get color for score
 */
export function getScoreColor(score) {
    if (score >= 90) return '#10b981'; // Green
    if (score >= 75) return '#3b82f6'; // Blue
    if (score >= 60) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
}

/**
 * Get all ATS rules for reference
 */
export function getATSRules() {
    return ATS_RULES;
}
