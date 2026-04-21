/**
 * Tech Minimal - Clean, modern tech-focused design
 */
export default function TechMinimal({ data }) {
    return (
        <div style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif", fontSize: '11px', backgroundColor: '#ffffff' }}>
            {/* Minimal Header */}
            <div style={{ padding: '40px 45px 30px', borderBottom: '1px solid #e5e7eb' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#111827', margin: '0', letterSpacing: '-0.5px' }}>
                    {data.header?.name}
                </h1>
                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '6px', fontWeight: '500' }}>
                    {data.header?.title}
                </div>
                <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '10px', display: 'flex', gap: '16px' }}>
                    <span>{data.header?.email}</span>
                    <span>•</span>
                    <span>{data.header?.phone}</span>
                    <span>•</span>
                    <span>{data.header?.location}</span>
                </div>
            </div>

            <div style={{ padding: '35px 45px' }}>
                {/* Experience */}
                <div style={{ marginBottom: '35px' }}>
                    <h2 style={{ fontSize: '12px', fontWeight: '600', color: '#111827', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Experience
                    </h2>

                    {data.experience?.map((job, i) => (
                        <div key={i} style={{ marginBottom: '24px', paddingLeft: '16px', borderLeft: '2px solid #e5e7eb' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <div style={{ fontWeight: '600', fontSize: '12px', color: '#111827' }}>{job.role}</div>
                                <div style={{ fontSize: '10px', color: '#9ca3af' }}>{job.start} - {job.end}</div>
                            </div>
                            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '10px' }}>{job.company}</div>
                            <div style={{ fontSize: '10px', color: '#4b5563', lineHeight: '1.7' }}>
                                {job.points?.slice(0, 2).map((p, j) => (
                                    <div key={j} style={{ marginBottom: '4px' }}>• {p}</div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Grid for Education and Skills */}
                <div style={{ display: 'grid', gridTemplateColumns: '45% 55%', gap: '25px' }}>
                    {/* Education */}
                    <div>
                        <h2 style={{ fontSize: '12px', fontWeight: '600', color: '#111827', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Education
                        </h2>
                        {data.education?.map((edu, i) => (
                            <div key={i} style={{ marginBottom: '14px' }}>
                                <div style={{ fontSize: '11px', fontWeight: '600', color: '#111827' }}>{edu.degree}</div>
                                <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '3px' }}>{edu.institution}</div>
                                <div style={{ fontSize: '9px', color: '#9ca3af', marginTop: '2px' }}>{edu.year}</div>
                            </div>
                        ))}
                    </div>

                    {/* Skills */}
                    <div>
                        <h2 style={{ fontSize: '12px', fontWeight: '600', color: '#111827', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Skills
                        </h2>
                        {data.skills?.map((sg, i) => (
                            <div key={i} style={{ marginBottom: '14px' }}>
                                <div style={{ fontSize: '10px', fontWeight: '600', color: '#6b7280', marginBottom: '6px' }}>
                                    {sg.category}
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {sg.items?.slice(0, 5).map((skill, j) => (
                                        <span key={j} style={{
                                            fontSize: '9px',
                                            backgroundColor: '#f3f4f6',
                                            color: '#374151',
                                            padding: '4px 10px',
                                            borderRadius: '4px',
                                            fontWeight: '500',
                                            border: '1px solid #e5e7eb'
                                        }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
