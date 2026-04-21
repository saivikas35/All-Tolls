/**
 * Executive Leadership - Senior/Manager Level
 * Purpose: Leadership, VP, C-Suite
 * Hierarchy: Serif Fonts, Conservative Spacing, Impact Focus
 */
import { highlightImpactNumbers } from '../../../lib/highlightNumbers';

export default function ExecutiveLeadership({ data }) {
    const styles = {
        page: {
            fontFamily: "'Georgia', 'Times New Roman', serif", // Traditional Serif
            fontSize: '11px',
            lineHeight: '1.7', // Relaxed line height for readability
            color: '#333',
            background: 'white',
            padding: '40px 50px', // More white space
            height: '100%',
            position: 'relative'
        },
        name: {
            fontSize: '32px',
            fontWeight: '700', // Serif bold is often lighter
            color: '#111',
            borderBottom: '2px solid #111',
            paddingBottom: '16px',
            marginBottom: '16px',
            letterSpacing: '-0.01em'
        },
        header: {
            fontSize: '14px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#111',
            borderBottom: '1px solid #E5E7EB',
            paddingBottom: '6px',
            marginBottom: '16px',
            marginTop: '28px',
            fontFamily: "'Inter', sans-serif" // Sans-serif headers for contrast
        },
        role: {
            fontSize: '14px', // Larger for executives
            fontWeight: '700',
            color: '#000',
            fontFamily: "'Inter', sans-serif"
        },
        company: {
            fontSize: '13px',
            fontWeight: '500',
            color: '#4B5563',
            fontStyle: 'italic'
        },
        summary: {
            fontSize: '12px', // Larger summary
            lineHeight: '1.8',
            color: '#333',
            fontStyle: 'italic',
            marginBottom: '24px',
            padding: '16px',
            background: '#F9FAFB', // Subtle background
            borderLeft: '3px solid #111'
        },
        bullet: {
            marginBottom: '8px',
            position: 'relative',
            paddingLeft: '16px'
        }
    };

    return (
        <div style={styles.page}>
            {/* Page Number */}
            <div style={{ position: 'absolute', bottom: '20px', right: '50px', fontSize: '10px', color: '#9CA3AF', fontFamily: "'Inter', sans-serif" }}>
                Page 1
            </div>

            {/* HEADER - Traditional & Authoritative */}
            <div style={{ marginBottom: '30px' }}>
                <h1 style={styles.name}>{data.header?.name}</h1>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={{ fontSize: '16px', color: '#444', fontWeight: '400', fontFamily: "'Inter', sans-serif" }}>
                        {data.header?.title}
                    </div>

                    <div style={{ textAlign: 'right', fontSize: '11px', color: '#555', fontFamily: "'Inter', sans-serif", lineHeight: '1.5' }}>
                        <div>{data.header?.email} • {data.header?.phone}</div>
                        <div>{data.header?.location}</div>
                        {data.header?.linkedin && <div style={{ color: '#2563EB' }}>{data.header.linkedin.replace('https://', '')}</div>}
                    </div>
                </div>
            </div>

            {/* EXECUTIVE SUMMARY - Prominent */}
            {data.summary && (
                <div style={styles.summary}>
                    {data.summary}
                </div>
            )}

            {/* EXPERIENCE - Focus on Impact */}
            {data.experience && data.experience.length > 0 && (
                <div>
                    <div style={styles.header}>Professional Experience</div>
                    {data.experience.map((job, i) => (
                        <div key={i} style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                                <div>
                                    <div style={styles.role}>{job.role}</div>
                                    <div style={styles.company}>{job.company}</div>
                                </div>
                                <div style={{ textAlign: 'right', fontFamily: "'Inter', sans-serif" }}>
                                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#111' }}>{job.start} – {job.end}</div>
                                    <div style={{ fontSize: '11px', color: '#666' }}>{job.location}</div>
                                </div>
                            </div>

                            <ul style={{ margin: '10px 0 0 0', padding: 0, listStyle: 'none' }}>
                                {job.points?.map((point, idx) => (
                                    <li key={idx} style={styles.bullet}>
                                        <span style={{ position: 'absolute', left: 0, top: '8px', width: '4px', height: '4px', background: '#333', borderRadius: '0' }}></span> {/* Square bullet */}
                                        <span>{highlightImpactNumbers(point)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {/* EDUCATION - Brief */}
            {data.education && data.education.length > 0 && (
                <div>
                    <div style={styles.header}>Education</div>
                    <div style={{ display: 'flex', gap: '40px' }}>
                        {data.education.map((edu, i) => (
                            <div key={i}>
                                <div style={{ fontSize: '12px', fontWeight: '700', fontFamily: "'Inter', sans-serif" }}>{edu.institution}</div>
                                <div style={{ fontSize: '12px' }}>{edu.degree}</div>
                                <div style={{ fontSize: '11px', color: '#666' }}>{edu.year}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SKILLS - Subtle, not pills */}
            {data.skills && data.skills.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                    <div style={styles.header}>Core Competencies</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'x' }}>
                        {data.skills.map((group, i) => (
                            <div key={i} style={{ width: '50%', marginBottom: '12px', paddingRight: '15px' }}>
                                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#666', marginBottom: '4px', fontFamily: "'Inter', sans-serif" }}>
                                    {group.category}
                                </div>
                                <div style={{ fontSize: '11px', lineHeight: '1.5' }}>
                                    {group.items.join(', ')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
