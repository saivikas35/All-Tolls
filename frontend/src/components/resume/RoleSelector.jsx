"use client";
import { useState } from "react";
import { ROLE_CONFIGS, getActionVerbSuggestions, getKeywordSuggestions } from "@/lib/roleOptimization";

export default function RoleSelector({ selected, onSelect }) {
    const [showDetails, setShowDetails] = useState(false);

    const roles = Object.entries(ROLE_CONFIGS);
    const activeKey = ROLE_CONFIGS[selected] ? selected : 'software-engineer';
    const activeConfig = ROLE_CONFIGS[activeKey];

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-900">
                    Target Role
                </label>
                <button
                    type="button"
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                    {showDetails ? 'Hide' : 'Show'} Details
                </button>
            </div>

            {/* Role Dropdown */}
            <select
                value={activeKey}
                onChange={(e) => onSelect(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm font-medium"
            >
                {roles.map(([key, config]) => (
                    <option key={key} value={key}>
                        {config.name}
                    </option>
                ))}
            </select>

            {/* Role Details */}
            {showDetails && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 space-y-3">
                    <div>
                        <div className="text-xs font-semibold text-blue-900 mb-2">
                            📊 Optimized Section Order:
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {activeConfig.sectionOrder.map((section, index) => (
                                <span
                                    key={section}
                                    className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded"
                                >
                                    {index + 1}. {section}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="text-xs font-semibold text-blue-900 mb-2">
                            💪 Recommended Action Verbs:
                        </div>
                        <div className="text-xs text-blue-800">
                            {getActionVerbSuggestions(selected).slice(0, 10).join(', ')}
                        </div>
                    </div>

                    <div>
                        <div className="text-xs font-semibold text-blue-900 mb-2">
                            🔑 Key Skills for ATS:
                        </div>
                        <div className="text-xs text-blue-800">
                            {getKeywordSuggestions(selected).join(', ')}
                        </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-blue-300">
                        <div className="text-xs text-blue-700 italic">
                            💡 Your resume will be automatically optimized based on this role
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
