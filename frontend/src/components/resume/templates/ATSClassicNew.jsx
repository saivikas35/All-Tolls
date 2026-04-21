/**
 * Modern Professional - ATS Optimized
 * Purpose: Software Engineer / Technical
 * Hierarchy: 4-Level Typography
 */
import { highlightImpactNumbers } from '../../../lib/highlightNumbers';

export default function ModernProfessional({ data }) {
    // Styling Constants
    const styles = {
        page: {
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            fontSize: '11px',
            lineHeight: '1.6',
            color: '#374151', // Gray-700
            background: 'white',
            padding: '35px 40px', // Reduced padding for density
            minHeight: '100%', // Changed from height to minHeight to handle overflow
            position: 'relative'
        },
        // Level 1: Name (Strongest)
        name: {
            fontSize: '36px',
            fontWeight: '800',
            color: '#111827', // Gray-900
            margin: '0 0 6px 0',
            letterSpacing: '-0.02em',
            lineHeight: '1.2'
        },
        // Level 2: Section Headers
        header: {
            fontSize: '14px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#111827',
            borderBottom: '1px solid #E5E7EB', // Gray-200
            paddingBottom: '8px',
            marginBottom: '16px',
            marginTop: '24px' // Subtle separation
        },
        // Level 3: Job Title & Company
        role: {
            fontSize: '13px',
            fontWeight: '700',
            color: '#000000',
            margin: '0'
        },
        company: {
            fontSize: '12px',
            fontWeight: '600',
            color: '#2563EB', // Blue-600 (Accent)
            margin: '2px 0 0 0'
        },
        // Level 4: Body Text
        bullet: {
            marginBottom: '6px',
            position: 'relative',
            paddingLeft: '12px'
        },
        meta: {
            fontSize: '11px',
            color: '#6B7280', // Gray-500
            fontWeight: '500'
        },
        skillPill: {
            background: '#F3F4F6', // Gray-100
            color: '#374151',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: '600',
            display: 'inline-block',
            margin: '0 6px 6px 0',
            border: '1px solid #E5E7EB'
        }
    };

    return (
        <div style={styles.page}>
            {/* Page Number (Subtle Detail) */}
            <div style={{ position: 'absolute', bottom: '15px', left: '0', right: '0', textAlign: 'center', fontSize: '9px', color: '#9CA3AF' }}>
                1
            </div>

            {/* HEADER */}
            <div style={{ marginBottom: '25px' }}>
                <h1 style={styles.name}>{data.header?.name || 'Your Name'}</h1>
                <div style={{ fontSize: '15px', color: '#4B5563', fontWeight: '500', marginBottom: '12px' }}>
                    {data.header?.title}
                </div>

                {/* Contact Info - Single Line with Separators */}
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '16px', fontSize: '11px', color: '#4B5563' }}>
                    {data.header?.email && (
                        <span className="flex items-center gap-1.5">
                            ✉️ <span style={{ color: '#111' }}>{data.header.email}</span>
                        </span>
                    )}
                    {data.header?.phone && (
                        <span className="flex items-center gap-1.5">
                            📱 <span style={{ color: '#111' }}>{data.header.phone}</span>
                        </span>
                    )}
                    {data.header?.location && (
                        <span className="flex items-center gap-1.5">
                            📍 <span style={{ color: '#111' }}>{data.header.location}</span>
                        </span>
                    )}
                    {data.header?.linkedin && (
                        <span className="flex items-center gap-1.5">
                            🔗 <span style={{ color: '#2563EB', textDecoration: 'none' }}>{data.header.linkedin.replace('https://', '')}</span>
                        </span>
                    )}
                </div>
            </div>

            {/* PROFESSIONAL SUMMARY */}
            {data.summary && (
                <div style={{ marginBottom: '20px' }}>
                    <div style={styles.header}>Professional Summary</div>
                    <div style={{ fontSize: '11px', color: '#374151', lineHeight: '1.6' }}>
                        {data.summary}
                    </div>
                </div>
            )}

            {/* TECHNICAL SKILLS (Top Priority for Engineer) */}
            {data.skills && data.skills.length > 0 && (
                <div>
                    <div style={styles.header}>Technical Skills</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {data.skills.map((group, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'baseline' }}>
                                <span style={{ width: '120px', fontSize: '11px', fontWeight: '700', color: '#111', flexShrink: 0 }}>
                                    {group.category}:
                                </span>
                                <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '0' }}>
                                    {group.items.map((skill, i) => (
                                        <span key={i} style={{ fontSize: '11px', color: '#374151', marginRight: '4px' }}>
                                            {skill}{i < group.items.length - 1 ? ' • ' : ''}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* EXPERIENCE (Dense & Detailed) */}
            {data.experience && data.experience.length > 0 && (
                <div>
                    <div style={styles.header}>Professional Experience</div>
                    {data.experience.map((job, i) => (
                        <div key={i} style={{ marginBottom: i < data.experience.length - 1 ? '20px' : '0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                                <div>
                                    <div style={styles.role}>{job.role}</div>
                                    <div style={styles.company}>{job.company}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#111' }}>
                                        {job.start} – {job.end}
                                    </div>
                                    <div style={styles.meta}>{job.location}</div>
                                </div>
                            </div>

                            <ul style={{ margin: '8px 0 0 0', padding: 0, listStyle: 'none' }}>
                                {job.points?.map((point, idx) => (
                                    <li key={idx} style={styles.bullet}>
                                        <span style={{ position: 'absolute', left: 0, top: '6px', width: '4px', height: '4px', background: '#9CA3AF', borderRadius: '50%' }}></span>
                                        <span>{highlightImpactNumbers(point)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {/* PROJECTS (Critical for Engineers) */}
            {data.projects && data.projects.length > 0 && (
                <div>
                    <div style={styles.header}>Key Projects</div>
                    {data.projects.map((project, i) => (
                        <div key={i} style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#111' }}>{project.name}</span>
                                    {project.link && (
                                        <span style={{ fontSize: '10px', color: '#2563EB' }}>Let's see ↗</span>
                                    )}
                                </div>
                                <div style={styles.meta}>{project.year}</div>
                            </div>
                            <div style={{ fontSize: '11px', color: '#374151', marginTop: '2px' }}>
                                {project.description}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* EDUCATION */}
            {data.education && data.education.length > 0 && (
                <div>
                    <div style={styles.header}>Education</div>
                    {data.education.map((edu, i) => (
                        <div key={i} style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ fontSize: '12px', fontWeight: '700', color: '#111' }}>{edu.institution}</div>
                                <div style={{ fontSize: '11px', fontWeight: '600', color: '#111' }}>{edu.year}</div>
                            </div>
                            <div style={{ fontSize: '11px', color: '#4B5563' }}>{edu.degree}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* CERTIFICATIONS (Horizontal List for Space Efficiency) */}
            {data.certifications && data.certifications.length > 0 && (
                <div>
                    <div style={styles.header}>Certifications</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        {data.certifications.map((cert, i) => (
                            <div key={i} style={{
                                fontSize: '10px',
                                background: '#F9FAFB',
                                border: '1px solid #E5E7EB',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                color: '#374151',
                                fontWeight: '500'
                            }}>
                                {cert}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
