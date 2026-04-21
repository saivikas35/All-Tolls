"use client";
import { analyzeJobBullets, getBulletColor, generateBulletImprovement } from "@/lib/bulletAnalysis";

export default function SectionATSFeedback({ resumeData }) {
    // Analyze Summary
    const summaryStatus = analyzeSummarySection(resumeData);

    // Analyze Experience
    const experienceStatus = analyzeExperienceSection(resumeData);

    // Analyze Skills
    const skillsStatus = analyzeSkillsSection(resumeData);

    return (
        <div className="space-y-3">
            <h3 className="text-base font-bold text-gray-900">📊 Section-Level ATS Feedback</h3>

            <SectionCard section="Summary" status={summaryStatus} />
            <SectionCard section="Experience" status={experienceStatus} />
            <SectionCard section="Skills" status={skillsStatus} />
        </div>
    );
}

function SectionCard({ section, status }) {
    const isGood = status.status === 'good';
    const bgColor = isGood ? 'bg-green-50' : 'bg-orange-50';
    const borderColor = isGood ? 'border-green-300' : 'border-orange-300';
    const textColor = isGood ? 'text-green-900' : 'text-orange-900';
    const icon = isGood ? '✓' : '⚠️';

    return (
        <div className={`${bgColor} border-2 ${borderColor} rounded-lg p-4`}>
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-xl">{icon}</span>
                    <div>
                        <div className="text-sm font-bold text-gray-900">{section}</div>
                        <div className={`text-xs ${textColor} font-semibold`}>
                            {isGood ? 'Good' : 'Needs Improvement'}
                        </div>
                    </div>
                </div>
                {status.score && (
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${isGood ? 'bg-green-600' : 'bg-orange-600'} text-white`}>
                        {status.score}/100
                    </div>
                )}
            </div>

            <div className="text-xs text-gray-700 mt-2">
                {status.feedback}
            </div>

            {status.suggestions && status.suggestions.length > 0 && (
                <div className="mt-3 space-y-1">
                    {status.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-2 text-xs">
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-700">{suggestion}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Analysis Functions

function analyzeSummarySection(resumeData) {
    const summary = resumeData.summary || '';

    if (!summary || summary.length < 50) {
        return {
            status: 'needs-improvement',
            score: 40,
            feedback: 'Your summary is missing or too short. A strong summary should be 2-3 lines highlighting your role, experience, and core strengths.',
            suggestions: [
                'Add a professional summary (280 characters recommended)',
                'Use format: Role + Years + Core Strengths',
                'Example: "Software Engineer with 5 years building scalable web applications..."'
            ]
        };
    }

    if (summary.length > 350) {
        return {
            status: 'needs-improvement',
            score: 70,
            feedback: 'Your summary is too long. Keep it concise (2-3 lines) for better readability.',
            suggestions: [
                'Reduce summary to 280 characters or less',
                'Focus on mostimpactful points only'
            ]
        };
    }

    // Check for good elements
    const hasRole = /\b(engineer|developer|manager|scientist|designer|analyst)\b/i.test(summary);
    const hasYears = /\d+\s*(year|yr)/i.test(summary);

    if (hasRole && hasYears) {
        return {
            status: 'good',
            score: 95,
            feedback: 'Your summary effectively highlights your role and experience. Well done!',
            suggestions: []
        };
    }

    return {
        status: 'needs-improvement',
        score: 65,
        feedback: 'Your summary could be stronger. Include your years of experience and specific skills.',
        suggestions: [
            'Mention years of experience',
            'Add your top 2-3 technical skills',
            'Highlight unique value proposition'
        ]
    };
}

function analyzeExperienceSection(resumeData) {
    if (!resumeData.experience || resumeData.experience.length === 0) {
        return {
            status: 'needs-improvement',
            score: 0,
            feedback: 'No experience section found. This is critical for ATS systems.',
            suggestions: [
                'Add your work experience or internships',
                'Include 3-5 bullet points per role',
                'Use Action Verb + Skill + Impact format'
            ]
        };
    }

    // Analyze all bullets
    let totalBullets = 0;
    let strongBullets = 0;
    let bulletsWithMetrics = 0;

    resumeData.experience.forEach(job => {
        const analysis = analyzeJobBullets(job);
        totalBullets += analysis.summary.total;
        strongBullets += analysis.summary.strong;

        analysis.bulletAnalyses.forEach(b => {
            if (b.analysis.hasImpact) bulletsWithMetrics++;
        });
    });

    const strongRatio = totalBullets > 0 ? strongBullets / totalBullets : 0;
    const metricsRatio = totalBullets > 0 ? bulletsWithMetrics / totalBullets : 0;

    const score = Math.round((strongRatio * 60) + (metricsRatio * 40));

    if (score >= 75) {
        return {
            status: 'good',
            score,
            feedback: `Strong experience section! ${strongBullets}/${totalBullets} bullets are well-written with action verbs and metrics.`,
            suggestions: []
        };
    }

    const suggestions = [];
    if (strongRatio < 0.7) {
        suggestions.push(`Only ${Math.round(strongRatio * 100)}% of bullets use strong action verbs - aim for 70%+`);
    }
    if (metricsRatio < 0.5) {
        suggestions.push(`Add metrics (%, $, scale) to more bullets - currently ${Math.round(metricsRatio * 100)}%`);
    }

    return {
        status: 'needs-improvement',
        score,
        feedback: 'Your experience bullets need improvement. Focus on impact and quantifiable results.',
        suggestions
    };
}

function analyzeSkillsSection(resumeData) {
    const skillCount = resumeData.skills?.reduce((acc, sg) => acc + (sg.items?.length || 0), 0) || 0;

    if (skillCount === 0) {
        return {
            status: 'needs-improvement',
            score: 0,
            feedback: 'No skills listed. Skills are critical for ATS keyword matching.',
            suggestions: [
                'Add 10-20 relevant technical skills',
                'Categorize by Languages, Frameworks, Tools',
                'Match skills to job description'
            ]
        };
    }

    if (skillCount < 8) {
        return {
            status: 'needs-improvement',
            score: 50,
            feedback: `Only ${skillCount} skills listed. Add more for better ATS matching.`,
            suggestions: [
                'Add more relevant skills (aim for 10-15)',
                'Include both hard and soft skills',
                'Match keywords from job description'
            ]
        };
    }

    if (skillCount > 25) {
        return {
            status: 'needs-improvement',
            score: 70,
            feedback: `${skillCount} skills may appear as keyword stuffing. Reduce to 20-25 most relevant.`,
            suggestions: [
                'Remove less relevant skills',
                'Keep only skills you can discuss confidently',
                'Prioritize skills from job description'
            ]
        };
    }

    return {
        status: 'good',
        score: 95,
        feedback: `Excellent! ${skillCount} skills - optimal for ATS matching.`,
        suggestions: []
    };
}
