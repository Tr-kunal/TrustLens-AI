import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import { HiDocumentReport, HiPhotograph, HiExclamationCircle, HiCurrencyDollar, HiClock, HiArrowRight, HiPlusCircle } from 'react-icons/hi'

function getSeverityColor(s) {
    if (s <= 3) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
    if (s <= 7) return 'text-amber-400 bg-amber-400/10 border-amber-400/20'
    return 'text-red-400 bg-red-400/10 border-red-400/20'
}

function getSeverityLabel(s) {
    if (s <= 3) return 'Minor'
    if (s <= 7) return 'Moderate'
    return 'Major'
}

export default function Dashboard() {
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    useEffect(() => {
        fetchReports()
    }, [])

    const fetchReports = async () => {
        try {
            const res = await api.get('/reports')
            setReports(res.data)
        } catch (err) {
            console.error('Failed to fetch reports', err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-16">
                <LoadingSpinner size="lg" text="Loading your reports..." />
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="section-container">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">
                            Welcome back, <span className="gradient-text">{user?.name || 'User'}</span>
                        </h1>
                        <p className="text-dark-400">
                            {reports.length > 0
                                ? `You have ${reports.length} report${reports.length > 1 ? 's' : ''} so far`
                                : 'Get started by uploading your first product image'}
                        </p>
                    </div>
                    <Link to="/upload" className="btn-primary flex items-center gap-2">
                        <HiPlusCircle className="w-5 h-5" />
                        New Analysis
                    </Link>
                </div>

                {/* Stats Row */}
                {reports.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                        <div className="glass-card p-5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                                <HiDocumentReport className="w-6 h-6 text-primary-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{reports.length}</p>
                                <p className="text-dark-400 text-sm">Total Reports</p>
                            </div>
                        </div>
                        <div className="glass-card p-5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                <HiExclamationCircle className="w-6 h-6 text-amber-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{(reports.reduce((a, r) => a + r.severity, 0) / reports.length).toFixed(1)}</p>
                                <p className="text-dark-400 text-sm">Avg Severity</p>
                            </div>
                        </div>
                        <div className="glass-card p-5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <HiPhotograph className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{reports.reduce((a, r) => a + (r.image_urls?.length || 0), 0)}</p>
                                <p className="text-dark-400 text-sm">Images Analyzed</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reports List */}
                {reports.length === 0 ? (
                    <div className="glass-card p-16 text-center">
                        <HiDocumentReport className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No reports yet</h2>
                        <p className="text-dark-400 mb-6">Upload product images to generate your first AI analysis report.</p>
                        <Link to="/upload" className="btn-primary">Upload Images</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <HiClock className="w-5 h-5 text-dark-400" />
                            Report History
                        </h2>
                        {reports.map((report) => (
                            <Link key={report.id} to={`/report/${report.id}`} className="glass-card-hover p-5 block group">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    {/* Thumbnail */}
                                    <div className="w-16 h-16 rounded-xl bg-dark-800 overflow-hidden flex-shrink-0">
                                        {report.image_urls?.[0] ? (
                                            <img src={report.image_urls[0]} alt="Product" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <HiPhotograph className="w-6 h-6 text-dark-600" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-semibold">Report #{report.id}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full border ${getSeverityColor(report.severity)}`}>
                                                {getSeverityLabel(report.severity)} ({report.severity}/10)
                                            </span>
                                        </div>
                                        <p className="text-dark-400 text-sm truncate">{report.explanation}</p>
                                    </div>

                                    {/* Price & Date */}
                                    <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1">
                                        <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                                            <HiCurrencyDollar className="w-4 h-4" />
                                            ₹{report.recommended_price?.toLocaleString()}
                                        </div>
                                        <span className="text-dark-500 text-xs">
                                            {report.created_at ? new Date(report.created_at).toLocaleDateString() : '—'}
                                        </span>
                                    </div>

                                    <HiArrowRight className="w-5 h-5 text-dark-600 group-hover:text-primary-400 transition-colors hidden sm:block" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
