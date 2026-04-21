"use client";
import { useState } from "react";
import { generateSummary } from "@/lib/contentGenerator";

export default function SummaryEditor({ value, onChange, roleKey = 'software-engineer', topSkills = [], experience = [] }) {
    const [yearsOfExperience, setYearsOfExperience] = useState('3');
    const [isGenerating, setIsGenerating] = useState(false);

    const maxLength = 600; // Increased for AI content
    const currentLength = value?.length || 0;
    const percentUsed = Math.min((currentLength / maxLength) * 100, 100);

    const handleAutoGenerate = () => {
        setIsGenerating(true);
        // Simulate AI delay for effect
        setTimeout(() => {
            // roleKey here comes from activeRole or header.title, often the raw input
            const summary = generateSummary(roleKey, `${yearsOfExperience}+`, topSkills, roleKey, experience);
            onChange(summary);
            setIsGenerating(false);
        }, 600);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-900">
                    Professional Summary
                </label>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Exp:</span>
                    <select
                        value={yearsOfExperience}
                        onChange={(e) => setYearsOfExperience(e.target.value)}
                        className="text-xs border rounded px-1 py-0.5"
                    >
                        <option value="0-1">0-1y</option>
                        <option value="3">3y+</option>
                        <option value="5">5y+</option>
                        <option value="10">10y+</option>
                    </select>
                    <button
                        type="button"
                        onClick={handleAutoGenerate}
                        disabled={isGenerating}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-medium rounded shadow-sm transition-all"
                    >
                        {isGenerating ? 'Writing...' : '✨ AI Auto-Write'}
                    </button>
                </div>
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs flex gap-3">
                <div className="text-xl">💡</div>
                <div>
                    <div className="font-semibold text-blue-900 mb-1">Impact Formula</div>
                    <div className="text-blue-800">
                        <strong>Role + Years + Achievements + Skills.</strong> Use the Auto-Write button to draft a strong starting point based on your selected role.
                    </div>
                </div>
            </div>

            {/* Summary Textarea */}
            <div className="relative">
                <textarea
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
                    placeholder="e.g., Software Engineer with 5 years building scalable web applications. Expertise in React, Node.js, and cloud infrastructure. Passionate about clean code and user-centric solutions."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none text-sm"
                    rows={3}
                    maxLength={maxLength}
                />

                {/* Character Counter */}
                <div className="absolute bottom-2 right-2 flex items-center gap-2">
                    <div className="text-xs text-gray-500">
                        {currentLength}/{maxLength}
                    </div>
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all ${percentUsed > 90 ? 'bg-red-500' : percentUsed > 70 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                            style={{ width: `${percentUsed}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Length Warning */}
            {currentLength > maxLength * 0.9 && (
                <div className="text-xs text-orange-600 font-medium">
                    ⚠️ Keep summary concise for better readability
                </div>
            )}
        </div>
    );
}
