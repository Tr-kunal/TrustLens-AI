import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'

function getSeverityColor(s) {
    if (s <= 3) return { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-500', icon: 'text-emerald-600' }
    if (s <= 7) return { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', bar: 'bg-amber-500', icon: 'text-amber-600' }
    return { text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', bar: 'bg-red-500', icon: 'text-red-600' }
}

function getSeverityLabel(s) {
    if (s <= 3) return 'Minor'
    if (s <= 7) return 'Moderate'
    return 'Major'
}

function BoundingBoxImage({ src, detections }) {
    const canvasRef = useRef(null)
    const imgRef = useRef(null)

    useEffect(() => {
        const img = imgRef.current
        const canvas = canvasRef.current
        if (!img || !canvas) return

        const draw = () => {
            const ctx = canvas.getContext('2d')
            canvas.width = img.naturalWidth
            canvas.height = img.naturalHeight
            ctx.drawImage(img, 0, 0)

            // Draw bounding boxes
            const colors = {
                crack: '#ef4444', scratch: '#f59e0b', dent: '#3b82f6',
                chip: '#8b5cf6', discoloration: '#ec4899', broken_screen: '#dc2626',
                water_damage: '#06b6d4', bent_frame: '#f97316',
            }

            detections?.forEach((det) => {
                const [x, y, w, h] = det.bbox
                const color = colors[det.label] || '#67829e'

                ctx.strokeStyle = color
                ctx.lineWidth = 4
                ctx.strokeRect(x, y, w, h)

                // Label background
                const label = `${det.label.replace('_', ' ')} ${(det.confidence * 100).toFixed(0)}%`
                ctx.font = 'bold 16px "Work Sans", sans-serif'
                const metrics = ctx.measureText(label)
                const lh = 24
                
                // Add soft shadow behind label
                ctx.shadowColor = 'rgba(0,0,0,0.2)'
                ctx.shadowBlur = 4
                ctx.fillStyle = color
                ctx.fillRect(x, Math.max(0, y - lh - 8), metrics.width + 16, lh + 8)
                
                // Reset shadow for text
                ctx.shadowColor = 'transparent'
                ctx.fillStyle = '#ffffff'
                ctx.fillText(label, x + 8, Math.max(0, y - lh - 8) + 22)
            })
        }

        if (img.complete) draw()
        else img.onload = draw
    }, [src, detections])

    return (
        <div className="relative rounded-2xl overflow-hidden bg-slate-100 shadow-inner border border-slate-200/60">
            <img ref={imgRef} src={src} alt="Product analysis" className="hidden" crossOrigin="anonymous" />
            <canvas ref={canvasRef} className="w-full h-auto object-contain max-h-[600px] mx-auto" />
            
            {/* Overlay gradient for premium feel */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none" />
        </div>
    )
}

export default function AnalysisResult() {
    const { id } = useParams()
    const [report, setReport] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeImage, setActiveImage] = useState(0)

    useEffect(() => {
        fetchReport()
    }, [id])

    const fetchReport = async () => {
        try {
            const res = await api.get(`/report/${id}`)
            setReport(res.data)
        } catch (err) {
            console.error('Failed to fetch report', err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7]" style={{ fontFamily: "'Work Sans', 'Inter', sans-serif" }}>
                <LoadingSpinner size="lg" text="Loading report details..." />
            </div>
        )
    }

    if (!report) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7] px-6" style={{ fontFamily: "'Work Sans', 'Inter', sans-serif" }}>
                <div className="bg-white/80 backdrop-blur-xl border border-white/30 p-12 text-center max-w-md rounded-2xl shadow-xl">
                    <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-4xl text-red-500">error</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Report Not Found</h2>
                    <p className="text-slate-500 mb-8">The analysis report you're looking for doesn't exist or has been removed.</p>
                    <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-xl h-12 px-8 bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        )
    }

    const sc = getSeverityColor(report.severity)
    const savings = report.base_price - report.recommended_price

    return (
        <div className="relative min-h-screen bg-[#f7f7f7] text-slate-900 antialiased pb-20" style={{ fontFamily: "'Work Sans', 'Inter', sans-serif" }}>
            {/* Background mesh */}
            <div className="fixed inset-0 pointer-events-none -z-10"
                style={{
                    backgroundImage: 'radial-gradient(at 100% 0%, rgba(45,212,191,0.08) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(103,130,158,0.06) 0px, transparent 50%)'
                }}
            />

            {/* Header / Hero */}
            <div className="bg-gradient-to-r from-slate-900 via-[#67829e] to-teal-700 text-white pt-28 pb-16">
                <div className="max-w-6xl mx-auto px-6 lg:px-8">
                    {/* Back Link */}
                    <Link to="/dashboard" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 font-medium text-sm group">
                        <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1">arrow_back</span>
                        Back to Dashboard
                    </Link>

                    {/* Title Area */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase">
                                    Report #{report.id}
                                </span>
                                <span className="text-white/70 text-sm flex items-center gap-1.5 font-medium">
                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                    {report.created_at ? new Date(report.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—'}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight">Analysis Result</h1>
                        </div>

                        {/* High-level Severity Badge */}
                        <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl bg-white shadow-xl ${sc.text} border-2 ${sc.border}`}>
                            <span className="material-symbols-outlined text-2xl">{report.severity <= 3 ? 'verified_user' : report.severity <= 7 ? 'warning' : 'dangerous'}</span>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider opacity-70">Damage Level</p>
                                <p className="text-xl font-black">{getSeverityLabel(report.severity)} ({report.severity}/10)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 lg:px-8 -mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Column: Image & Detections (Takes up 7 cols on large screens) */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Detection Viewer Card */}
                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-2 sm:p-4 shadow-xl border border-slate-200/60">
                            {report.image_urls?.[activeImage] ? (
                                <BoundingBoxImage
                                    src={report.image_urls[activeImage]}
                                    detections={report.detections}
                                />
                            ) : (
                                <div className="aspect-video bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200">
                                    <span className="material-symbols-outlined text-slate-300 text-5xl">image_not_supported</span>
                                </div>
                            )}

                            {/* Image Thumbnails Gallery */}
                            {report.image_urls?.length > 1 && (
                                <div className="flex gap-3 mt-4 overflow-x-auto pb-2 px-1 snap-x">
                                    {report.image_urls.map((url, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveImage(i)}
                                            className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden transition-all snap-start
                                                ${i === activeImage 
                                                    ? 'ring-4 ring-teal-500 ring-offset-2 opacity-100 shadow-md' 
                                                    : 'opacity-60 hover:opacity-100 border border-slate-200'}`}
                                        >
                                            <img src={url} alt={`Angle ${i + 1}`} className="w-full h-full object-cover" />
                                            {i === activeImage && (
                                                <div className="absolute inset-0 bg-teal-500/10" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Detections List Card */}
                        {report.detections?.length > 0 && (
                            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-lg border border-slate-100">
                                <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#67829e]">troubleshoot</span>
                                    Issues Detected by AI
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {report.detections?.map((det, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-[#67829e]/30 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-teal-600 text-sm">sell</span>
                                                </div>
                                                <span className="font-semibold text-sm text-slate-800 capitalize">{det.label?.replace('_', ' ')}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-xs font-bold text-slate-400 uppercase">Confidence</span>
                                                <span className="text-sm font-bold text-[#67829e]">{(det.confidence * 100).toFixed(0)}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Pricing & AI Explanation (Takes up 5 cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        
                        {/* Price Recommendation Card */}
                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-xl border border-slate-200/60 relative overflow-hidden group">
                            {/* Decorative background accent */}
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-teal-400/20 to-emerald-400/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 relative z-10">
                                <span className="material-symbols-outlined text-emerald-500">sell</span>
                                Valuation
                            </h3>
                            
                            <div className="space-y-6 relative z-10">
                                {/* Base Price */}
                                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <span className="material-symbols-outlined text-sm">storefront</span>
                                        <span className="text-sm font-medium">Original Retail Price</span>
                                    </div>
                                    <span className="text-xl font-bold text-slate-900 line-through decoration-slate-300 decoration-2">
                                        ₹{report.base_price?.toLocaleString()}
                                    </span>
                                </div>

                                {/* Recommended Price Container */}
                                <div className="bg-gradient-to-br from-slate-900 to-[#67829e] rounded-xl p-5 text-white shadow-md transform hover:-translate-y-1 transition-transform">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-bold uppercase tracking-wider text-teal-300 gap-1 flex items-center">
                                            <span className="material-symbols-outlined text-xs">auto_awesome</span>
                                            AI Recommended Price
                                        </span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-medium text-white/70">₹</span>
                                        <span className="text-4xl font-black">{report.recommended_price?.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Savings/Loss details */}
                                {savings > 0 && (
                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
                                        <span className="material-symbols-outlined text-red-500 mt-0.5">trending_down</span>
                                        <div>
                                            <p className="font-bold text-red-700 text-sm">Value Depreciation: ₹{savings.toLocaleString()}</p>
                                            <p className="text-xs text-red-600/80 mt-1 font-medium leading-relaxed">
                                                Detected damage resulted in a {((savings / report.base_price) * 100).toFixed(1)}% reduction from the original value.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Severity Score Card */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-amber-500">health_and_safety</span>
                                    Severity Score
                                </h3>
                                <span className={`font-black text-2xl ${sc.text}`}>{report.severity}<span className="text-sm text-slate-400 font-bold">/10</span></span>
                            </div>
                            
                            {/* Progress bar */}
                            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner mb-3 border border-slate-200/50">
                                <div
                                    className={`h-full rounded-full ${sc.bar} shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)] transition-all duration-1000 ease-out`}
                                    style={{ width: `${report.severity * 10}%` }}
                                />
                            </div>
                            
                            {/* Scale markers */}
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                                <span>Minor</span>
                                <span>Moderate</span>
                                <span>Severe</span>
                            </div>
                        </div>

                        {/* AI Explanation Card */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-lg border border-slate-100 relative">
                            <span className="material-symbols-outlined absolute top-6 right-6 text-6xl text-slate-100 z-0 select-none">format_quote</span>
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 relative z-10">
                                <span className="material-symbols-outlined text-[#67829e]">lightbulb</span>
                                Analysis Summary
                            </h3>
                            <div className="prose prose-sm prose-slate relative z-10 text-slate-600 leading-relaxed font-medium">
                                {report.explanation?.split('\n').map((paragraph, idx) => (
                                    <p key={idx}>{paragraph}</p>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
