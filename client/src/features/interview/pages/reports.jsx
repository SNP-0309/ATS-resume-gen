import React, { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useInterview } from '../hooks/useInterview.js'
import '../style/reports.scss'

const scoreClass = (score) => {
    if (score >= 80) return 'high'
    if (score >= 60) return 'mid'
    return 'low'
}

const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const Reports = () => {
    const { reports, loading, error, getAllReports } = useInterview()
    const navigate = useNavigate()

    useEffect(() => {
        getAllReports()
    }, [getAllReports])

    if (loading) {
        return (
            <div className='reports-page'>
                <div className='reports-loading'>Loading your reports...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='reports-page'>
                <div className='reports-error'>⚠ {error}</div>
            </div>
        )
    }

    return (
        <div className='reports-page'>
            <div className='reports-header'>
                <h1>My Interview Reports</h1>
                <p>{reports.length > 0 ? `${reports.length} report${reports.length !== 1 ? 's' : ''} generated` : 'No reports yet'}</p>
            </div>

            {reports.length === 0 ? (
                <div className='reports-empty'>
                    <span className='empty-icon'>📋</span>
                    <h2>No reports yet</h2>
                    <p>Generate your first AI interview report by uploading your resume and a job description.</p>
                    <Link to='/' className='cta-btn'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Generate New Report
                    </Link>
                </div>
            ) : (
                <div className='reports-grid'>
                    {reports.map((report) => {
                        const sc = scoreClass(report.matchScore)
                        const gaps = (report.skillGaps || []).slice(0, 3)

                        return (
                            <div
                                key={report._id}
                                className='report-card'
                                onClick={() => navigate(`/interview/${report._id}`)}
                            >
                                <div className='report-card__top'>
                                    <h3 className='report-card__title'>
                                        {report.title || 'Interview Report'}
                                    </h3>
                                    <div className={`report-card__score report-card__score--${sc}`}>
                                        {report.matchScore}%
                                    </div>
                                </div>

                                <div className='report-card__meta'>
                                    <span>{formatDate(report.createdAt)}</span>
                                    <span className='report-card__dot' />
                                    <span>{report.technicalQuestions?.length || 0} tech Q&apos;s</span>
                                    <span className='report-card__dot' />
                                    <span>{report.behavioralQuestions?.length || 0} behavioral</span>
                                </div>

                                {gaps.length > 0 && (
                                    <div className='report-card__gaps'>
                                        {gaps.map((gap, i) => (
                                            <span
                                                key={i}
                                                className={`report-card__gap-tag report-card__gap-tag--${gap.severity || 'low'}`}
                                            >
                                                {gap.skill}
                                            </span>
                                        ))}
                                        {report.skillGaps?.length > 3 && (
                                            <span className='report-card__gap-tag report-card__gap-tag--low'>
                                                +{report.skillGaps.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className='report-card__action'>
                                    View Report
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Reports
