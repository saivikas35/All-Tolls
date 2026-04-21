/**
 * Minimalist Mono - Developer / Tech Focused
 * Style: Monospace, high contrast, clean
 */
export default function MinimalistMono({ data }) {
    const styles = {
        page: {
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: '11px',
            color: '#000',
            background: 'white',
            padding: '40px',
            minHeight: '100%'
        },
        header: {
            marginBottom: '30px',
            borderLeft: '4px solid #000',
            paddingLeft: '15px'
        },
        name: {
            fontSize: '28px',
            fontWeight: 'bold',
            letterSpacing: '-1px',
            marginBottom: '5px'
        },
        role: {
            fontSize: '14px',
            marginBottom: '10px',
            textTransform: 'uppercase'
        },
        sectionCtx: {
            marginTop: '25px',
            display: 'grid',
            gridTemplateColumns: '120px 1fr',
            gap: '20px'
        },
        sectionTitle: {
            fontSize: '12px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            textAlign: 'right',
            paddingTop: '3px' // Align with text
        },
        item: {
            marginBottom: '15px'
        },
        itemHead: {
            fontWeight: 'bold',
            marginBottom: '2px',
            display: 'flex',
            justifyContent: 'space-between'
        },
        monoTag: {
            background: '#eee',
            padding: '2px 6px',
            fontSize: '10px',
            borderRadius: '2px',
            marginRight: '5px',
            display: 'inline-block',
            marginBottom: '4px'
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <div style={styles.name}>{data.header?.name}</div>
                <div style={styles.role}>{'>'} {data.header?.title}</div>
                <div style={{ fontSize: '11px' }}>
                    {data.header?.email} / {data.header?.phone} / {data.header?.location}
                </div>
            </div>

            {/* Professional Summary */}
            {data.summary && (
                <div style={styles.sectionCtx}>
                    <div style={styles.sectionTitle}>// Professional Summary</div>
                    <div style={{ fontSize: '11px', lineHeight: '1.6', fontFamily: 'monospace' }}>
                        {data.summary}
                    </div>
                </div>
            )}

            {/* Experience */}
            <div style={styles.sectionCtx}>
                <div style={styles.sectionTitle}>// Experience</div>
                <div>
                    {data.experience?.map((job, i) => (
                        <div key={i} style={styles.item}>
                            <div style={styles.itemHead}>
                                <span>{job.role} @ {job.company}</span>
                                <span>{job.start}-{job.end}</span>
                            </div>
                            <ul style={{ paddingLeft: '15px', marginTop: '5px' }}>
                                {job.points?.map((p, j) => (
                                    <li key={j} style={{ marginBottom: '4px' }}>{p}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
                <div style={styles.sectionCtx}>
                    <div style={styles.sectionTitle}>// Projects</div>
                    <div>
                        {data.projects.map((proj, i) => (
                            <div key={i} style={styles.item}>
                                <div style={{ fontWeight: 'bold' }}>{proj.name}</div>
                                <div>{proj.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            <div style={styles.sectionCtx}>
                <div style={styles.sectionTitle}>// Stack</div>
                <div>
                    {data.skills?.map((grp, i) => (
                        <div key={i} style={{ marginBottom: '8px' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '10px', marginBottom: '4px' }}>{grp.category}</div>
                            <div>
                                {grp.items?.map((sk, j) => (
                                    <span key={j} style={styles.monoTag}>{sk}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Education */}
            <div style={styles.sectionCtx}>
                <div style={styles.sectionTitle}>// Education</div>
                <div>
                    {data.education?.map((edu, i) => (
                        <div key={i} style={{ marginBottom: '5px' }}>
                            <span style={{ fontWeight: 'bold' }}>{edu.degree}</span>, {edu.institution} ({edu.year})
                        </div>
                    ))}
                </div>
            </div>

            {/* Certifications */}
            {data.certifications && data.certifications.length > 0 && (
                <div style={styles.sectionCtx}>
                    <div style={styles.sectionTitle}>// Certifications</div>
                    <div>
                        {data.certifications.map((cert, i) => (
                            <div key={i} style={{
                                fontSize: '11px',
                                marginBottom: '4px',
                                fontFamily: 'monospace'
                            }}>
                                → {cert}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
