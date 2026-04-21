/**
 * Bullet-Level ATS Analysis
 * Analyzes each experience bullet for ATS effectiveness
 */

const STRONG_ACTION_VERBS = [
    'achieved', 'improved', 'increased', 'reduced', 'generated', 'developed',
    'created', 'designed', 'implemented', 'launched', 'managed', 'led',
    'optimized', 'streamlined', 'automated', 'architected', 'built', 'drove',
    'executed', 'delivered', 'spearheaded', 'transformed', 'accelerated'
];

const WEAK_VERBS = ['worked', 'helped', 'assisted', 'participated', 'responsible'];

/**
 * Analyze a single bullet for ATS effectiveness
 */
export function analyzeBullet(bulletText) {
    if (!bulletText || bulletText.length < 10) {
        return {
            rating: 'weak',
            score: 0,
            hasActionVerb: false,
            hasSkill: false,
            hasImpact: false,
            issues: ['Bullet too short or empty'],
            suggestions: ['Write a complete bullet point with action verb, skill, and measurable impact']
        };
    }

    const lowerText = bulletText.toLowerCase();
    const issues = [];
    const suggestions = [];
    let score = 0;

    // 1. Check for action verb at start (40 points)
    const firstWord = bulletText.trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, '');
    const hasStrongVerb = STRONG_ACTION_VERBS.some(verb => firstWord === verb);
    const hasWeakVerb = WEAK_VERBS.some(verb => firstWord === verb);

    let hasActionVerb = false;
    if (hasStrongVerb) {
        score += 40;
        hasActionVerb = true;
    } else if (hasWeakVerb) {
        score += 15;
        hasActionVerb = true;
        issues.push('Weak action verb');
        suggestions.push(`Replace "${firstWord}" with stronger verbs like: ${STRONG_ACTION_VERBS.slice(0, 3).join(', ')}`);
    } else {
        issues.push('Missing or weak action verb');
        suggestions.push(`Start with a strong action verb: ${STRONG_ACTION_VERBS.slice(0, 3).join(', ')}`);
    }

    // 2. Check for skill/tool mention (30 points)
    const hasSkill = /\b(JavaScript|Python|React|SQL|AWS|Docker|Node\.js|Java|API|Git|Agile|Scrum|[A-Z][a-z]+(?:\.[a-z]+)?)\b/.test(bulletText);

    if (hasSkill) {
        score += 30;
    } else {
        issues.push('No technical skill or tool mentioned');
        suggestions.push('Add the technology, framework, or tool you used (e.g., "using React and Node.js")');
    }

    // 3. Check for measurable impact (30 points)
    const hasImpact = /(\$[\d,.]+[KMB]?|\d+%|\d+x|\d+[KMB]\+?|\d{2,})/.test(bulletText);

    if (hasImpact) {
        score += 30;
    } else {
        issues.push('No measurable impact');
        suggestions.push('Add a quantifiable result (%, $, time saved, users impacted, or scale)');
    }

    // Determine rating
    let rating = 'weak';
    if (score >= 85) rating = 'strong';
    else if (score >= 60) rating = 'average';

    return {
        rating,
        score,
        hasActionVerb,
        hasSkill,
        hasImpact,
        issues,
        suggestions
    };
}

/**
 * Analyze all bullets in a job
 */
export function analyzeJobBullets(job) {
    const bulletAnalyses = (job.points || []).map(point => ({
        text: point,
        analysis: analyzeBullet(point)
    }));

    const totalBullets = bulletAnalyses.length;
    const strongCount = bulletAnalyses.filter(b => b.analysis.rating === 'strong').length;
    const averageCount = bulletAnalyses.filter(b => b.analysis.rating === 'average').length;
    const weakCount = bulletAnalyses.filter(b => b.analysis.rating === 'weak').length;

    const avgScore = totalBullets > 0
        ? Math.round(bulletAnalyses.reduce((sum, b) => sum + b.analysis.score, 0) / totalBullets)
        : 0;

    return {
        bulletAnalyses,
        summary: {
            total: totalBullets,
            strong: strongCount,
            average: averageCount,
            weak: weakCount,
            avgScore
        }
    };
}

/**
 * Generate improvement for a weak bullet
 */
export function generateBulletImprovement(bulletText, analysis) {
    if (analysis.rating === 'strong') {
        return null; // No improvement needed
    }

    let improved = bulletText;
    const improvements = [];

    // Fix action verb
    if (!analysis.hasActionVerb || analysis.issues.includes('Weak action verb')) {
        const suggestedVerb = STRONG_ACTION_VERBS[0]; // Use first strong verb
        improved = `${suggestedVerb.charAt(0).toUpperCase() + suggestedVerb.slice(1)} ${improved}`;
        improvements.push('Added strong action verb');
    }

    // Suggest skill addition
    if (!analysis.hasSkill) {
        improved += ' using [Technology/Tool]';
        improvements.push('Placeholder for technology/tool');
    }

    // Suggest impact addition
    if (!analysis.hasImpact) {
        improved += ', [resulting in X% improvement]';
        improvements.push('Placeholder for measurable impact');
    }

    return {
        original: bulletText,
        improved,
        improvements,
        reasoning: analysis.issues.join('; ')
    };
}

/**
 * Get color for bullet rating
 */
export function getBulletColor(rating) {
    const colors = {
        strong: { bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-900', badge: 'bg-green-600' },
        average: { bg: 'bg-yellow-50', border: 'border-yellow-400', text: 'text-yellow-900', badge: 'bg-yellow-600' },
        weak: { bg: 'bg-red-50', border: 'border-red-400', text: 'text-red-900', badge: 'bg-red-600' }
    };

    return colors[rating] || colors.weak;
}
