"use client";
import React from "react";
import ResumeRenderer from "./ResumeRenderer";
import previewResumeData from "./previewResumeData";

export default function TemplatePreviewModal({ templateId, isOpen, onClose, onSelect }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Template Preview</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        ✕ Close
                    </button>
                </div>

                {/* Preview Content - Scrollable */}
                <div className="flex-1 overflow-y-auto bg-gray-100 p-8 flex justify-center">
                    <div className="bg-white shadow-lg transition-all duration-300" style={{ width: '210mm', minHeight: '297mm' }}>
                        <ResumeRenderer
                            resumeData={previewResumeData}
                            templateId={templateId}
                        />
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="px-6 py-4 bg-white border-t border-gray-200 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onSelect(templateId);
                        }}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all hover:scale-105 transform active:scale-95"
                    >
                        Use This Template
                    </button>
                </div>
            </div>
        </div>
    );
}
