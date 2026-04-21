"use client";
import { useEffect, useState } from "react";
import { detectExperienceLevel, getSmartDefaults } from "@/lib/smartDefaults";

export default function SmartDefaultsIndicator({ resumeData, onApplyDefaults }) {
    const [level, setLevel] = useState(null);
    const [defaults, setDefaults] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        if (resumeData) {
            const detectedLevel = detectExperienceLevel(resumeData);
            const levelDefaults = getSmartDefaults(detectedLevel);
            setLevel(detectedLevel);
            setDefaults(levelDefaults);
        }
    }, [resumeData]);

    if (!level || !defaults) return null;

    const levelIcons = {
        fresher: '🎓',
        junior: '🚀',
        professional: '💼',
        manager: '👔',
        academic: '📚'
    };

    const levelColors = {
        fresher: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900', button: 'bg-green-600 hover:bg-green-700' },
        junior: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', button: 'bg-blue-600 hover:bg-blue-700' },
        professional: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', button: 'bg-purple-600 hover:bg-purple-700' },
        manager: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-900', button: 'bg-indigo-600 hover:bg-indigo-700' },
        academic: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', button: 'bg-amber-600 hover:bg-amber-700' }
    };

    const colors = levelColors[level];

    return (
        <div className={`${colors.bg} border-2 ${colors.border} rounded-xl p-4 shadow-sm`}>
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                    <div className="text-3xl">{levelIcons[level]}</div>
                    <div>
                        <div className={`text-sm font-bold ${colors.text}`}>
                            Smart Resume Detected: {defaults.name}
                        </div>
                        <div className="text-xs text-gray-700 mt-1">
                            We've optimized settings based on your experience level
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-xs text-gray-600 hover:text-gray-900 font-medium"
                >
                    {showDetails ? 'Hide' : 'Show'}
                </button>
            </div>

            {/* Optimizations Applied */}
            {showDetails && (
                <div className="mt-4 pt-4 border-t border-gray-300 space-y-3">
                    <div>
                        <div className="text-xs font-semibold text-gray-900 mb-2">📑 Section Order:</div>
                        <div className="flex flex-wrap gap-1.5">
                            {defaults.sectionOrder.map((section, index) => (
                                <span
                                    key={section}
                                    className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-medium"
                                >
                                    {index + 1}. {section}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="text-xs font-semibold text-gray-900 mb-2">⭐ Emphasis:</div>
                        <div className="text-xs text-gray-700">
                            {defaults.emphasisSections.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}
                        </div>
                    </div>

                    <div>
                        <div className="text-xs font-semibold text-gray-900 mb-2">💡 Summary Guidance:</div>
                        <div className="text-xs text-gray-700 italic">
                            "{defaults.summaryGuidance}"
                        </div>
                    </div>

                    <div>
                        <div className="text-xs font-semibold text-gray-900 mb-2">🎨 Recommended Styling:</div>
                        <div className="text-xs text-gray-700">
                            Font: {defaults.fontFamily === 'serif' ? 'Serif (Traditional)' : defaults.fontFamily === 'sans' ? 'Sans-Serif (Modern)' : 'Modern (Clean)'},
                            Size: {defaults.fontSize},
                            Spacing: {defaults.lineSpacing}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => onApplyDefaults(defaults)}
                        className={`w-full mt-3 px-4 py-2.5 ${colors.button} text-white text-sm font-semibold rounded-lg transition-colors`}
                    >
                        ✨ Apply All Recommended Settings
                    </button>

                    <div className="text-xs text-gray-600 text-center mt-2">
                        You can always customize settings later
                    </div>
                </div>
            )}
        </div>
    );
}
