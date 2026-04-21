"use client";
import { useState } from "react";
import {
    AVAILABLE_SECTIONS,
    DEFAULT_SECTION_CONFIG,
    toggleSection,
    moveSectionUp,
    moveSectionDown
} from "@/lib/sectionConfig";

export default function SectionManager({ sectionConfig = DEFAULT_SECTION_CONFIG, onConfigChange }) {
    const [config, setConfig] = useState(sectionConfig);

    const handleToggle = (sectionId) => {
        const newConfig = toggleSection(config, sectionId);
        setConfig(newConfig);
        onConfigChange?.(newConfig);
    };

    const handleMoveUp = (sectionId) => {
        const newConfig = moveSectionUp(config, sectionId);
        setConfig(newConfig);
        onConfigChange?.(newConfig);
    };

    const handleMoveDown = (sectionId) => {
        const newConfig = moveSectionDown(config, sectionId);
        setConfig(newConfig);
        onConfigChange?.(newConfig);
    };

    const getSectionInfo = (sectionId) => {
        return AVAILABLE_SECTIONS.find(s => s.id === sectionId);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Customize Sections</h3>
            <p className="text-sm text-gray-600 mb-4">
                Toggle sections on/off and reorder them using the arrows
            </p>

            <div className="space-y-2">
                {config.map((section, index) => {
                    const sectionInfo = getSectionInfo(section.id);
                    const isFirst = index === 0;
                    const isLast = index === config.length - 1;

                    return (
                        <div
                            key={section.id}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${section.enabled
                                    ? 'bg-blue-50 border-blue-200'
                                    : 'bg-gray-50 border-gray-200'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                {/* Toggle Switch */}
                                <button
                                    onClick={() => handleToggle(section.id)}
                                    disabled={sectionInfo?.required}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${section.enabled ? 'bg-blue-600' : 'bg-gray-300'
                                        } ${sectionInfo?.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${section.enabled ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>

                                {/* Section Name */}
                                <div>
                                    <span className={`font-medium ${section.enabled ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {sectionInfo?.name}
                                    </span>
                                    {sectionInfo?.required && (
                                        <span className="ml-2 text-xs text-blue-600 font-medium">Required</span>
                                    )}
                                </div>
                            </div>

                            {/* Reorder Buttons */}
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handleMoveUp(section.id)}
                                    disabled={isFirst}
                                    className="p-1.5 rounded hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    title="Move up"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleMoveDown(section.id)}
                                    disabled={isLast}
                                    className="p-1.5 rounded hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    title="Move down"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                    <strong>Note:</strong> Required sections (Experience, Education, Skills) cannot be disabled as they are essential for ATS compatibility.
                </p>
            </div>
        </div>
    );
}
