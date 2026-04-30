import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

function getSeverityColor(s) {
    if (s <= 3) return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500' }
    if (s <= 7) return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500' }
    return { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-500' }
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

    const avgSeverity = reports.length > 0
        ? (reports.reduce((a, r) => a + r.severity, 0) / reports.length).toFixed(1)
        : '0.0'

    const totalImages = reports.reduce((a, r) => a + (r.image_urls?.length || 0), 0)

    const totalValue = reports.reduce((a, r) => a + (r.recommended_price || 0), 0)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7]" style={{ fontFamily: "'Work Sans', 'Inter', sans-serif" }}>
                <LoadingSpinner size="lg" text="Loading your reports..." />
            </div>
        )
    }

    return (
        <div className="relative min-h-screen bg-[#f7f7f7] text-slate-900 antialiased" style={{ fontFamily: "'Work Sans', 'Inter', sans-serif" }}>
            {/* Background mesh */}
            <div className="fixed inset-0 pointer-events-none -z-10"
                style={{
                    backgroundImage: 'radial-gradient(at 0% 0%, rgba(103,130,158,0.08) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(45,212,191,0.06) 0px, transparent 50%)'
                }}
            />

            {/* Hero Header */}
            <div className="bg-gradient-to-r from-[#67829e] to-teal-500 text-white">
                <div className="max-w-[1280px] mx-auto px-6 md:px-20 py-12 pt-28">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-white/60">waving_hand</span>
                                <span className="text-white/70 text-sm font-medium">Welcome back</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">
                                {user?.name || 'User'}
                            </h1>
                            <p className="text-white/70 text-sm">
                                {reports.length > 0
                                    ? `You have ${reports.length} report${reports.length > 1 ? 's' : ''} — keep scanning to build your history`
                                    : 'Get started by uploading your first product image'}
                            </p>
                        </div>
                        <Link
                            to="/predict"
                            className="flex items-center gap-2 rounded-xl h-12 px-6 bg-white text-[#67829e] font-bold shadow-lg shadow-black/10 hover:scale-[1.02] transition-all w-fit"
                        >
                            <span className="material-symbols-outlined">add_circle</span>
                            New Analysis
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Cards — overlapping the hero */}
            <div className="max-w-[1280px] mx-auto px-6 md:px-20 -mt-6 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: 'description', label: 'Total Reports', value: reports.length, color: 'text-[#67829e]', iconBg: 'bg-[#67829e]/10' },
                        { icon: 'warning', label: 'Avg Severity', value: avgSeverity, color: 'text-amber-600', iconBg: 'bg-amber-50' },
                        { icon: 'photo_library', label: 'Images Scanned', value: totalImages, color: 'text-teal-600', iconBg: 'bg-teal-50' },
                        { icon: 'payments', label: 'Total Value', value: `₹${totalValue.toLocaleString()}`, color: 'text-emerald-600', iconBg: 'bg-emerald-50' },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-xl p-5 shadow-lg hover:shadow-xl transition-shadow group">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <span className="material-symbols-outlined text-xl">{stat.icon}</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                                    <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1280px] mx-auto px-6 md:px-20 py-10">
                {reports.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-xl p-16 text-center shadow-lg">
                        <div className="w-20 h-20 rounded-2xl bg-[#67829e]/10 flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-4xl text-[#67829e]">lab_profile</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">No reports yet</h2>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">Enter phone details and product images to generate a price prediction report.</p>
                        <Link
                            to="/predict"
                            className="inline-flex items-center gap-2 rounded-xl h-12 px-8 bg-gradient-to-r from-[#67829e] to-teal-400 text-white font-bold shadow-lg shadow-[#67829e]/20 hover:shadow-[#67829e]/40 transition-all"
                        >
                            <span className="material-symbols-outlined">query_stats</span>
                            Predict Price
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Section Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#67829e]/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[#67829e] text-lg">history</span>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">Report History</h2>
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{reports.length} total</span>
                            </div>
                        </div>

                        {/* Report Cards */}
                        <div className="space-y-3">
                            {reports.map((report) => {
                                const sev = getSeverityColor(report.severity)
                                return (
                                    <Link
                                        key={report.id}
                                        to={`/report/${report.id}`}
                                        className="block bg-white/80 backdrop-blur-xl border border-slate-100 rounded-xl p-5 hover:shadow-lg hover:border-[#67829e]/20 transition-all group"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                            {/* Thumbnail */}
                                            <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                                {report.image_urls?.[0] ? (
                                                    <img src={report.image_urls[0]} alt="Product" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-slate-400">image</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1.5">
                                                    <span className="font-bold text-slate-900">Report #{report.id}</span>
                                                    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-bold ${sev.bg} ${sev.text} ${sev.border} border`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
                                                        {getSeverityLabel(report.severity)} ({report.severity}/10)
                                                    </span>
                                                </div>
                                                <p className="text-slate-500 text-sm truncate leading-relaxed">{report.explanation}</p>
                                            </div>

                                            {/* Price & Date */}
                                            <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 flex-shrink-0">
                                                <div className="flex items-center gap-1 font-bold text-[#67829e]">
                                                    <span className="material-symbols-outlined text-lg">currency_rupee</span>
                                                    ₹{report.recommended_price?.toLocaleString()}
                                                </div>
                                                <span className="text-slate-400 text-xs font-medium">
                                                    {report.created_at ? new Date(report.created_at).toLocaleDateString() : '—'}
                                                </span>
                                            </div>

                                            {/* Arrow */}
                                            <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-[#67829e]/10 transition-colors">
                                                <span className="material-symbols-outlined text-slate-400 group-hover:text-[#67829e] transition-colors">arrow_forward</span>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
