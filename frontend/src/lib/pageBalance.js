/**
 * Page Balance Indicator
 * Calculates resume content density and provides guidance
 */

/**
 * Estimate resume content length in terms of page fill
 */
export function calculatePageBalance(resumeData) {
    let contentUnits = 0;

    // Header (always present) = 2 units
    contentUnits += 2;

    if (!resumeData) return { contentUnits: 0, percentage: 0, status: 'empty', suggestions: [] };

    // Summary (if present) = 2 units
    if (resumeData.summary && resumeData.summary.length > 0) {
        contentUnits += 2;
    }

    // Experience bullets
    resumeData.experience?.forEach(job => {
        contentUnits += 3; // Job header (role, company, dates)
        contentUnits += (job.points?.length || 0) * 1.5; // Each bullet
    });

    // Education
    resumeData.education?.forEach(() => {
        contentUnits += 2; // Each degree
    });

    // Skills
    const skillCount = resumeData.skills?.reduce((acc, sg) => acc + (sg.items?.length || 0), 0) || 0;
    contentUnits += Math.ceil(skillCount / 5); // ~5 skills per unit

    // Projects
    resumeData.projects?.forEach(project => {
        contentUnits += 2; // Project header
        contentUnits += (project.points?.length || 0) * 1.5;
    });

    // Certifications
    contentUnits += (resumeData.certifications?.length || 0) * 1;

    // Publications
    contentUnits += (resumeData.publications?.length || 0) * 2;

    // Languages
    contentUnits += (resumeData.languages?.length || 0) * 0.5;

    // Determine balance (optimal = 30-38 units for one page)
    let status = 'optimal';
    let percentage = (contentUnits / 35) * 100; // 35 units = ideal full page

    if (contentUnits < 25) {
        status = 'underfilled';
    } else if (contentUnits > 40) {
        status = 'overcrowded';
    }

    return {
        contentUnits,
        percentage: Math.min(percentage, 120), // Cap at 120%
        status,
        suggestions: generateBalanceSuggestions(status, resumeData)
    };
}

/**
 * Generate suggestions based on page balance
 */
function generateBalanceSuggestions(status, resumeData) {
    const suggestions = [];

    if (status === 'underfilled') {
        // Suggest adding more content
        if ((resumeData.experience?.[0]?.points?.length || 0) < 3) {
            suggestions.push({
                type: 'add',
                section: 'Experience',
                action: 'Add 1-2 more bullet points to your recent role to highlight key achievements'
            });
        }

        if (!resumeData.projects || resumeData.projects.length === 0) {
            suggestions.push({
                type: 'add',
                section: 'Projects',
                action: 'Add a Projects section to showcase your work'
            });
        }

        if (!resumeData.certifications || resumeData.certifications.length === 0) {
            suggestions.push({
                type: 'add',
                section: 'Certifications',
                action: 'Add relevant certifications or coursework to fill the page'
            });
        }

        if (!resumeData.summary || resumeData.summary.length < 100) {
            suggestions.push({
                type: 'add',
                section: 'Summary',
                action: 'Expand your professional summary to 2-3 lines'
            });
        }
    } else if (status === 'overcrowded') {
        // Suggest removing content
        const experienceCount = resumeData.experience?.length || 0;
        if (experienceCount > 4) {
            suggestions.push({
                type: 'remove',
                section: 'Experience',
                action: `Consider removing oldest role(s). You have ${experienceCount} positions listed - focus on the most recent and relevant`
            });
        }

        resumeData.experience?.forEach((job, index) => {
            if ((job.points?.length || 0) > 5) {
                suggestions.push({
                    type: 'reduce',
                    section: 'Experience',
                    action: `Job ${index + 1} has ${job.points.length} bullets - reduce to 3-4 most impactful ones`
                });
            }
        });

        const skillCount = resumeData.skills?.reduce((acc, sg) => acc + (sg.items?.length || 0), 0) || 0;
        if (skillCount > 25) {
            suggestions.push({
                type: 'reduce',
                section: 'Skills',
                action: `You have ${skillCount} skills listed - reduce to 15-20 most relevant ones`
            });
        }

        if (resumeData.projects && resumeData.projects.length > 3) {
            suggestions.push({
                type: 'reduce',
                section: 'Projects',
                action: `Reduce projects to 2-3 most impressive or relevant ones`
            });
        }
    } else {
        // Optimal - just affirm
        suggestions.push({
            type: 'optimal',
            section: 'Overall',
            action: '✅ Your resume length looks great! Aim to keep it to one page.'
        });
    }

    return suggestions.slice(0, 4); // Return top 4 suggestions
}

/**
 * Get visual indicator config
 */
export function getBalanceIndicator(status) {
    const indicators = {
        underfilled: {
            color: 'orange',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-300',
            barColor: 'bg-orange-500',
            textColor: 'text-orange-900',
            icon: '📄',
            label: 'Under-filled',
            message: 'Your resume has room for more content'
        },
        optimal: {
            color: 'green',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-300',
            barColor: 'bg-green-500',
            textColor: 'text-green-900',
            icon: '✅',
            label: 'Optimal',
            message: 'Content length is ideal for one page'
        },
        overcrowded: {
            color: 'red',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-300',
            barColor: 'bg-red-500',
            textColor: 'text-red-900',
            icon: '⚠️',
            label: 'Overcrowded',
            message: 'Too much content - may exceed one page'
        }
    };

    return indicators[status] || indicators.optimal;
}
