/**
 * Academic / Research CV
 * Purpose: PhD, Research, Academic roles
 * Hierarchy: Dense, detailed, publication-heavy
 */
import { highlightImpactNumbers } from '../../../lib/highlightNumbers';

export default function AcademicResearchCV({ data }) {
    const styles = {
        page: {
            fontFamily: "'Georgia', serif",
            fontSize: '11px',
            lineHeight: '1.5',
            color: '#111',
            background: 'white',
            padding: '40px',
            height: '100%', // Allows for multi-page feel in preview
            position: 'relative'
        },
        name: {
            fontSize: '28px', // Smaller than corporate
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '4px'
        },
        contact: {
            textAlign: 'center',
            fontSize: '11px',
            marginBottom: '24px',
            color: '#333'
        },
        header: {
            fontSize: '12px',
            fontWeight: '700',
            textTransform: 'uppercase',
            borderBottom: '1px solid #000',
            color: '#000',
            marginBottom: '12px',
            marginTop: '20px',
            letterSpacing: '0.05em'
        },
        eduItem: {
            marginBottom: '12px',
            display: 'flex',
            justifyContent: 'space-between'
        },
        pubItem: {
            marginBottom: '8px',
            paddingLeft: '20px',
            textIndent: '-20px' // Hanging indent for citations
        },
        sidebar: {
            display: 'none' // Single column strictly
        }
    };

    return (
        <div style={styles.page}>
            {/* Page Number */}
            <div style={{ position: 'absolute', bottom: '20px', left: '0', width: '100%', textAlign: 'center', fontSize: '10px', color: '#666' }}>
                Page 1
            </div>

            {/* HEADER - Traditional Academic */}
            <h1 style={styles.name}>{data.header?.name}</h1>
            <div style={styles.contact}>
                {data.header?.title} • {data.header?.location}<br />
                {data.header?.email} • {data.header?.phone}
                {data.header?.linkedin && <span> • {data.header.linkedin.replace('https://', '')}</span>}
            </div>

            {/* RESEARCH SUMMARY */}
            {data.summary && (
                <div style={{ marginBottom: '20px' }}>
                    <div style={styles.header}>Research Interests</div>
                    <div style={{ fontSize: '11px', lineHeight: '1.6' }}>
                        {data.summary}
                    </div>
                </div>
            )}

            {/* EDUCATION - 1st Priority */}
            <div style={styles.header}>Education</div>
            {data.education && data.education.map((edu, i) => (
                <div key={i} style={styles.eduItem}>
                    <div>
                        <div style={{ fontWeight: '700' }}>{edu.degree}</div>
                        <div style={{ fontStyle: 'italic' }}>{edu.institution}, {edu.location}</div>
                        {edu.details && (
                            <div style={{ fontSize: '10px', marginTop: '2px', color: '#444' }}>
                                {edu.details.join(' • ')}
                            </div>
                        )}
                    </div>
                    <div style={{ fontWeight: '600' }}>{edu.year}</div>
                </div>
            ))}

            {/* RESEARCH EXPERIENCE */}
            {data.experience && (
                <div>
                    <div style={styles.header}>Research Experience</div>
                    {data.experience.map((job, i) => (
                        <div key={i} style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '12px' }}>
                                <span>{job.role}, {job.company}</span>
                                <span>{job.start} – {job.end}</span>
                            </div>
                            <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px', listStyle: 'circle' }}>
                                {job.points?.map((point, idx) => (
                                    <li key={idx} style={{ marginBottom: '4px' }}>
                                        <span dangerouslySetInnerHTML={{ __html: point }} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {/* PUBLICATIONS - Prominent */}
            {data.publications && data.publications.length > 0 && (
                <div>
                    <div style={styles.header}>Selected Publications</div>
                    {data.publications.map((pub, i) => (
                        <div key={i} style={styles.pubItem}>
                            {i + 1}. {pub}
                        </div>
                    ))}
                </div>
            )}

            {/* SKILLS - Technical/Lab */}
            {data.skills && (
                <div>
                    <div style={styles.header}>Skills & Tools</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {data.skills.map(group => group.items).flat().map((skill, i) => (
                            <span key={i} style={{ border: '1px solid #ddd', padding: '2px 6px', borderRadius: '3px', fontSize: '10px' }}>
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
