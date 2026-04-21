/**
 * Ivy League - Classic, prestigious, serif-heavy design
 * Purpose: Banking, Law, Consulting, Academia
 */
export default function IvyLeague({ data }) {
    const styles = {
        page: {
            fontFamily: "'Times New Roman', Times, serif", // Classic Serif
            fontSize: '11px',
            lineHeight: '1.5',
            color: '#111',
            background: 'white',
            padding: '40px 50px',
            minHeight: '100%'
        },
        header: {
            textAlign: 'center',
            marginBottom: '20px',
            borderBottom: '1px solid #111',
            paddingBottom: '15px'
        },
        name: {
            fontSize: '24px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '8px',
            fontWeight: 'bold'
        },
        contact: {
            fontSize: '11px',
            fontStyle: 'italic'
        },
        sectionTitle: {
            fontSize: '12px',
            textTransform: 'uppercase',
            borderBottom: '1px solid #111',
            marginBottom: '10px',
            paddingBottom: '3px',
            marginTop: '20px',
            fontWeight: 'bold',
            letterSpacing: '0.5px'
        },
        jobHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '2px',
            fontWeight: 'bold'
        },
        jobSub: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '4px',
            fontStyle: 'italic'
        },
        bullet: {
            marginBottom: '3px',
            paddingLeft: '15px'
        }
    };

    return (
        <div style={styles.page}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.name}>{data.header?.name}</div>
                {data.header?.title && (
                    <div style={{ fontSize: '13px', textAlign: 'center', marginTop: '4px', fontWeight: '500', color: '#333' }}>
                        {data.header.title}
                    </div>
                )}
                <div style={styles.contact}>
                    {data.header?.email} • {data.header?.phone} • {data.header?.location}
                </div>
                {data.header?.linkedin && (
                    <div style={styles.contact}>
                        {data.header.linkedin}
                    </div>
                )}
            </div>

            {/* Education (Top for Ivy) */}
            {data.education && (
                <div>
                    <div style={styles.sectionTitle}>Education</div>
                    {data.education.map((edu, i) => (
                        <div key={i} style={{ marginBottom: '10px' }}>
                            <div style={styles.jobHeader}>
                                <span>{edu.institution}</span>
                                <span>{edu.location}</span>
                            </div>
                            <div style={styles.jobSub}>
                                <span>{edu.degree}</span>
                                <span>{edu.year}</span>
                            </div>
                            {edu.details && (
                                <div style={{ fontSize: '10px', marginTop: '2px' }}>
                                    {edu.details.map((d, j) => <div key={j}>• {d}</div>)}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Professional Summary */}
            {data.summary && (
                <div style={{ marginTop: '20px' }}>
                    <div style={styles.sectionTitle}>Professional Summary</div>
                    <div style={{ fontSize: '11px', lineHeight: '1.6', color: '#333' }}>
                        {data.summary}
                    </div>
                </div>
            )}

            {/* Experience */}
            {data.experience && (
                <div>
                    <div style={styles.sectionTitle}>Experience</div>
                    {data.experience.map((job, i) => (
                        <div key={i} style={{ marginBottom: '12px' }}>
                            <div style={styles.jobHeader}>
                                <span>{job.company}</span>
                                <span>{job.location}</span>
                            </div>
                            <div style={styles.jobSub}>
                                <span>{job.role}</span>
                                <span>{job.start} – {job.end}</span>
                            </div>
                            <ul style={{ margin: '0', padding: '0', listStyle: 'none' }}>
                                {job.points?.map((p, j) => (
                                    <li key={j} style={styles.bullet}>• {p}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {/* Projects (Ivy style - compact) */}
            {data.projects && data.projects.length > 0 && (
                <div>
                    <div style={styles.sectionTitle}>Leadership & Projects</div>
                    {data.projects.map((proj, i) => (
                        <div key={i} style={{ marginBottom: '8px' }}>
                            <div style={{ fontWeight: 'bold' }}>
                                {proj.name} {proj.link && <span style={{ fontWeight: 'normal', fontStyle: 'italic' }}> - {proj.link}</span>}
                            </div>
                            <div style={{ fontSize: '11px' }}>{proj.description}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Skills */}
            {data.skills && (
                <div>
                    <div style={styles.sectionTitle}>Skills & Interests</div>
                    {data.skills.map((grp, i) => (
                        <div key={i} style={{ marginBottom: '4px' }}>
                            <span style={{ fontWeight: 'bold' }}>{grp.category}: </span>
                            <span>{grp.items?.join(', ')}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Certifications */}
            {data.certifications && data.certifications.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <div style={styles.sectionTitle}>Certifications</div>
                    {data.certifications.map((cert, i) => (
                        <div key={i} style={{
                            fontSize: '11px',
                            marginBottom: '6px',
                            paddingLeft: '12px',
                            borderLeft: '2px solid #333',
                            lineHeight: '1.6'
                        }}>
                            {cert}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
