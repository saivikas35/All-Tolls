"use client";
import { useState } from "react";
import { calculateATSScore, getScoreColor, getATSRules } from "@/lib/atsScoring";

export default function ATSScoreDashboard({ resumeData, templateConfig }) {
    const [showBreakdown, setShowBreakdown] = useState(false);
    const [showRules, setShowRules] = useState(false);

    const result = calculateATSScore(resumeData, templateConfig);
    const { totalScore, breakdown, warnings, grade } = result;
    const scoreColor = getScoreColor(totalScore);
    const rules = getATSRules();

    const criticalWarnings = warnings.filter(w => w.type === 'critical');
    const regularWarnings = warnings.filter(w => w.type === 'warning');

    return (
        <div className="space-y-4">
            {/* Main Score Card */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">ATS Score</h3>
                    <div
                        className="px-6 py-3 rounded-xl text-white font-bold text-2xl shadow-lg"
                        style={{ backgroundColor: scoreColor }}
                    >
                        {totalScore} / 100
                    </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">{grade === 'A+' || grade === 'A' ? '🎉' : grade.startsWith('B') ? '👍' : '⚠️'}</div>
                    <div>
                        <div className="text-xl font-bold" style={{ color: scoreColor }}>
                            Grade: {grade}
                        </div>
                        <div className="text-sm text-gray-600">
                            {totalScore >= 90 ? 'Excellent - Very ATS-friendly' :
                                totalScore >= 75 ? 'Good - ATS-compatible' :
                                    totalScore >= 60 ? 'Fair - Needs improvement' :
                                        'Poor - Major issues detected'}
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setShowBreakdown(!showBreakdown)}
                    className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-900 transition-colors"
                >
                    {showBreakdown ? 'Hide' : 'Show'} Score Breakdown
                </button>
            </div>

            {/* Score Breakdown */}
            {showBreakdown && (
                <div className="bg-white rounded-xl border-2 border-gray-200 p-5">
                    <h4 className="text-sm font-bold text-gray-900 mb-4">🔍 Transparent Scoring</h4>
                    <div className="space-y-4">
                        <ScoreComponent
                            name="Formatting & Structure"
                            score={breakdown.formatting.score}
                            weight={30}
                            details={breakdown.formatting.details}
                            issues={breakdown.formatting.issues}
                        />
                        <ScoreComponent
                            name="Keyword Relevance"
                            score={breakdown.keywords.score}
                            weight={30}
                            details={breakdown.keywords.details}
                            issues={breakdown.keywords.issues}
                        />
                        <ScoreComponent
                            name="Action Verbs & Metrics"
                            score={breakdown.actionVerbs.score}
                            weight={20}
                            details={breakdown.actionVerbs.details}
                            issues={breakdown.actionVerbs.issues}
                        />
                        <ScoreComponent
                            name="Section Completeness"
                            score={breakdown.completeness.score}
                            weight={20}
                            details={breakdown.completeness.details}
                            issues={breakdown.completeness.issues}
                        />
                    </div>

                    <div className="mt-4 pt-4 border-t text-xs text-gray-600">
                        <strong>Calculation:</strong> Formatting (30%) + Keywords (30%) + Action Verbs & Metrics (20%) + Completeness (20%) = {totalScore}/100
                    </div>
                </div>
            )}

            {/* Warnings */}
            {(criticalWarnings.length > 0 || regularWarnings.length > 0) && (
                <div className="space-y-2">
                    {criticalWarnings.map((warning, index) => (
                        <div key={index} className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                            <div className="flex items-start gap-2">
                                <span className="text-red-600 text-lg">🚨</span>
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-red-900">Critical Issue</div>
                                    <div className="text-xs text-red-800 mt-1">{warning.message}</div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {regularWarnings.map((warning, index) => (
                        <div key={index} className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                            <div className="flex items-start gap-2">
                                <span className="text-yellow-600 text-lg">⚠️</span>
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-yellow-900">Warning</div>
                                    <div className="text-xs text-yellow-800 mt-1">{warning.message}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ATS Rules Reference */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <button
                    onClick={() => setShowRules(!showRules)}
                    className="w-full flex items-center justify-between text-left"
                >
                    <span className="text-sm font-bold text-blue-900">📋 ATS Formatting Rules</span>
                    <span className="text-xs text-blue-600">{showRules ? 'Hide' : 'Show'}</span>
                </button>

                {showRules && (
                    <div className="mt-3 space-y-2">
                        {Object.entries(rules).map(([key, rule]) => (
                            <div key={key} className="text-xs">
                                <div className="font-semibold text-blue-900">
                                    {rule.severity === 'critical' ? '🚨' : '⚠️'} {rule.name}
                                </div>
                                <div className="text-blue-800 ml-5">{rule.reason}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ScoreComponent({ name, score, weight, details, issues }) {
    const color = getScoreColor(score);
    const contribution = Math.round((score / 100) * weight);

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <div>
                    <div className="text-sm font-semibold text-gray-900">{name}</div>
                    <div className="text-xs text-gray-600">{details}</div>
                </div>
                <div className="text-right">
                    <div className="text-sm font-bold" style={{ color }}>
                        {score}/100
                    </div>
                    <div className="text-xs text-gray-500">
                        = {contribution}/{weight} pts
                    </div>
                </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full transition-all duration-500"
                    style={{ width: `${score}%`, backgroundColor: color }}
                />
            </div>
            {issues && issues.length > 0 && (
                <div className="mt-1 text-xs text-gray-600">
                    Issues: {issues.join(', ')}
                </div>
            )}
        </div>
    );
}
