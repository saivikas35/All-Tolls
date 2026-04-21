"use client";
import { useState } from "react";
import { analyzeBulletPoint, getSectionHints, generateImprovement, getBulletColor } from "@/lib/writingAssistance";
import { generateBulletPoint } from "@/lib/contentGenerator";

export default function BulletPointEditor({ value, onChange, placeholder, sectionType = 'experience', roleKey = 'software-engineer' }) {
    const [showHint, setShowHint] = useState(false);
    const analysis = analyzeBulletPoint(value || '');
    const colors = getBulletColor(analysis.quality);
    const hints = getSectionHints(sectionType);

    const handleSuggest = () => {
        // Simple heuristic: if empty, generate. If not, maybe improve? 
        // For now, strict generation based on role.
        const suggestion = generateBulletPoint(roleKey);
        onChange(suggestion);
    };

    return (
        <div className="relative group">
            {/* Input Field with Quality Highlighting */}
            <textarea
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder || 'Start with an action verb...'}
                onFocus={() => setShowHint(true)}
                onBlur={() => setTimeout(() => setShowHint(false), 200)}
                className={`w-full px-3 py-2 border-2 rounded-lg outline-none resize-none text-sm transition-colors pr-8 ${value && value.length > 10
                    ? `${colors.bg} ${colors.border} ${colors.text}`
                    : 'bg-white border-gray-300 focus:border-blue-500'
                    }`}
                rows={2}
            />

            {/* AI Generator Trigger (Visible on Hover or Empty) */}
            <button
                type="button"
                onClick={handleSuggest}
                className={`absolute bottom-2 right-2 bg-white/90 hover:bg-violet-50 text-violet-600 border border-violet-200 rounded p-1 shadow-sm transition-opacity ${!value ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                title="Auto-generate bullet point"
            >
                ✨
            </button>

            {/* Quality Indicator (Only if content exists) */}
            {value && value.length > 10 && (
                <div className="absolute top-2 right-2 flex items-center gap-1 pointer-events-none">
                    {analysis.quality === 'excellent' && <span className="text-green-600 text-xs font-bold">✓</span>}
                    {analysis.quality === 'weak' && <span className="text-red-600 text-xs font-bold">!</span>}
                </div>
            )}

            {/* Inline Hints (Editor Only - Won't Export) */}
            {showHint && value && value.length > 10 && analysis.suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 p-3 bg-yellow-50 border-2 border-yellow-300 rounded-lg shadow-lg">
                    <div className="flex items-start gap-2">
                        <div className="text-yellow-600 text-lg">💡</div>
                        <div className="flex-1">
                            <div className="text-xs font-semibold text-yellow-900 mb-1">Suggestions:</div>
                            <ul className="space-y-1">
                                {analysis.suggestions.map((suggestion, index) => (
                                    <li key={index} className="text-xs text-yellow-800">
                                        • {suggestion}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export function SectionHintsCard({ sectionType }) {
    const hints = getSectionHints(sectionType);

    if (!hints) return null;

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
            <div className="text-xs font-semibold text-blue-900 mb-2">{hints.title}</div>
            <ul className="space-y-1">
                {hints.hints.map((hint, index) => (
                    <li key={index} className="text-xs text-blue-800">
                        • {hint}
                    </li>
                ))}
            </ul>
        </div>
    );
}
