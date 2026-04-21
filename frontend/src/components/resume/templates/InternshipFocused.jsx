/**
 * Internship Focused Resume - Highlight coursework, skills, and potential
 */
export default function InternshipFocused({ data }) {
    return (
        <div style={{
            fontFamily: "'Roboto', 'Helvetica Neue', sans-serif",
            fontSize: '11px',
            backgroundColor: '#ffffff',
            padding: '38px 42px 28px',
            height: '100%'
        }}>
            {/* Header - Modern and clean */}
            <div style={{ marginBottom: '24px', borderLeft: '4px solid #10b981', paddingLeft: '16px' }}>
                <h1 style={{
                    fontSize: '30px',
                    fontWeight: '800',
                    margin: '0',
                    color: '#1a1a1a',
                    letterSpacing: '-0.4px'
                }}>
                    {data.header?.name}
                </h1>
                <div style={{ fontSize: '13px', color: '#10b981', fontWeight: '700', marginTop: '5px' }}>
                    {data.header?.title}
                </div>
                <div style={{ fontSize: '10px', color: '#666', marginTop: '8px' }}>
                    {data.header?.email} | {data.header?.phone} | {data.header?.location}
                </div>
            </div>

            {/* OBJECTIVE / SUMMARY - Important for internships */}
            {data.summary && (
                <div style={{ marginBottom: '20px' }}>
                    <h2 style={{
                        fontSize: '13px',
                        fontWeight: '800',
                        color: '#10b981',
                        marginBottom: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.7px'
                    }}>
                        Objective
                    </h2>
                    <p style={{ fontSize: '10px', color: '#555', lineHeight: '1.7', margin: 0 }}>
                        {data.summary}
                    </p>
                </div>
            )}

            {/* EDUCATION with GPA and Coursework */}
            <div style={{ marginBottom: '20px' }}>
                <h2 style={{
                    fontSize: '13px',
                    fontWeight: '800',
                    color: '#10b981',
                    marginBottom: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.7px',
                    borderBottom: '2px solid #e5e7eb',
                    paddingBottom: '5px'
                }}>
                    Education
                </h2>
                {data.education?.map((edu, i) => (
                    <div key={i} style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <div style={{ fontSize: '12px', fontWeight: '800', color: '#1a1a1a' }}>{edu.degree}</div>
                                <div style={{ fontSize: '11px', color: '#10b981', marginTop: '2px', fontWeight: '700' }}>
                                    {edu.institution}
                                </div>
                            </div>
                            <div style={{ fontSize: '10px', color: '#666', fontWeight: '600', textAlign: 'right' }}>
                                {edu.year}
                                {edu.gpa && <div style={{ marginTop: '2px' }}>GPA: <strong>{edu.gpa}</strong></div>}
                            </div>
                        </div>
                        {edu.coursework && (
                            <div style={{ fontSize: '9px', color: '#666', marginTop: '6px', paddingLeft: '12px' }}>
                                <strong>Relevant Coursework:</strong> {edu.coursework}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* SKILLS - Very prominent */}
            <div style={{ marginBottom: '20px', backgroundColor: '#f0fdf4', padding: '14px', borderRadius: '6px', border: '1px solid #10b981' }}>
                <h2 style={{
                    fontSize: '13px',
                    fontWeight: '800',
                    color: '#10b981',
                    marginBottom: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.7px'
                }}>
                    Technical Skills
                </h2>
                {data.skills?.map((sg, i) => (
                    <div key={i} style={{ marginBottom: '8px', display: 'flex', gap: '8px' }}>
                        <div style={{ fontSize: '10px', fontWeight: '700', color: '#047857', minWidth: '100px' }}>
                            {sg.category}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                {sg.items?.map((skill, j) => (
                                    <span key={j} style={{
                                        fontSize: '9px',
                                        backgroundColor: '#10b981',
                                        color: 'white',
                                        padding: '3px 8px',
                                        borderRadius: '10px',
                                        fontWeight: '600'
                                    }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* PROJECTS */}
            {data.projects && data.projects.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                    <h2 style={{
                        fontSize: '13px',
                        fontWeight: '800',
                        color: '#10b981',
                        marginBottom: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.7px',
                        borderBottom: '2px solid #e5e7eb',
                        paddingBottom: '5px'
                    }}>
                        Projects
                    </h2>
                    {data.projects.slice(0, 2).map((project, i) => (
                        <div key={i} style={{ marginBottom: '14px' }}>
                            <div style={{ fontWeight: '800', fontSize: '12px', color: '#1a1a1a' }}>{project.name}</div>
                            <div style={{ fontSize: '9px', color: '#10b981', marginTop: '2px', fontWeight: '600' }}>
                                {project.tech}
                            </div>
                            <ul style={{ margin: '8px 0 0 18px', lineHeight: '1.7' }}>
                                {project.points?.map((p, j) => {
                                    const highlightedText = p.replace(/(\$[\d,.]+[KMB]?|\d+%|\d+x|\d+[KMB]\+?|\d{2,})/g,
                                        '<strong style="color: #10b981; font-weight: 700;">$1</strong>');
                                    return (
                                        <li key={j} style={{ fontSize: '10px', color: '#555', marginBottom: '4px' }}>
                                            <span dangerouslySetInnerHTML={{ __html: highlightedText }} />
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {/* EXPERIENCE / INTERNSHIPS */}
            {data.experience && data.experience.length > 0 && (
                <div style={{ marginBottom: '18px' }}>
                    <h2 style={{
                        fontSize: '13px',
                        fontWeight: '800',
                        color: '#10b981',
                        marginBottom: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.7px',
                        borderBottom: '2px solid #e5e7eb',
                        paddingBottom: '5px'
                    }}>
                        Experience & Internships
                    </h2>
                    {data.experience.map((job, i) => (
                        <div key={i} style={{ marginBottom: '14px' }}>
                            <div style={{ fontWeight: '800', fontSize: '12px', color: '#1a1a1a' }}>{job.role}</div>
                            <div style={{ fontSize: '11px', color: '#10b981', marginTop: '2px', fontWeight: '700' }}>
                                {job.company}
                            </div>
                            <div style={{ fontSize: '9px', color: '#666', marginTop: '2px' }}>
                                {job.start} - {job.end}
                            </div>
                            <ul style={{ margin: '8px 0 0 18px', lineHeight: '1.7' }}>
                                {job.points?.slice(0, 3).map((p, j) => (
                                    <li key={j} style={{ fontSize: '10px', color: '#555', marginBottom: '4px' }}>{p}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {/* EXTRACURRICULAR / LEADERSHIP */}
            {data.extracurricular && data.extracurricular.length > 0 && (
                <div>
                    <h2 style={{
                        fontSize: '13px',
                        fontWeight: '800',
                        color: '#10b981',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.7px',
                        borderBottom: '2px solid #e5e7eb',
                        paddingBottom: '5px'
                    }}>
                        Leadership & Activities
                    </h2>
                    <ul style={{ margin: '0 0 0 18px', lineHeight: '1.8' }}>
                        {data.extracurricular.slice(0, 4).map((activity, i) => (
                            <li key={i} style={{ fontSize: '10px', color: '#555', marginBottom: '3px' }}>{activity}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
