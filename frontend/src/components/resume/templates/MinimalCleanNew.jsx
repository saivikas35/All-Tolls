/**
 * Creative Modern - Stylish design with accent elements
 */
export default function CreativeModern({ data }) {
    return (
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', backgroundColor: '#fafafa', minHeight: '100%' }}>
            {/* Header with accent bar */}
            <div style={{ backgroundColor: '#0f172a', padding: '35px 40px', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: 'rgba(34, 211, 238, 0.1)'
                }}></div>

                <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'white', margin: '0', position: 'relative' }}>
                    {data.header?.name}
                </h1>
                <div style={{ fontSize: '15px', color: '#22d3ee', fontWeight: '600', marginTop: '8px', position: 'relative' }}>
                    {data.header?.title}
                </div>
                <div style={{ fontSize: '10px', color: '#cbd5e1', marginTop: '12px', display: 'flex', gap: '20px', position: 'relative' }}>
                    <span>{data.header?.email}</span>
                    <span>{data.header?.phone}</span>
                    <span>{data.header?.location}</span>
                </div>
            </div>

            <div style={{ padding: '35px 40px' }}>
                {/* Professional Summary */}
                {data.summary && (
                    <div style={{ marginBottom: '30px' }}>
                        <h2 style={{
                            fontSize: '15px',
                            fontWeight: '800',
                            color: '#0f172a',
                            marginBottom: '15px',
                            position: 'relative',
                            paddingLeft: '15px'
                        }}>
                            <span style={{
                                position: 'absolute',
                                left: '0',
                                top: '0',
                                bottom: '0',
                                width: '5px',
                                background: '#22d3ee',
                                borderRadius: '3px'
                            }}></span>
                            SUMMARY
                        </h2>
                        <div style={{ fontSize: '11px', color: '#475569', lineHeight: '1.7' }}>
                            {data.summary}
                        </div>
                    </div>
                )}

                {/* Experience */}
                <div style={{ marginBottom: '30px' }}>
                    <h2 style={{
                        fontSize: '15px',
                        fontWeight: '800',
                        color: '#0f172a',
                        marginBottom: '20px',
                        position: 'relative',
                        paddingLeft: '15px'
                    }}>
                        <span style={{
                            position: 'absolute',
                            left: '0',
                            top: '0',
                            bottom: '0',
                            width: '5px',
                            background: '#22d3ee',
                            borderRadius: '3px'
                        }}></span>
                        EXPERIENCE
                    </h2>

                    {data.experience?.map((job, i) => (
                        <div key={i} style={{
                            marginBottom: '25px',
                            backgroundColor: 'white',
                            padding: '18px',
                            borderRadius: '8px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                            borderLeft: '3px solid #22d3ee'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <div style={{ fontWeight: '700', fontSize: '13px', color: '#0f172a' }}>{job.role}</div>
                                <div style={{
                                    fontSize: '9px', color: '#94a3b8', fontWeight: '600',
                                    backgroundColor: '#f1f5f9',
                                    padding: '4px 10px',
                                    borderRadius: '12px'
                                }}>
                                    {job.start} - {job.end}
                                </div>
                            </div>
                            <div style={{ fontSize: '11px', color: '#22d3ee', marginBottom: '12px', fontWeight: '600' }}>
                                {job.company}
                            </div>
                            <ul style={{ margin: '0 0 0 18px', lineHeight: '1.7' }}>
                                {job.points?.slice(0, 2).map((p, j) => (
                                    <li key={j} style={{ fontSize: '10px', color: '#475569', marginBottom: '6px' }}>{p}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Projects */}
                {data.projects && data.projects.length > 0 && (
                    <div style={{ marginBottom: '30px' }}>
                        <h2 style={{
                            fontSize: '15px',
                            fontWeight: '800',
                            color: '#0f172a',
                            marginBottom: '20px',
                            position: 'relative',
                            paddingLeft: '15px'
                        }}>
                            <span style={{
                                position: 'absolute',
                                left: '0',
                                top: '0',
                                bottom: '0',
                                width: '5px',
                                background: '#22d3ee',
                                borderRadius: '3px'
                            }}></span>
                            PROJECTS
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            {data.projects.map((project, i) => (
                                <div key={i} style={{
                                    backgroundColor: 'white',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                    borderTop: '3px solid #22d3ee'
                                }}>
                                    <div style={{ fontWeight: '700', fontSize: '12px', color: '#0f172a', marginBottom: '4px' }}>
                                        {project.name}
                                    </div>
                                    <div style={{ fontSize: '10px', color: '#475569', lineHeight: '1.5' }}>
                                        {project.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Bottom Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {/* Education */}
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                    }}>
                        <h2 style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', marginBottom: '15px' }}>
                            EDUCATION
                        </h2>
                        {data.education?.map((edu, i) => (
                            <div key={i} style={{ marginBottom: '12px' }}>
                                <div style={{ fontSize: '11px', fontWeight: '700', color: '#0f172a' }}>{edu.degree}</div>
                                <div style={{ fontSize: '10px', color: '#64748b', marginTop: '3px' }}>{edu.institution}</div>
                                <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '2px' }}>{edu.year}</div>
                            </div>
                        ))}
                    </div>

                    {/* Skills */}
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                    }}>
                        <h2 style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', marginBottom: '15px' }}>
                            SKILLS
                        </h2>
                        {data.skills?.slice(0, 2).map((sg, i) => (
                            <div key={i} style={{ marginBottom: '12px' }}>
                                <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>
                                    {sg.category}
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                    {sg.items?.slice(0, 4).map((skill, j) => (
                                        <span key={j} style={{
                                            fontSize: '9px',
                                            backgroundColor: '#ecfeff',
                                            color: '#0891b2',
                                            padding: '4px 10px',
                                            borderRadius: '4px',
                                            fontWeight: '600'
                                        }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Certifications (Full Width) */}
                {data.certifications && data.certifications.length > 0 && (
                    <div style={{ marginTop: '20px' }}>
                        <h2 style={{
                            fontSize: '15px',
                            fontWeight: '800',
                            color: '#0f172a',
                            marginBottom: '15px',
                            position: 'relative',
                            paddingLeft: '15px'
                        }}>
                            <span style={{
                                position: 'absolute',
                                left: '0',
                                top: '0',
                                bottom: '0',
                                width: '5px',
                                background: '#22d3ee',
                                borderRadius: '3px'
                            }}></span>
                            CERTIFICATIONS
                        </h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {data.certifications.map((cert, i) => (
                                <div key={i} style={{
                                    fontSize: '10px',
                                    backgroundColor: '#ecfeff',
                                    color: '#0891b2',
                                    padding: '6px 14px',
                                    borderRadius: '6px',
                                    fontWeight: '600',
                                    border: '1px solid #06b6d4'
                                }}>
                                    {cert}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
