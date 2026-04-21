/**
 * Creative Portfolio - Designer Focus
 * Purpose: UX/UI, Graphic Design, Creative
 * Hierarchy: Visual, Projects First, Grid Layout
 */
import { highlightImpactNumbers } from '../../../lib/highlightNumbers';

export default function CreativePortfolio({ data }) {
    const styles = {
        page: {
            fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
            fontSize: '11px',
            lineHeight: '1.6',
            color: '#222',
            background: 'white',
            padding: '0',
            height: '100%',
            position: 'relative',
            display: 'flex'
        },
        sidebar: {
            width: '280px',
            background: '#F3F4F6', // Light gray sidebar
            padding: '40px 25px',
            flexShrink: 0
        },
        main: {
            flex: 1,
            padding: '40px 35px'
        },
        name: {
            fontSize: '36px',
            fontWeight: '800',
            color: '#000',
            lineHeight: '0.9',
            marginBottom: '20px'
        },
        title: {
            fontSize: '14px',
            fontWeight: '600',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#4B5563',
            marginBottom: '40px'
        },
        header: {
            fontSize: '13px',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderBottom: '2px solid #000',
            paddingBottom: '8px',
            marginBottom: '20px',
            marginTop: '0px'
        },
        projectCard: {
            marginBottom: '24px'
        },
        contactItem: {
            display: 'block',
            marginBottom: '8px',
            fontSize: '11px',
            color: '#444',
            textDecoration: 'none'
        }
    };

    return (
        <div style={styles.page}>
            {/* LEFT SIDEBAR - Identity & Skills */}
            <div style={styles.sidebar}>
                <h1 style={styles.name}>{data.header?.name}</h1>
                <div style={styles.title}>{data.header?.title}</div>

                <div style={{ marginBottom: '40px' }}>
                    <div style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', marginBottom: '10px' }}>Contact</div>
                    <div style={styles.contactItem}>📍 {data.header?.location}</div>
                    <a href={`mailto:${data.header?.email}`} style={styles.contactItem}>✉️ {data.header?.email}</a>
                    <div style={styles.contactItem}>📱 {data.header?.phone}</div>
                    {data.header?.portfolio && <div style={{ ...styles.contactItem, color: '#2563EB', fontWeight: '700' }}>🌐 {data.header.portfolio.replace('https://', '')}</div>}
                </div>

                {/* VISUAL SKILLS - Bar Chart Style for Creatives */}
                {data.skills && (
                    <div>
                        <div style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', marginBottom: '15px' }}>Expertise</div>
                        {data.skills.map((group, i) => (
                            <div key={i} style={{ marginBottom: '20px' }}>
                                <div style={{ fontSize: '10px', fontWeight: '700', color: '#666', marginBottom: '8px' }}>{group.category}</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {group.items.map((skill, idx) => (
                                        <span key={idx} style={{ background: '#E5E7EB', padding: '4px 8px', borderRadius: '4px', fontSize: '10px' }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MAIN CONTENT - Projects & Experience */}
            <div style={styles.main}>
                {/* Page Number */}
                <div style={{ position: 'absolute', bottom: '20px', right: '35px', fontSize: '10px', color: '#CCC' }}>1</div>

                {/* PROJECT SUMMARY (Creative Bio) */}
                {data.summary && (
                    <div style={{ marginBottom: '40px' }}>
                        <div style={styles.header}>About Me</div>
                        <div style={{ fontSize: '11px', color: '#333', lineHeight: '1.7' }}>
                            {data.summary}
                        </div>
                    </div>
                )}

                {/* PROJECTS - Grid Layout for Portfolio */}
                {data.projects && data.projects.length > 0 && (
                    <div style={{ marginBottom: '40px' }}>
                        <div style={styles.header}>Selected Works</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                            {data.projects.map((project, i) => (
                                <div key={i} style={{ background: '#FAFAFA', border: '1px solid #EEE', padding: '15px' }}>
                                    <div style={{ fontWeight: '800', fontSize: '13px', marginBottom: '4px' }}>{project.name}</div>
                                    <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.5' }}>{project.description}</div>
                                    {project.link && <div style={{ fontSize: '10px', marginTop: '8px', color: '#2563EB', fontWeight: '600' }}>View Case Study →</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* EXPERIENCE - Clean & Minimal */}
                {data.experience && (
                    <div>
                        <div style={styles.header}>Experience</div>
                        {data.experience.map((job, i) => (
                            <div key={i} style={{ marginBottom: '25px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '5px' }}>
                                    <div style={{ fontSize: '13px', fontWeight: '800' }}>{job.role}</div>
                                    <div style={{ fontSize: '11px', fontWeight: '600' }}>{job.start} – {job.end}</div>
                                </div>
                                <div style={{ fontSize: '12px', color: '#4B5563', marginBottom: '8px', fontStyle: 'italic' }}>{job.company}</div>

                                <ul style={{ paddingLeft: '15px', margin: 0 }}>
                                    {job.points?.map((point, idx) => (
                                        <li key={idx} style={{ marginBottom: '6px', paddingLeft: '5px' }}>
                                            <span>{highlightImpactNumbers(point)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}

                {/* AWARDS / RECOGNITION */}
                {data.awards && (
                    <div style={{ marginTop: '30px' }}>
                        <div style={styles.header} >Recognition</div>
                        {data.awards.map((award, i) => (
                            <div key={i} style={{ fontSize: '11px', marginBottom: '4px' }}>★ {award}</div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
