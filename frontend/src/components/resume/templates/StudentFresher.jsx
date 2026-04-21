/**
 * Fresh Graduate - Education First
 * Purpose: Entry Level / academic focus
 * Hierarchy: 4-Level Typography
 */
import { highlightImpactNumbers } from '../../../lib/highlightNumbers';

export default function StudentFresher({ data }) {
    // Styling Constants
    const styles = {
        page: {
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            fontSize: '11px',
            lineHeight: '1.6',
            color: '#374151',
            background: 'white',
            padding: '35px 40px',
            height: '100%',
            position: 'relative'
        },
        name: {
            fontSize: '32px', // Slightly smaller than pro
            fontWeight: '800',
            color: '#111827',
            margin: '0 0 4px 0',
            textAlign: 'center'
        },
        header: {
            fontSize: '13px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#7C3AED', // Purple accent for modern feel
            borderBottom: '2px solid #F3F4F6',
            paddingBottom: '8px',
            marginBottom: '16px',
            marginTop: '24px',
            textAlign: 'center'
        },
        subHeader: {
            fontSize: '15px',
            color: '#4B5563',
            textAlign: 'center',
            marginBottom: '16px',
            fontWeight: '500'
        },
        role: {
            fontSize: '13px',
            fontWeight: '700',
            color: '#000',
        },
        company: {
            fontSize: '12px',
            fontWeight: '600',
            color: '#7C3AED', // Purple accent
        },
        bullet: {
            marginBottom: '6px',
            position: 'relative',
            paddingLeft: '14px'
        },
        skillSection: {
            background: '#F9FAFB',
            border: '1px solid #F3F4F6',
            borderRadius: '8px',
            padding: '16px',
            marginTop: '10px'
        }
    };

    return (
        <div style={styles.page}>
            {/* Page Number */}
            <div style={{ position: 'absolute', bottom: '15px', left: '0', right: '0', textAlign: 'center', fontSize: '9px', color: '#9CA3AF' }}>1</div>

            {/* HEADER (Centered for Grads) */}
            <div style={{ marginBottom: '30px' }}>
                <h1 style={styles.name}>{data.header?.name}</h1>
                <div style={styles.subHeader}>{data.header?.title}</div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '11px', color: '#6B7280' }}>
                    {data.header?.email && <span>✉️ {data.header.email}</span>}
                    {data.header?.phone && <span>📱 {data.header.phone}</span>}
                    {data.header?.linkedin && <span>🔗 {data.header.linkedin.replace('https://', '')}</span>}
                    {data.header?.portfolio && <span>🌐 {data.header.portfolio.replace('https://', '')}</span>}
                </div>
            </div>

            {/* SUMMARY (Optional for Grads) */}
            {data.summary && (
                <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                    <div style={{ ...styles.header, marginTop: 0, marginBottom: '12px' }}>Professional Summary</div>
                    <div style={{ fontSize: '11px', color: '#4B5563', lineHeight: '1.6', maxWidth: '90%', margin: '0 auto' }}>
                        {data.summary}
                    </div>
                </div>
            )}

            {/* EDUCATION (Top Priority for Grads) - Enhanced Detail */}
            {data.education && data.education.length > 0 && (
                <div>
                    <div style={styles.header}>Education</div>
                    {data.education.map((edu, i) => (
                        <div key={i} style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#111' }}>{edu.institution}</div>
                                <div style={{ fontSize: '12px', fontWeight: '700', color: '#111' }}>{edu.year}</div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '2px' }}>
                                <div style={{ fontSize: '13px', color: '#4B5563', fontWeight: '600' }}>{edu.degree}</div>
                                <div style={{ fontSize: '11px', color: '#6B7280' }}>{edu.location}</div>
                            </div>

                            {/* Coursework & GPA - Crucial for Students */}
                            {edu.details && (
                                <div style={{ marginTop: '8px', fontSize: '11px', color: '#374151', lineHeight: '1.6' }}>
                                    {edu.details.map((detail, idx) => (
                                        <div key={idx}>• {detail}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* SKILLS - Prominent Box Layout */}
            {data.skills && data.skills.length > 0 && (
                <div style={styles.skillSection}>
                    <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#4B5563', marginBottom: '12px', textAlign: 'center' }}>
                        Technical Skills
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
                        {data.skills.map(group => group.items).flat().map((skill, i) => (
                            <span key={i} style={{
                                background: 'white',
                                border: '1px solid #E5E7EB',
                                padding: '4px 10px',
                                borderRadius: '15px',
                                fontSize: '11px',
                                fontWeight: '500',
                                color: '#111'
                            }}>
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* PROJECTS (Second Priority) */}
            {data.projects && data.projects.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                    <div style={styles.header}>Notable Projects</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {data.projects.map((project, i) => (
                            <div key={i} style={{ background: '#FFF', border: '1px solid #F3F4F6', padding: '12px', borderRadius: '8px' }}>
                                <div style={{ fontSize: '12px', fontWeight: '700', color: '#111', marginBottom: '4px' }}>
                                    {project.name}
                                </div>
                                <div style={{ fontSize: '11px', color: '#4B5563', lineHeight: '1.5', height: '48px', overflow: 'hidden' }}>
                                    {project.description}
                                </div>
                                {project.link && (
                                    <div style={{ marginTop: '6px', fontSize: '10px', color: '#7C3AED' }}>
                                        {project.link} ↗
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* EXPERIENCE (Internships) */}
            {data.experience && data.experience.length > 0 && (
                <div>
                    <div style={styles.header}>Experience</div>
                    {data.experience.map((job, i) => (
                        <div key={i} style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <div>
                                    <span style={styles.role}>{job.role}</span>
                                    <span style={{ margin: '0 6px', color: '#D1D5DB' }}>|</span>
                                    <span style={styles.company}>{job.company}</span>
                                </div>
                                <div style={{ fontSize: '11px', fontWeight: '600' }}>{job.start} – {job.end}</div>
                            </div>

                            <ul style={{ margin: '6px 0 0 0', padding: 0, listStyle: 'none' }}>
                                {job.points?.map((point, idx) => (
                                    <li key={idx} style={styles.bullet}>
                                        <span style={{ position: 'absolute', left: 0, top: '6px', width: '4px', height: '4px', background: '#D1D5DB', borderRadius: '50%' }}></span>
                                        <span>{highlightImpactNumbers(point)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {/* AWARDS */}
            {data.awards && (
                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '11px', color: '#4B5563' }}>
                    <span style={{ fontWeight: '700' }}>🏆 Awards: </span>
                    {data.awards.join(' • ')}
                </div>
            )}
        </div>
    );
}
