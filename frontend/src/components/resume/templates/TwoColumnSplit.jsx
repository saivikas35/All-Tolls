/**
 * Executive Professional - Classic and sophisticated
 */
export default function ExecutiveProfessional({ data }) {
    return (
        <div style={{ fontFamily: "'Times New Roman', serif", fontSize: '11px', padding: '45px 50px', backgroundColor: '#ffffff' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '35px', borderBottom: '3px double #2c5282', paddingBottom: '20px' }}>
                <h1 style={{ fontSize: '34px', fontWeight: '700', margin: '0', color: '#1a365d', letterSpacing: '1px' }}>
                    {data.header?.name?.toUpperCase()}
                </h1>
                <div style={{ fontSize: '14px', color: '#2c5282', marginTop: '10px', fontStyle: 'italic', fontWeight: '600' }}>
                    {data.header?.title}
                </div>
                <div style={{ fontSize: '10px', color: '#4a5568', marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <span>{data.header?.email}</span>
                    <span>|</span>
                    <span>{data.header?.phone}</span>
                    <span>|</span>
                    <span>{data.header?.location}</span>
                </div>
            </div>

            {/* Professional Summary */}
            {data.summary && (
                <div style={{ marginBottom: '30px', textAlign: 'center', padding: '0 60px' }}>
                    <h2 style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#1a365d',
                        marginBottom: '12px',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        borderBottom: '2px solid #2c5282',
                        paddingBottom: '8px'
                    }}>
                        Professional Summary
                    </h2>
                    <p style={{ fontSize: '11px', color: '#2d3748', lineHeight: '1.8', textAlign: 'justify' }}>
                        {data.summary}
                    </p>
                </div>
            )}

            {/* Professional Experience */}
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#1a365d',
                    marginBottom: '18px',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    borderBottom: '2px solid #2c5282',
                    paddingBottom: '8px'
                }}>
                    Professional Experience
                </h2>

                {data.experience?.map((job, i) => (
                    <div key={i} style={{ marginBottom: '25px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <div>
                                <span style={{ fontWeight: '700', fontSize: '13px', color: '#1a365d' }}>{job.role}</span>
                                <span style={{ fontSize: '12px', color: '#2c5282', marginLeft: '10px' }}>• {job.company}</span>
                            </div>
                            <div style={{ fontSize: '10px', color: '#718096', fontStyle: 'italic' }}>
                                {job.start} - {job.end}
                            </div>
                        </div>
                        <ul style={{ marginLeft: '25px', lineHeight: '1.8', marginTop: '8px' }}>
                            {job.points?.slice(0, 3).map((p, j) => (
                                <li key={j} style={{ fontSize: '11px', color: '#2d3748', marginBottom: '6px' }}>{p}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Bottom Two Columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', borderTop: '1px solid #cbd5e0', paddingTop: '25px' }}>
                {/* Education */}
                <div>
                    <h2 style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#1a365d',
                        marginBottom: '15px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Education
                    </h2>
                    {data.education?.map((edu, i) => (
                        <div key={i} style={{ marginBottom: '15px' }}>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#1a365d' }}>{edu.degree}</div>
                            <div style={{ fontSize: '11px', color: '#2c5282', marginTop: '3px', fontStyle: 'italic' }}>
                                {edu.institution}
                            </div>
                            <div style={{ fontSize: '10px', color: '#718096', marginTop: '2px' }}>{edu.year}</div>
                        </div>
                    ))}
                </div>

                {/* Skills */}
                <div>
                    <h2 style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#1a365d',
                        marginBottom: '15px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Core Competencies
                    </h2>
                    {data.skills?.map((sg, i) => (
                        <div key={i} style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '11px', fontWeight: '700', color: '#2c5282', marginBottom: '5px' }}>
                                {sg.category}
                            </div>
                            <div style={{ fontSize: '10px', color: '#4a5568', lineHeight: '1.6' }}>
                                {sg.items?.join(' • ')}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Certifications (Full Width) */}
            {data.certifications && data.certifications.length > 0 && (
                <div style={{ marginTop: '25px', borderTop: '1px solid #cbd5e0', paddingTop: '20px' }}>
                    <h2 style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#1a365d',
                        marginBottom: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Certifications
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {data.certifications.map((cert, i) => (
                            <div key={i} style={{
                                fontSize: '10px',
                                background: '#f7fafc',
                                border: '1px solid #e2e8f0',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                color: '#2c5282',
                                fontWeight: '600'
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
