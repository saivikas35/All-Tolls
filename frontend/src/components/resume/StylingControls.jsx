"use client";
import { useState } from "react";

const FONT_FAMILIES = {
    serif: { name: 'Serif (Traditional)', css: "'Times New Roman', 'Georgia', serif" },
    sans: { name: 'Sans-Serif (Modern)', css: "'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif" },
    modern: { name: 'Modern (Clean)', css: "'Roboto', 'Arial', sans-serif" }
};

const FONT_SIZES = {
    small: { name: 'Small (Compact)', scale: 0.9 },
    default: { name: 'Default (Standard)', scale: 1.0 },
    large: { name: 'Large (Easy Read)', scale: 1.1 }
};

const LINE_SPACINGS = {
    compact: { name: 'Compact (More Content)', value: 1.4 },
    normal: { name: 'Normal (Balanced)', value: 1.6 },
    relaxed: { name: 'Relaxed (Readable)', value: 1.8 }
};

export default function StylingControls({
    fontFamily = 'sans',
    fontSize = 'default',
    lineSpacing = 'normal',
    onFontFamilyChange,
    onFontSizeChange,
    onLineSpacingChange
}) {
    const [showAdvanced, setShowAdvanced] = useState(false);

    return (
        <div className="bg-white rounded-xl border-2 border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">✨ Styling</h3>
                <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                    {showAdvanced ? 'Simple' : 'Advanced'}
                </button>
            </div>

            {/* Simple Controls */}
            <div className="space-y-4">
                {/* Font Family */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        📝 Font Style
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {Object.entries(FONT_FAMILIES).map(([key, font]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => onFontFamilyChange(key)}
                                className={`px-3 py-2 text-xs font-medium rounded-lg border-2 transition-all ${fontFamily === key
                                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <div className="font-semibold mb-1">{key === 'serif' ? 'Aa' : key === 'sans' ? 'Aa' : 'Aa'}</div>
                                <div className="text-xs">{font.name.split(' ')[0]}</div>
                            </button>
                        ))}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                        {FONT_FAMILIES[fontFamily].name}
                    </div>
                </div>

                {/* Font Size */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        🔍 Font Size
                    </label>
                    <div className="flex gap-3">
                        {Object.entries(FONT_SIZES).map(([key, size]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => onFontSizeChange(key)}
                                className={`flex-1 px-3 py-2.5 text-xs font-medium rounded-lg border-2 transition-all ${fontSize === key
                                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {size.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Line Spacing */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        📏 Line Spacing
                    </label>
                    <div className="flex gap-3">
                        {Object.entries(LINE_SPACINGS).map(([key, spacing]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => onLineSpacingChange(key)}
                                className={`flex-1 px-3 py-2.5 text-xs font-medium rounded-lg border-2 transition-all ${lineSpacing === key
                                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {spacing.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ATS Safety Notice */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                        <div className="text-green-600 text-sm">✓</div>
                        <div className="text-xs text-green-800">
                            <strong>ATS-Safe:</strong> All styling options maintain text readability for applicant tracking systems
                        </div>
                    </div>
                </div>
            </div>

            {/* Advanced Options */}
            {showAdvanced && (
                <div className="mt-4 pt-4 border-t space-y-3">
                    <div className="text-xs font-semibold text-gray-900 mb-2">Advanced Settings</div>

                    {/* Visual Examples */}
                    <div className="space-y-2">
                        <div
                            className="p-3 bg-gray-50 rounded border border-gray-200"
                            style={{
                                fontFamily: FONT_FAMILIES[fontFamily].css,
                                fontSize: `${11 * FONT_SIZES[fontSize].scale}px`,
                                lineHeight: LINE_SPACINGS[lineSpacing].value
                            }}
                        >
                            <div className="font-bold mb-1">Example Text</div>
                            <div className="text-xs">This is how your resume will look with current settings.</div>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="text-xs text-gray-600 space-y-1">
                        <p>💡 <strong>Tip:</strong> Serif fonts look more traditional and formal</p>
                        <p>💡 <strong>Tip:</strong> Compact spacing fits more content on one page</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// Export configuration getters
export { FONT_FAMILIES, FONT_SIZES, LINE_SPACINGS };
