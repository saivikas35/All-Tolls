"use client";
import { useState } from "react";

export default function TemplateFilter({ onFilterChange, onSearchChange }) {
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const categories = [
        { id: "all", name: "All Templates", icon: "📋" },
        { id: "ats", name: "ATS-Friendly", icon: "✓" },
        { id: "modern", name: "Modern", icon: "✨" },
        { id: "professional", name: "Professional", icon: "💼" },
        { id: "creative", name: "Creative", icon: "🎨" },
        { id: "classic", name: "Classic", icon: "📄" }
    ];

    const handleCategoryClick = (categoryId) => {
        setActiveCategory(categoryId);
        onFilterChange(categoryId);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearchChange(value);
    };

    return (
        <div className="mb-8">
            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-md mx-auto">
                    <input
                        type="text"
                        placeholder="Search templates by name, keyword..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full px-4 py-3 pl-12 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <svg
                        className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`
              px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200
              ${activeCategory === category.id
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                : "bg-white text-gray-700 border border-gray-300 hover:border-blue-400 hover:text-blue-600 hover:shadow-md"
                            }
            `}
                    >
                        <span className="mr-1.5">{category.icon}</span>
                        {category.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
