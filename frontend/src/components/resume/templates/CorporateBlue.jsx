/**
 * Corporate Blue - Standard, safe, professional
 * Purpose: Business, Admin, General Corp
 */
export default function CorporateBlue({ data }) {
    return (
        <div style={{ fontFamily: "'Arial', sans-serif", fontSize: '11px', background: 'white', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Blue Header */}
            <div style={{ backgroundColor: '#2c3e50', color: 'white', padding: '30px 40px' }}>
                <h1 style={{ fontSize: '30px', margin: 0, fontWeight: 'normal' }}>{data.header?.name}</h1>
                <div style={{ fontSize: '14px', color: '#bdc3c7', marginTop: '5px' }}>{data.header?.title}</div>
            </div>

            <div style={{ backgroundColor: '#ecf0f1', padding: '10px 40px', fontSize: '11px', color: '#7f8c8d', display: 'flex', gap: '20px' }}>
                <span>{data.header?.email}</span>
                <span>{data.header?.phone}</span>
                <span>{data.header?.location}</span>
                {data.header?.linkedin && <span>{data.header.linkedin}</span>}
            </div>

            <div style={{ padding: '30px 40px', display: 'grid', gridTemplateColumns: '70% 30%', gap: '30px' }}>
                {/* Main */}
                <div>
                    {data.summary && (
                        <div style={{ marginBottom: '25px' }}>
                            <h2 style={{ fontSize: '14px', color: '#2980b9', borderBottom: '2px solid #2980b9', paddingBottom: '5px', marginBottom: '10px', textTransform: 'uppercase' }}>Summary</h2>
                            <p style={{ lineHeight: '1.6', color: '#333' }}>{data.summary}</p>
                        </div>
                    )}

                    <h2 style={{ fontSize: '14px', color: '#2980b9', borderBottom: '2px solid #2980b9', paddingBottom: '5px', marginBottom: '15px', textTransform: 'uppercase' }}>Experience</h2>
                    {data.experience?.map((job, i) => (
                        <div key={i} style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#2c3e50' }}>{job.role}</div>
                            <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '5px' }}>{job.company} | {job.start} - {job.end}</div>
                            <ul style={{ paddingLeft: '18px', margin: 0 }}>
                                {job.points?.map((p, j) => (
                                    <li key={j} style={{ marginBottom: '4px', lineHeight: '1.5' }}>{p}</li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {data.projects && data.projects.length > 0 && (
                        <div>
                            <h2 style={{ fontSize: '14px', color: '#2980b9', borderBottom: '2px solid #2980b9', paddingBottom: '5px', marginBottom: '15px', textTransform: 'uppercase' }}>Projects</h2>
                            {data.projects.map((proj, i) => (
                                <div key={i} style={{ marginBottom: '10px' }}>
                                    <strong>{proj.name}:</strong> {proj.description}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div>
                    <h2 style={{ fontSize: '14px', color: '#2980b9', borderBottom: '2px solid #2980b9', paddingBottom: '5px', marginBottom: '15px', textTransform: 'uppercase' }}>Education</h2>
                    {data.education?.map((edu, i) => (
                        <div key={i} style={{ marginBottom: '15px' }}>
                            <div style={{ fontWeight: 'bold' }}>{edu.degree}</div>
                            <div>{edu.institution}</div>
                            <div style={{ color: '#7f8c8d' }}>{edu.year}</div>
                        </div>
                    ))}

                    <h2 style={{ fontSize: '14px', color: '#2980b9', borderBottom: '2px solid #2980b9', paddingBottom: '5px', marginBottom: '15px', textTransform: 'uppercase', marginTop: '20px' }}>Skills</h2>
                    {data.skills?.map((grp, i) => (
                        <div key={i} style={{ marginBottom: '15px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{grp.category}</div>
                            <div style={{ lineHeight: '1.6' }}>{grp.items?.join(', ')}</div>
                        </div>
                    ))}

                    {/* Certifications */}
                    {data.certifications && data.certifications.length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                            <h2 style={{ fontSize: '14px', color: '#2980b9', borderBottom: '2px solid #2980b9', paddingBottom: '5px', marginBottom: '15px', textTransform: 'uppercase' }}>Certifications</h2>
                            {data.certifications.map((cert, i) => (
                                <div key={i} style={{
                                    fontSize: '11px',
                                    marginBottom: '8px',
                                    padding: '6px 10px',
                                    background: '#ecf0f1',
                                    borderRadius: '4px',
                                    color: '#2c3e50'
                                }}>
                                    {cert}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
