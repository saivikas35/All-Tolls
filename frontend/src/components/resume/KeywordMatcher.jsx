"use client";
import { useState } from "react";
import { compareKeywords, generateKeywordSuggestions } from "@/lib/keywordIntelligence";

export default function KeywordMatcher({ resumeData, roleKey, jobDescription }) {
    const [showDetails, setShowDetails] = useState(false);

    const comparison = compareKeywords(resumeData, roleKey, jobDescription);
    const suggestions = generateKeywordSuggestions(comparison.missing, resumeData);

    return (
        <div className="bg-white rounded-xl border-2 border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">🎯 Keyword Match</h3>
                <div className={`px-4 py-2 rounded-lg font-bold text-sm ${comparison.matchPercentage >= 80 ? 'bg-green-100 text-green-900' :
                        comparison.matchPercentage >= 60 ? 'bg-blue-100 text-blue-900' :
                            'bg-orange-100 text-orange-900'
                    }`}>
                    {comparison.matchPercentage}% Match
                </div>
            </div>

            <div className="text-sm text-gray-600 mb-4">
                {comparison.totalMatched} of {comparison.totalExpected} expected keywords found
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-900">{comparison.matched.length}</div>
                    <div className="text-xs text-green-700">Matched</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="text-2xl font-bold text-orange-900">{comparison.missing.length}</div>
                    <div className="text-xs text-orange-700">Missing</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="text-2xl font-bold text-red-900">{comparison.overused.length}</div>
                    <div className="text-xs text-red-700">Overused</div>
                </div>
            </div>

            <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
                {showDetails ? 'Hide' : 'Show'} Details
            </button>

            {/* Detailed View */}
            {showDetails && (
                <div className="mt-4 space-y-4">
                    {/* Missing Keywords */}
                    {comparison.missing.length > 0 && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <div className="text-sm font-bold text-orange-900 mb-2">
                                ⚠️ Missing Keywords ({comparison.missing.length})
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {comparison.missing.slice(0, 10).map((keyword, index) => (
                                    <span key={index} className="px-2 py-1 bg-white border border-orange-300 rounded text-xs font-medium text-orange-900">
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                            {comparison.missing.length > 10 && (
                                <div className="mt-2 text-xs text-orange-700">
                                    +{comparison.missing.length - 10} more
                                </div>
                            )}
                        </div>
                    )}

                    {/* Matched Keywords */}
                    {comparison.matched.length > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="text-sm font-bold text-green-900 mb-2">
                                ✅ Matched Keywords ({comparison.matched.length})
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {comparison.matched.slice(0, 15).map((match, index) => (
                                    <span key={index} className="px-2 py-1 bg-white border border-green-300 rounded text-xs font-medium text-green-900">
                                        {match.keyword} {match.count > 1 && `(${match.count}x)`}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Overused Keywords Warning */}
                    {comparison.overused.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="text-sm font-bold text-red-900 mb-2">
                                🚨 Overused Keywords ({comparison.overused.length})
                            </div>
                            <div className="text-xs text-red-800 mb-2">
                                These keywords appear too many times and may appear as keyword stuffing
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {comparison.overused.map((keyword, index) => (
                                    <span key={index} className="px-2 py-1 bg-white border border-red-300 rounded text-xs font-medium text-red-900">
                                        {keyword.keyword} ({keyword.count}x)
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Suggestions */}
                    {suggestions.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="text-sm font-bold text-blue-900 mb-3">💡 Suggestions</div>
                            <div className="space-y-2">
                                {suggestions.map((suggestion, index) => (
                                    <div key={index} className="flex items-start gap-2 text-xs">
                                        <div className="flex-shrink-0 mt-0.5 text-blue-600">•</div>
                                        <div className="text-blue-800">{suggestion.suggestion}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
