'use client';

import { useState, useEffect } from 'react';

export default function Dashboard() {
    const [cohorts, setCohorts] = useState([]);
    const [stats, setStats] = useState({
        totalFounders: 0,
        totalMentors: 0,
        totalInvestors: 0,
    });

    useEffect(() => {
        // Fetch cohorts and stats
        fetch('/api/cohorts')
            .then(res => res.json())
            .then(data => setCohorts(data.data.cohorts));
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '2rem',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    color: 'white',
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <h1 style={{
                        margin: '0',
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                        Launchpad Dashboard
                    </h1>
                    <p style={{
                        margin: '0.5rem 0 0 0',
                        opacity: '0.9',
                        fontSize: '1.1rem'
                    }}>
                        Overview of your startup ecosystem
                    </p>
                </div>

                {/* Stats Cards */}
                <div style={{
                    padding: '2rem',
                    background: '#f8fafc'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '3rem'
                    }}>
                        <div style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                            border: '1px solid #e2e8f0',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            cursor: 'pointer'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                            }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '1rem'
                            }}>
                                {/* <div style={{
                                    width: '48px',
                                    height: '48px',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '1rem'
                                }}>
                                    <span style={{ fontSize: '1.5rem', color: 'white' }}>👥</span>
                                </div> */}
                                <div>
                                    <h3 style={{
                                        margin: '0',
                                        fontSize: '0.875rem',
                                        color: '#64748b',
                                        fontWeight: '500',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        Total Founders
                                    </h3>
                                    <p style={{
                                        margin: '0.25rem 0 0 0',
                                        fontSize: '2.5rem',
                                        fontWeight: '700',
                                        color: '#1e293b'
                                    }}>
                                        {stats.totalFounders}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                            border: '1px solid #e2e8f0',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            cursor: 'pointer'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                            }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '1rem'
                            }}>
                                {/* <div style={{
                                    width: '48px',
                                    height: '48px',
                                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '1rem'
                                }}>
                                    <span style={{ fontSize: '1.5rem', color: 'white' }}>🎓</span>
                                </div> */}
                                <div>
                                    <h3 style={{
                                        margin: '0',
                                        fontSize: '0.875rem',
                                        color: '#64748b',
                                        fontWeight: '500',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        Total Mentors
                                    </h3>
                                    <p style={{
                                        margin: '0.25rem 0 0 0',
                                        fontSize: '2.5rem',
                                        fontWeight: '700',
                                        color: '#1e293b'
                                    }}>
                                        {stats.totalMentors}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                            border: '1px solid #e2e8f0',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            cursor: 'pointer'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                            }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '1rem'
                            }}>
                                {/* <div style={{
                                    width: '48px',
                                    height: '48px',
                                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '1rem'
                                }}>
                                    <span style={{ fontSize: '1.5rem', color: 'white' }}>💰</span>
                                </div> */}
                                <div>
                                    <h3 style={{
                                        margin: '0',
                                        fontSize: '0.875rem',
                                        color: '#64748b',
                                        fontWeight: '500',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        Total Investors
                                    </h3>
                                    <p style={{
                                        margin: '0.25rem 0 0 0',
                                        fontSize: '2.5rem',
                                        fontWeight: '700',
                                        color: '#1e293b'
                                    }}>
                                        {stats.totalInvestors}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cohorts Section */}
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                        border: '1px solid #e2e8f0',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            padding: '1.5rem 2rem',
                            borderBottom: '1px solid #e2e8f0',
                            background: '#f8fafc'
                        }}>
                            <h2 style={{
                                margin: '0',
                                fontSize: '1.5rem',
                                fontWeight: '600',
                                color: '#1e293b'
                            }}>
                                Active Cohorts
                            </h2>
                            <p style={{
                                margin: '0.25rem 0 0 0',
                                color: '#64748b',
                                fontSize: '0.875rem'
                            }}>
                                Current startup cohorts and their progress
                            </p>
                        </div>

                        {cohorts.length > 0 ? (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{
                                    width: '100%',
                                    borderCollapse: 'collapse',
                                    fontSize: '0.875rem'
                                }}>
                                    <thead>
                                        <tr style={{ background: '#f8fafc' }}>
                                            <th style={{
                                                padding: '1rem 1.5rem',
                                                textAlign: 'left',
                                                fontWeight: '600',
                                                color: '#374151',
                                                borderBottom: '1px solid #e2e8f0',
                                                fontSize: '0.75rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}>
                                                Cohort Name
                                            </th>
                                            <th style={{
                                                padding: '1rem 1.5rem',
                                                textAlign: 'left',
                                                fontWeight: '600',
                                                color: '#374151',
                                                borderBottom: '1px solid #e2e8f0',
                                                fontSize: '0.75rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}>
                                                Start Date
                                            </th>
                                            <th style={{
                                                padding: '1rem 1.5rem',
                                                textAlign: 'left',
                                                fontWeight: '600',
                                                color: '#374151',
                                                borderBottom: '1px solid #e2e8f0',
                                                fontSize: '0.75rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}>
                                                End Date
                                            </th>
                                            <th style={{
                                                padding: '1rem 1.5rem',
                                                textAlign: 'left',
                                                fontWeight: '600',
                                                color: '#374151',
                                                borderBottom: '1px solid #e2e8f0',
                                                fontSize: '0.75rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}>
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cohorts.map((cohort: any, index: number) => (
                                            <tr
                                                key={cohort.id}
                                                style={{
                                                    background: index % 2 === 0 ? 'white' : '#f8fafc',
                                                    transition: 'background-color 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = '#f1f5f9';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#f8fafc';
                                                }}
                                            >
                                                <td style={{
                                                    padding: '1rem 1.5rem',
                                                    borderBottom: '1px solid #e2e8f0',
                                                    color: '#1e293b',
                                                    fontWeight: '500'
                                                }}>
                                                    {cohort.name}
                                                </td>
                                                <td style={{
                                                    padding: '1rem 1.5rem',
                                                    borderBottom: '1px solid #e2e8f0',
                                                    color: '#64748b'
                                                }}>
                                                    {cohort.startDate}
                                                </td>
                                                <td style={{
                                                    padding: '1rem 1.5rem',
                                                    borderBottom: '1px solid #e2e8f0',
                                                    color: '#64748b'
                                                }}>
                                                    {cohort.endDate}
                                                </td>
                                                <td style={{
                                                    padding: '1rem 1.5rem',
                                                    borderBottom: '1px solid #e2e8f0'
                                                }}>
                                                    <span style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '9999px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '500',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.05em',
                                                        background: cohort.status === 'active' ? '#dcfce7' : '#e2e8f0',
                                                        color: cohort.status === 'active' ? '#166534' : '#64748b'
                                                    }}>
                                                        {cohort.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div style={{
                                padding: '3rem',
                                textAlign: 'center',
                                color: '#64748b'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                                <h3 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>No Cohorts Yet</h3>
                                <p style={{ margin: '0' }}>Cohorts will appear here once they are created.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}