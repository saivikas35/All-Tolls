/**
 * Elegant Sidebar - Sophisticated dark sidebar design
 */
export default function ElegantSidebar({ data }) {
    return (
        <div style={{ display: 'flex', fontFamily: "'Helvetica Neue', Helvetica, sans-serif", fontSize: '11px', minHeight: '100%' }}>
            {/* LEFT SIDEBAR */}
            <div style={{
                width: '35%',
                background: '#1e3a8a',
                color: 'white',
                padding: '40px 25px',
                position: 'relative'
            }}>
                {/* Decorative element */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100px',
                    height: '100px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '0 0 0 100%'
                }}></div>

                {/* Profile */}
                <div style={{ marginBottom: '35px', position: 'relative' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '6px', lineHeight: '1.2' }}>
                        {data.header?.name}
                    </h1>
                    <div style={{
                        fontSize: '13px',
                        color: '#93c5fd',
                        fontWeight: '600',
                        letterSpacing: '0.5px'
                    }}>
                        {data.header?.title}
                    </div>
                </div>

                {/* Contact */}
                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        marginBottom: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: '#93c5fd'
                    }}>
                        Contact
                    </h3>
                    <div style={{ fontSize: '10px', lineHeight: '1.8', color: '#e0e7ff' }}>
                        <div style={{ marginBottom: '6px' }}>✉ {data.header?.email}</div>
                        <div style={{ marginBottom: '6px' }}>📱 {data.header?.phone}</div>
                        <div>📍 {data.header?.location}</div>
                    </div>
                </div>

                {/* Skills */}
                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        marginBottom: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: '#93c5fd'
                    }}>
                        Skills
                    </h3>
                    {data.skills?.map((sg, i) => (
                        <div key={i} style={{ marginBottom: '15px' }}>
                            <div style={{ fontSize: '10px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>
                                {sg.category}
                            </div>
                            {sg.items?.slice(0, 4).map((skill, j) => (
                                <div key={j} style={{
                                    fontSize: '9px',
                                    color: '#e0e7ff',
                                    marginBottom: '4px',
                                    paddingLeft: '8px',
                                    borderLeft: '2px solid #60a5fa'
                                }}>
                                    {skill}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Education */}
                <div>
                    <h3 style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        marginBottom: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: '#93c5fd'
                    }}>
                        Education
                    </h3>
                    {data.education?.map((edu, i) => (
                        <div key={i} style={{ marginBottom: '15px' }}>
                            <div style={{ fontSize: '10px', fontWeight: '700', color: 'white' }}>{edu.degree}</div>
                            <div style={{ fontSize: '9px', color: '#e0e7ff', marginTop: '3px' }}>{edu.institution}</div>
                            <div style={{ fontSize: '9px', color: '#93c5fd', marginTop: '2px' }}>{edu.year}</div>
                        </div>
                    ))}
                </div>

                {/* Certifications */}
                {data.certifications && data.certifications.length > 0 && (
                    <div style={{ marginTop: '30px' }}>
                        <h3 style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            marginBottom: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            color: '#93c5fd'
                        }}>
                            Certifications
                        </h3>
                        {data.certifications.map((cert, i) => (
                            <div key={i} style={{
                                fontSize: '9px',
                                color: '#e0e7ff',
                                marginBottom: '6px',
                                paddingLeft: '8px',
                                borderLeft: '2px solid #6a5fa',
                                lineHeight: '1.4'
                            }}>
                                {cert}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* RIGHT MAIN */}
            <div style={{ width: '65%', padding: '40px 35px', backgroundColor: '#ffffff' }}>
                {/* Professional Summary */}
                {data.summary && (
                    <div style={{ marginBottom: '35px' }}>
                        <h2 style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            marginBottom: '15px',
                            color: '#1e3a8a',
                            textTransform: 'uppercase',
                            letterSpacing: '1.5px',
                            borderBottom: '4px solid #1e40af',
                            paddingBottom: '10px'
                        }}>
                            Professional Summary
                        </h2>
                        <div style={{ fontSize: '11px', color: '#475569', lineHeight: '1.8' }}>
                            {data.summary}
                        </div>
                    </div>
                )}

                <h2 style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    marginBottom: '25px',
                    color: '#1e3a8a',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    borderBottom: '4px solid #1e40af',
                    paddingBottom: '10px'
                }}>
                    Professional Experience
                </h2>

                {data.experience?.map((job, i) => (
                    <div key={i} style={{ marginBottom: '28px', position: 'relative', paddingLeft: '20px' }}>
                        {/* Timeline dot */}
                        <div style={{
                            position: 'absolute',
                            left: '0',
                            top: '3px',
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: '#1e40af'
                        }}></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '4px' }}>
                            <div style={{ fontWeight: '700', fontSize: '13px', color: '#1e3a8a' }}>{job.role}</div>
                            <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '600' }}>
                                {job.start} - {job.end}
                            </div>
                        </div>
                        <div style={{ fontSize: '11px', color: '#3b82f6', marginBottom: '10px', fontWeight: '600' }}>
                            {job.company}
                        </div>
                        <ul style={{ marginLeft: '15px', lineHeight: '1.7' }}>
                            {job.points?.slice(0, 3).map((p, j) => (
                                <li key={j} style={{ fontSize: '10px', color: '#475569', marginBottom: '5px' }}>{p}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Publications (For Academic) */}
            {data.publications && data.publications.length > 0 && (
                <div style={{ marginBottom: '28px' }}>
                    <h2 style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        marginBottom: '20px',
                        color: '#1e3a8a',
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        borderBottom: '4px solid #1e40af',
                        paddingBottom: '10px'
                    }}>
                        Publications
                    </h2>
                    {data.publications.map((pub, i) => (
                        <div key={i} style={{ marginBottom: '12px', paddingLeft: '20px', position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                left: '0',
                                top: '6px',
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: '#93c5fd'
                            }}></div>
                            <div style={{ fontSize: '11px', color: '#334155', fontStyle: 'italic', lineHeight: '1.5' }}>
                                {pub}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Projects (For Portfolio) */}
            {data.projects && data.projects.length > 0 && (
                <div>
                    <h2 style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        marginBottom: '20px',
                        color: '#1e3a8a',
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        borderBottom: '4px solid #1e40af',
                        paddingBottom: '10px'
                    }}>
                        Key Projects
                    </h2>
                    {data.projects.map((proj, i) => (
                        <div key={i} style={{ marginBottom: '20px' }}>
                            <div style={{ fontWeight: '700', fontSize: '13px', color: '#1e3a8a', marginBottom: '4px' }}>
                                {proj.name}
                            </div>
                            <div style={{ fontSize: '11px', color: '#475569', lineHeight: '1.6' }}>
                                {proj.description}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
