import dynamic from 'next/dynamic';
import { useState, useMemo, useEffect } from 'react';
import templates from "./templatesData";
import TemplateFilter from "./TemplateFilter";
import TemplateCard from "./TemplateCard";

// Dynamic imports for performance
const ATSClassicNew = dynamic(() => import('./templates/ATSClassicNew'));
const StudentFresher = dynamic(() => import('./templates/StudentFresher'));
const ExecutiveLeadership = dynamic(() => import('./templates/ExecutiveLeadership'));
const AcademicResearchCV = dynamic(() => import('./templates/AcademicResearchCV'));
const CreativePortfolio = dynamic(() => import('./templates/CreativePortfolio'));

// Component Map
const TEMPLATE_COMPONENTS = {
  'ats-classic-1': ATSClassicNew,       // Software Engineer
  'ats-fresher': StudentFresher,        // Fresh Graduate
  'ats-elite': ExecutiveLeadership,     // Executive
  'academic-cv': AcademicResearchCV,    // Academic
  'creative-portfolio': CreativePortfolio // Creative
};

import TemplatePreviewModal from "./TemplatePreviewModal";

export default function TemplateSelector({ selectedTemplate, onSelect }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [previewId, setPreviewId] = useState(null); // Track preview state

  // Filter and search logic
  const filteredTemplates = useMemo(() => {
    let result = templates;

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(t => t.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search) ||
        t.tags?.some(tag => tag.toLowerCase().includes(search))
      );
    }

    return result;
  }, [selectedCategory, searchTerm]);

  const handleTemplateSelect = (templateId) => {
    console.log("Selected template:", templateId);
    if (onSelect) {
      onSelect(templateId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-4 px-2">
      {/* Modal Integration */}
      <TemplatePreviewModal
        isOpen={!!previewId}
        templateId={previewId}
        onClose={() => setPreviewId(null)}
        onSelect={(id) => {
          handleTemplateSelect(id);
          setPreviewId(null);
        }}
      />

      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Choose Your Resume Template
          </h1>
          <p className="text-sm text-gray-600">
            Select from {templates.length} professionally designed templates
          </p>
        </div>

        {/* Filter and Search */}
        <TemplateFilter
          onFilterChange={setSelectedCategory}
          onSearchChange={setSearchTerm}
        />

        {/* Results Count */}
        <div className="mb-2 text-center">
          <p className="text-[10px] text-gray-500">
            {filteredTemplates.length === 0 ? (
              <span className="text-red-600 font-medium">
                No templates found matching your criteria
              </span>
            ) : (
              <>
                Showing <span className="font-semibold text-gray-900">{filteredTemplates.length}</span> templates
              </>
            )}
          </p>
        </div>

        {/* Template Grid - 3 columns for better density */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[0.5rem] items-start mx-auto mb-16">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={handleTemplateSelect}
                onPreview={(id) => setPreviewId(id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No templates found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchTerm("");
              }}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Decorative Footer Section */}
        <div className="mt-20 mb-16 text-center">
          <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 shadow-sm border border-gray-100">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-2xl">✨</span>
              <h3 className="text-lg font-semibold text-gray-800">Can't find the perfect template?</h3>
              <span className="text-2xl">✨</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              All templates are ATS-friendly and customizable to match your unique style
            </p>
            <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <span>📄</span>
                <span>{templates.length} Templates</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🎨</span>
                <span>Fully Customizable</span>
              </div>
              <div className="flex items-center gap-1">
                <span>✓</span>
                <span>ATS Optimized</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
