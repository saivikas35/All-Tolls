/**
 * Inline Writing Assistance
 * Analyzes resume bullets and provides contextual suggestions
 */

const STRONG_ACTION_VERBS = [
    'achieved', 'improved', 'increased', 'reduced', 'generated', 'developed',
    'created', 'designed', 'implemented', 'launched', 'managed', 'led',
    'optimized', 'streamlined', 'automated', 'architected', 'built', 'drove',
    'executed', 'delivered', 'spearheaded', 'transformed', 'accelerated',
    'established', 'pioneered', 'orchestrated', 'elevated', 'modernized'
];

const WEAK_PHRASES = [
    'responsible for', 'worked on', 'helped with', 'assisted', 'participated in',
    'involved in', 'contributed to', 'dealt with', 'handled', 'tasked with'
];

/**
 * Analyze a single bullet point
 */
export function analyzeBulletPoint(text) {
    if (!text || typeof text !== 'string') {
        return { score: 0, issues: ['Empty bullet point'], suggestions: [] };
    }

    const issues = [];
    const suggestions = [];
    let score = 100;

    // Check for strong action verb at start
    const firstWord = text.trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, '');
    const hasStrongVerb = STRONG_ACTION_VERBS.some(verb => firstWord === verb);

    if (!hasStrongVerb) {
        score -= 30;
        issues.push('Weak or missing action verb');
        suggestions.push(`Start with a strong action verb like: ${STRONG_ACTION_VERBS.slice(0, 3).join(', ')}`);
    }

    // Check for weak phrases
    const lowerText = text.toLowerCase();
    const hasWeakPhrase = WEAK_PHRASES.some(phrase => lowerText.includes(phrase));

    if (hasWeakPhrase) {
        score -= 25;
        issues.push('Contains weak passive language');
        suggestions.push('Remove passive phrases like "responsible for" and use active voice');
    }

    // Check for metrics
    const hasMetrics = /(\$[\d,.]+[KMB]?|\d+%|\d+x|\d+[KMB]\+?|\d{2,})/.test(text);

    if (!hasMetrics) {
        score -= 30;
        issues.push('No measurable impact');
        suggestions.push('Add a quantifiable result (%, $, time saved, users impacted, or scale)');
    }

    // Check bullet length
    if (text.length < 30) {
        score -= 10;
        issues.push('Too brief');
        suggestions.push('Add more detail about your impact or the skills you used');
    } else if (text.length > 150) {
        score -= 10;
        issues.push('Too long');
        suggestions.push('Keep bullets concise (under 150 characters)');
    }

    // Determine overall quality
    let quality = 'good';
    if (score < 50) quality = 'weak';
    else if (score < 70) quality = 'fair';
    else if (score >= 90) quality = 'excellent';

    return {
        score,
        quality,
        issues,
        suggestions,
        hasStrongVerb,
        hasMetrics
    };
}

/**
 * Get contextual hints for a section
 */
export function getSectionHints(sectionType) {
    const hints = {
        experience: {
            title: '💼 Experience Tips',
            hints: [
                'Start each bullet with a strong action verb',
                'Include measurable results (%, $, time, users)',
                'Focus on achievements, not just responsibilities',
                'Use the format: Action Verb + Skill/Tool + Measurable Impact'
            ]
        },
        education: {
            title: '🎓 Education Tips',
            hints: [
                'Include GPA if 3.5 or higher',
                'List relevant coursework for entry-level roles',
                'Mention academic honors or scholarships',
                'Add thesis/capstone project if relevant'
            ]
        },
        projects: {
            title: '🚀 Projects Tips',
            hints: [
                'Describe what you built and why',
                'Mention technologies and tools used',
                'Quantify impact (users, performance, scale)',
                'Include links to live demos or GitHub (optional)'
            ]
        },
        skills: {
            title: '⚡ Skills Tips',
            hints: [
                'Categorize skills (Languages, Frameworks, Tools)',
                'Aim for 10-20 skills total (avoid keyword stuffing)',
                'Put most relevant skills first',
                'Match skills to job description keywords'
            ]
        },
        summary: {
            title: '📝 Summary Tips',
            hints: [
                'Keep it to 2-3 impactful lines (280 characters)',
                'Format: Role + Years + Core Strengths',
                'Highlight your unique value proposition',
                'Avoid generic phrases like "hard worker"'
            ]
        }
    };

    return hints[sectionType] || null;
}

/**
 * Generate improvement suggestion for a weak bullet
 */
export function generateImprovement(originalText) {
    const analysis = analyzeBulletPoint(originalText);

    if (analysis.quality === 'excellent' || analysis.quality === 'good') {
        return null; // No improvement needed
    }

    // Extract key info from original
    const words = originalText.trim().split(/\s+/);

    // Build improvement template
    let improved = originalText;

    // Fix action verb if needed
    if (!analysis.hasStrongVerb) {
        const suggestedVerb = STRONG_ACTION_VERBS[Math.floor(Math.random() * 5)];
        improved = `${suggestedVerb.charAt(0).toUpperCase() + suggestedVerb.slice(1)} ${originalText}`;
    }

    // Suggest adding metrics if missing
    if (!analysis.hasMetrics) {
        improved += ' [Add metric: %, $, or scale]';
    }

    return {
        original: originalText,
        improved,
        reason: analysis.issues.join(', '),
        suggestions: analysis.suggestions
    };
}

/**
 * Get color coding for bullet quality
 */
export function getBulletColor(quality) {
    const colors = {
        excellent: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-900' },
        good: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900' },
        fair: { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-900' },
        weak: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-900' }
    };

    return colors[quality] || colors.fair;
}
