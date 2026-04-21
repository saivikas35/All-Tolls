"use client";
import { useState } from "react";
import TemplatePreview from "./TemplatePreview";

export default function TemplateCard({ template, onSelect, onPreview }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="group relative bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer border border-gray-200 hover:border-blue-400 max-w-md mx-auto h-[520px] flex flex-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Template Preview - Clean Display */}
            <div className="relative bg-gray-50 max-h-[480px] overflow-hidden flex-1">
                <TemplatePreview templateId={template.id} data={template.persona} />

                {/* Hover Overlay - Simpler */}
                {isHovered && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-all duration-200">
                        <div className="text-center space-y-3">
                            <button
                                onClick={() => onSelect(template.id)}
                                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
                            >
                                Use Template
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent card click
                                    if (onPreview) onPreview(template.id);
                                }}
                                className="block px-8 py-2.5 bg-white/90 hover:bg-white text-gray-800 font-medium rounded-lg transition-colors mx-auto"
                            >
                                Preview
                            </button>
                        </div>
                    </div>
                )}

                {/* Small Badges - Top Right Only */}
                <div className="absolute top-3 right-3 flex gap-2">
                    {template.isPopular && (
                        <span className="px-2.5 py-1 text-xs font-semibold bg-orange-500 text-white rounded shadow-lg">
                            Popular
                        </span>
                    )}
                    {template.isNew && (
                        <span className="px-2.5 py-1 text-xs font-semibold bg-green-500 text-white rounded shadow-lg">
                            New
                        </span>
                    )}
                </div>
            </div>

            {/* Template Info - Clean and Simple */}
            <div className="p-2 bg-white">
                <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-sm text-gray-900 truncate pr-2">
                        {template.name}
                    </h3>
                    <span className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-700 rounded whitespace-nowrap">
                        ATS {template.atsScore}%
                    </span>
                </div>
                <p className="text-[10px] text-gray-500 line-clamp-1">
                    {template.description}
                </p>
            </div>
        </div>
    );
}
