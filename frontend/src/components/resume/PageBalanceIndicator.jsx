"use client";
import { useState } from "react";
import { calculatePageBalance, getBalanceIndicator } from "@/lib/pageBalance";

export default function PageBalanceIndicator({ resumeData }) {
    const [showDetails, setShowDetails] = useState(false);

    const balance = calculatePageBalance(resumeData);
    const indicator = getBalanceIndicator(balance.status);

    return (
        <div className={`${indicator.bgColor} border-2 ${indicator.borderColor} rounded-xl p-4 shadow-sm`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="text-2xl">{indicator.icon}</div>
                    <div>
                        <div className={`text-sm font-bold ${indicator.textColor}`}>
                            Page Balance: {indicator.label}
                        </div>
                        <div className="text-xs text-gray-700 mt-0.5">
                            {indicator.message}
                        </div>
                    </div>
                </div>
                {balance.suggestions.length > 0 && (
                    <button
                        type="button"
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-xs text-gray-600 hover:text-gray-900 font-medium"
                    >
                        {showDetails ? 'Hide' : 'Tips'}
                    </button>
                )}
            </div>

            {/* Visual Progress Bar */}
            <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Empty</span>
                    <span>Optimal (1 page)</span>
                    <span>Too Full</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden relative">
                    {/* Optimal zone indicator */}
                    <div
                        className="absolute h-full bg-green-100 border-x-2 border-green-400"
                        style={{ left: '71%', width: '17%' }}
                    />
                    {/* Current fill */}
                    <div
                        className={`h-full ${indicator.barColor} transition-all duration-500`}
                        style={{ width: `${Math.min(balance.percentage, 100)}%` }}
                    />
                </div>
                <div className="text-center text-xs text-gray-600 mt-1">
                    {Math.round(balance.percentage)}% filled
                </div>
            </div>

            {/* Suggestions */}
            {showDetails && balance.suggestions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-300 space-y-2">
                    <div className="text-xs font-semibold text-gray-900 mb-2">💡 Suggestions:</div>
                    {balance.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex gap-2 text-xs">
                            <div className="flex-shrink-0 mt-0.5">
                                {suggestion.type === 'add' && '➕'}
                                {suggestion.type === 'remove' && '➖'}
                                {suggestion.type === 'reduce' && '✂️'}
                                {suggestion.type === 'optimal' && '✅'}
                            </div>
                            <div>
                                <span className="font-semibold text-gray-900">{suggestion.section}:</span>
                                <span className="text-gray-700 ml-1">{suggestion.action}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
