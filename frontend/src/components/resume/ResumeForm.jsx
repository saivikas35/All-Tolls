"use client";

import { useState } from "react";
import BulletPointEditor from "./BulletPointEditor";
import SummaryEditor from "./SummaryEditor";
import RoleSelector from "./RoleSelector";

export default function ResumeForm({ data, setData }) {
    const [activeTab, setActiveTab] = useState("header");

    const updateHeader = (field, value) => {
        setData(prev => ({
            ...prev,
            header: { ...prev.header, [field]: value }
        }));
    };

    const updateExperience = (index, field, value) => {
        const newExp = [...(data.experience || [])];
        newExp[index] = { ...newExp[index], [field]: value };
        setData(prev => ({ ...prev, experience: newExp }));
    };

    const addExperience = () => {
        setData(prev => ({
            ...prev,
            experience: [
                { role: "New Role", company: "Company", start: "", end: "", points: [""] },
                ...(prev.experience || [])
            ]
        }));
    };

    const removeExperience = (index) => {
        const newExp = [...(data.experience || [])];
        newExp.splice(index, 1);
        setData(prev => ({ ...prev, experience: newExp }));
    };

    const updateEducation = (index, field, value) => {
        const newEdu = [...(data.education || [])];
        newEdu[index] = { ...newEdu[index], [field]: value };
        setData(prev => ({ ...prev, education: newEdu }));
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
            {/* Tabs */}
            <div className="flex border-b overflow-x-auto">
                {['header', 'summary', 'experience', 'education', 'skills', 'projects'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-3 text-sm font-medium capitalize whitespace-nowrap
              ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}
            `}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
                {/* HEADER FORM */}
                {activeTab === 'header' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={data.header?.name || ""}
                                    onChange={(e) => updateHeader("name", e.target.value)}
                                    className="w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Job Title</label>
                                <input
                                    type="text"
                                    value={data.header?.title || ""}
                                    onChange={(e) => updateHeader("title", e.target.value)}
                                    className="w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={data.header?.email || ""}
                                    onChange={(e) => updateHeader("email", e.target.value)}
                                    className="w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="text"
                                    value={data.header?.phone || ""}
                                    onChange={(e) => updateHeader("phone", e.target.value)}
                                    className="w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    value={data.header?.location || ""}
                                    onChange={(e) => updateHeader("location", e.target.value)}
                                    className="w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">LinkedIn / Portfolio</label>
                                <input
                                    type="text"
                                    value={data.header?.linkedin || ""}
                                    onChange={(e) => updateHeader("linkedin", e.target.value)}
                                    className="w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* SUMMARY FORM */}
                {activeTab === 'summary' && (
                    <div className="space-y-4">
                        <RoleSelector
                            selected={data.header?.title}
                            onSelect={(roleTitle) => updateHeader("title", roleTitle)}
                        />
                        <SummaryEditor
                            value={data.summary || ""}
                            roleKey={data.header?.title}
                            topSkills={data.skills?.[0]?.items || []}
                            experience={data.experience || []}
                            onChange={(val) => setData(prev => ({ ...prev, summary: val }))}
                        />
                    </div>
                )}

                {/* EXPERIENCE FORM */}
                {activeTab === 'experience' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Experience</h3>
                            <button onClick={addExperience} className="text-sm text-blue-600 hover:text-blue-800 font-medium">+ Add Role</button>
                        </div>

                        {data.experience?.map((exp, index) => (
                            <div key={index} className="border rounded-lg p-4 bg-gray-50 relative">
                                <button
                                    onClick={() => removeExperience(index)}
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs"
                                >
                                    Remove
                                </button>

                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <input
                                        placeholder="Role"
                                        value={exp.role}
                                        onChange={(e) => updateExperience(index, 'role', e.target.value)}
                                        className="text-sm font-semibold border-gray-300 rounded"
                                    />
                                    <input
                                        placeholder="Company"
                                        value={exp.company}
                                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                        className="text-sm border-gray-300 rounded"
                                    />
                                    <input
                                        placeholder="Start Date"
                                        value={exp.start}
                                        onChange={(e) => updateExperience(index, 'start', e.target.value)}
                                        className="text-xs border-gray-300 rounded"
                                    />
                                    <input
                                        placeholder="End Date"
                                        value={exp.end}
                                        onChange={(e) => updateExperience(index, 'end', e.target.value)}
                                        className="text-xs border-gray-300 rounded"
                                    />
                                </div>

                                {/* Bullet Points with Writing Assistance */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-600">Achievements (Use BulletPointEditor for AI hints)</label>
                                    {exp.points?.map((point, pIndex) => (
                                        <BulletPointEditor
                                            key={pIndex}
                                            value={point}
                                            roleKey={data.header?.title}
                                            onChange={(val) => {
                                                const newPoints = [...exp.points];
                                                newPoints[pIndex] = val;
                                                updateExperience(index, 'points', newPoints);
                                            }}
                                        />
                                    ))}
                                    <button
                                        onClick={() => {
                                            const newPoints = [...(exp.points || []), ""];
                                            updateExperience(index, 'points', newPoints);
                                        }}
                                        className="text-xs text-blue-600 mt-1"
                                    >
                                        + Add Bullet Point
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* EDUCATION FORM */}
                {activeTab === 'education' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Education</h3>
                            <button
                                onClick={() => setData(prev => ({ ...prev, education: [...(prev.education || []), { institution: "", degree: "", year: "" }] }))}
                                className="text-sm text-blue-600 font-medium"
                            >
                                + Add Education
                            </button>
                        </div>
                        {data.education?.map((edu, index) => (
                            <div key={index} className="border rounded-lg p-3 bg-gray-50">
                                <div className="grid grid-cols-1 gap-2">
                                    <input placeholder="University" value={edu.institution} onChange={(e) => updateEducation(index, 'institution', e.target.value)} className="text-sm font-semibold border-gray-300 rounded" />
                                    <input placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(index, 'degree', e.target.value)} className="text-sm border-gray-300 rounded" />
                                    <input placeholder="Year" value={edu.year} onChange={(e) => updateEducation(index, 'year', e.target.value)} className="text-sm border-gray-300 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* SKILLS FORM */}
                {activeTab === 'skills' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900">Skills</h3>
                        {data.skills?.map((cat, index) => (
                            <div key={index} className="p-3 border rounded bg-gray-50">
                                <input
                                    value={cat.category}
                                    onChange={(e) => {
                                        const newSkills = [...data.skills];
                                        newSkills[index].category = e.target.value;
                                        setData({ ...data, skills: newSkills });
                                    }}
                                    className="font-bold text-sm mb-2 border-gray-300 rounded w-full"
                                />
                                <textarea
                                    value={cat.items.join(', ')}
                                    onChange={(e) => {
                                        const newSkills = [...data.skills];
                                        newSkills[index].items = e.target.value.split(',').map(s => s.trim());
                                        setData({ ...data, skills: newSkills });
                                    }}
                                    className="w-full text-sm border-gray-300 rounded h-20 p-2"
                                    placeholder="Comma separated skills..."
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* PROJECTS FORM */}
                {activeTab === 'projects' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Projects</h3>
                            <button
                                onClick={() => setData(prev => ({ ...prev, projects: [...(prev.projects || []), { name: "", description: "" }] }))}
                                className="text-sm text-blue-600 font-medium"
                            >
                                + Add Project
                            </button>
                        </div>
                        {data.projects?.map((proj, index) => (
                            <div key={index} className="p-3 border rounded bg-gray-50">
                                <input
                                    placeholder="Project Name"
                                    value={proj.name}
                                    onChange={(e) => {
                                        const newProj = [...data.projects];
                                        newProj[index].name = e.target.value;
                                        setData({ ...data, projects: newProj });
                                    }}
                                    className="font-bold text-sm mb-2 border-gray-300 rounded w-full"
                                />
                                <textarea
                                    placeholder="Description"
                                    value={proj.description}
                                    onChange={(e) => {
                                        const newProj = [...data.projects];
                                        newProj[index].description = e.target.value;
                                        setData({ ...data, projects: newProj });
                                    }}
                                    className="w-full text-sm border-gray-300 rounded h-20 p-2"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
