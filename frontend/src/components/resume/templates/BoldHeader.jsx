/**
 * Bold Colorful - Vibrant and eye-catching
 */
export default function BoldColorful({ data }) {
    return (
        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '11px', backgroundColor: '#fff', minHeight: '100%' }}>
            {/* Colorful Top Bar */}
            <div style={{
                background: '#f093fb',
                padding: '30px 40px',
                color: 'white'
            }}>
                <h1 style={{ fontSize: '30px', fontWeight: '800', margin: '0', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
                    {data.header?.name}
                </h1>
                <div style={{ fontSize: '15px', marginTop: '8px', fontWeight: '600', opacity: '0.95' }}>
                    {data.header?.title}
                </div>
            </div>

            {/* Contact Bar */}
            <div style={{
                backgroundColor: '#2d3748',
                padding: '12px 40px',
                color: 'white',
                fontSize: '10px',
                display: 'flex',
                gap: '25px'
            }}>
                <span>✉ {data.header?.email}</span>
                <span>📱 {data.header?.phone}</span>
                <span>📍 {data.header?.location}</span>
            </div>

            <div style={{ padding: '35px 40px' }}>
                {/* Summary (Added by Feedback) */}
                {data.summary && (
                    <div style={{ marginBottom: '30px' }}>
                        <h2 style={{
                            fontSize: '16px',
                            fontWeight: '800',
                            color: '#f093fb',
                            marginBottom: '15px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            Professional Summary
                        </h2>
                        <div style={{ fontSize: '11px', color: '#4a5568', lineHeight: '1.8' }}>
                            {data.summary}
                        </div>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '65% 35%', gap: '30px' }}>
                    {/* Left - Experience */}
                    <div>
                        <h2 style={{
                            fontSize: '16px',
                            fontWeight: '800',
                            color: '#f093fb',

                            marginBottom: '20px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            Work Experience
                        </h2>

                        {data.experience?.map((job, i) => (
                            <div key={i} style={{ marginBottom: '22px' }}>
                                <div style={{ fontWeight: '700', fontSize: '13px', color: '#2d3748' }}>{job.role}</div>
                                <div style={{ fontSize: '11px', color: '#f5576c', fontWeight: '600', marginTop: '3px' }}>
                                    {job.company}
                                </div>
                                <div style={{ fontSize: '9px', color: '#a0aec0', marginTop: '2px', marginBottom: '8px' }}>
                                    {job.start} - {job.end}
                                </div>
                                {job.points?.slice(0, 2).map((p, j) => (
                                    <div key={j} style={{ fontSize: '10px', color: '#4a5568', marginBottom: '5px', paddingLeft: '12px', borderLeft: '3px solid #fed7e2', lineHeight: '1.6' }}>
                                        {p}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Projects (Added for Freshers) */}
                    {data.projects && data.projects.length > 0 && (
                        <div>
                            <h2 style={{
                                fontSize: '16px',
                                fontWeight: '800',
                                color: '#f093fb',
                                marginBottom: '20px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                Projects
                            </h2>
                            {data.projects.map((project, i) => (
                                <div key={i} style={{ marginBottom: '18px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontWeight: '700', fontSize: '13px', color: '#2d3748' }}>{project.name}</span>
                                        {project.link && (
                                            <span style={{ fontSize: '10px', color: '#f5576c', background: '#ffe4e6', padding: '2px 6px', borderRadius: '4px' }}>
                                                Link ↗
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ fontSize: '10px', color: '#4a5568', marginTop: '4px', lineHeight: '1.6' }}>
                                        {project.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Right - Education & Skills */}
                    <div>
                        {/* Education */}
                        <div style={{ marginBottom: '30px' }}>
                            <h2 style={{
                                fontSize: '14px',
                                fontWeight: '800',
                                color: '#2d3748',
                                marginBottom: '15px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                borderBottom: '3px solid #f093fb',
                                paddingBottom: '6px'
                            }}>
                                Education
                            </h2>
                            {data.education?.map((edu, i) => (
                                <div key={i} style={{ marginBottom: '14px' }}>
                                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#2d3748' }}>{edu.degree}</div>
                                    <div style={{ fontSize: '10px', color: '#718096', marginTop: '3px' }}>{edu.institution}</div>
                                    <div style={{ fontSize: '9px', color: '#a0aec0', marginTop: '2px' }}>{edu.year}</div>
                                </div>
                            ))}
                        </div>

                        {/* Skills */}
                        <div>
                            <h2 style={{
                                fontSize: '14px',
                                fontWeight: '800',
                                color: '#2d3748',
                                marginBottom: '15px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                borderBottom: '3px solid #f5576c',
                                paddingBottom: '6px'
                            }}>
                                Skills
                            </h2>
                            {data.skills?.map((sg, i) => (
                                <div key={i} style={{ marginBottom: '14px' }}>
                                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#4a5568', marginBottom: '6px' }}>
                                        {sg.category}
                                    </div>
                                    {sg.items?.slice(0, 4).map((skill, j) => (
                                        <div key={j} style={{
                                            fontSize: '9px',
                                            backgroundColor: '#fff5f7',
                                            color: '#c53030',
                                            padding: '5px 10px',
                                            marginBottom: '4px',
                                            borderRadius: '15px',
                                            fontWeight: '600',
                                            display: 'inline-block',
                                            marginRight: '4px',
                                            border: '1px solid #fed7e2'
                                        }}>
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Certifications */}
                        {data.certifications && data.certifications.length > 0 && (
                            <div style={{ marginTop: '30px' }}>
                                <h2 style={{
                                    fontSize: '14px',
                                    fontWeight: '800',
                                    color: '#2d3748',
                                    marginBottom: '15px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    borderBottom: '3px solid #f093fb',
                                    paddingBottom: '6px'
                                }}>
                                    Certifications
                                </h2>
                                {data.certifications.map((cert, i) => (
                                    <div key={i} style={{
                                        fontSize: '10px',
                                        backgroundColor: '#fff5f7',
                                        color: '#c53030',
                                        padding: '6px 12px',
                                        marginBottom: '6px',
                                        borderRadius: '4px',
                                        fontWeight: '600',
                                        border: '1px solid #fed7e2'
                                    }}>
                                        {cert}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
