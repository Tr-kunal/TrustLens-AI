import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'
import {
    HiArrowLeft, HiShieldCheck, HiExclamationCircle, HiCurrencyDollar,
    HiClock, HiPhotograph, HiTag
} from 'react-icons/hi'

function getSeverityColor(s) {
    if (s <= 3) return { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', bar: 'bg-emerald-500' }
    if (s <= 7) return { text: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', bar: 'bg-amber-500' }
    return { text: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', bar: 'bg-red-500' }
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
                const color = colors[det.label] || '#6366f1'

                ctx.strokeStyle = color
                ctx.lineWidth = 3
                ctx.strokeRect(x, y, w, h)

                // Label background
                const label = `${det.label.replace('_', ' ')} ${(det.confidence * 100).toFixed(0)}%`
                ctx.font = 'bold 14px Inter, sans-serif'
                const metrics = ctx.measureText(label)
                const lh = 20
                ctx.fillStyle = color
                ctx.fillRect(x, y - lh - 4, metrics.width + 10, lh + 4)
                ctx.fillStyle = '#fff'
                ctx.fillText(label, x + 5, y - 8)
            })
        }

        if (img.complete) draw()
        else img.onload = draw
    }, [src, detections])

    return (
        <div className="relative rounded-xl overflow-hidden bg-dark-900">
            <img ref={imgRef} src={src} alt="Product" className="hidden" crossOrigin="anonymous" />
            <canvas ref={canvasRef} className="w-full h-auto" />
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
            <div className="min-h-screen flex items-center justify-center pt-16">
                <LoadingSpinner size="lg" text="Loading report..." />
            </div>
        )
    }

    if (!report) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-16">
                <div className="glass-card p-12 text-center max-w-md">
                    <HiExclamationCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Report Not Found</h2>
                    <p className="text-dark-400 mb-6">The report you're looking for doesn't exist.</p>
                    <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
                </div>
            </div>
        )
    }

    const sc = getSeverityColor(report.severity)
    const savings = report.base_price - report.recommended_price

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="section-container max-w-5xl">
                {/* Back Link */}
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-6">
                    <HiArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>

                {/* Title */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Analysis Report #{report.id}</h1>
                        <p className="text-dark-400 flex items-center gap-2">
                            <HiClock className="w-4 h-4" />
                            {report.created_at ? new Date(report.created_at).toLocaleString() : '—'}
                        </p>
                    </div>
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold ${sc.text} ${sc.bg} ${sc.border}`}>
                        <HiShieldCheck className="w-4 h-4" />
                        {getSeverityLabel(report.severity)} Damage
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Image with Bounding Boxes */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <HiPhotograph className="w-5 h-5 text-primary-400" />
                            Damage Detection
                        </h2>
                        {report.image_urls?.[activeImage] && (
                            <BoundingBoxImage
                                src={report.image_urls[activeImage]}
                                detections={report.detections}
                            />
                        )}
                        {/* Image thumbnails */}
                        {report.image_urls?.length > 1 && (
                            <div className="flex gap-2">
                                {report.image_urls.map((url, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === activeImage ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        <img src={url} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Detections List */}
                        <div className="glass-card p-5">
                            <h3 className="text-sm font-semibold text-dark-300 mb-3">Detected Issues</h3>
                            <div className="space-y-2">
                                {report.detections?.map((det, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-white/5 last:border-0">
                                        <div className="flex items-center gap-2">
                                            <HiTag className="w-4 h-4 text-primary-400" />
                                            <span className="capitalize">{det.label?.replace('_', ' ')}</span>
                                        </div>
                                        <span className="text-dark-400">{(det.confidence * 100).toFixed(0)}% confidence</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Report Details */}
                    <div className="space-y-6">
                        {/* Severity Card */}
                        <div className="glass-card p-6">
                            <h3 className="text-sm font-semibold text-dark-300 mb-4">Severity Score</h3>
                            <div className="flex items-end gap-4 mb-4">
                                <span className={`text-5xl font-bold ${sc.text}`}>{report.severity}</span>
                                <span className="text-dark-500 text-lg pb-1">/10</span>
                            </div>
                            <div className="w-full h-3 bg-dark-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${sc.bar} transition-all duration-1000`}
                                    style={{ width: `${report.severity * 10}%` }}
                                />
                            </div>
                            <p className={`text-sm mt-2 ${sc.text}`}>
                                {getSeverityLabel(report.severity)} damage detected
                            </p>
                        </div>

                        {/* Price Card */}
                        <div className="glass-card p-6">
                            <h3 className="text-sm font-semibold text-dark-300 mb-4">Price Recommendation</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-dark-500 text-xs mb-1">Original Price</p>
                                    <p className="text-xl font-semibold">₹{report.base_price?.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-dark-500 text-xs mb-1">Recommended Price</p>
                                    <p className="text-xl font-bold text-emerald-400">₹{report.recommended_price?.toLocaleString()}</p>
                                </div>
                            </div>
                            {savings > 0 && (
                                <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                    <p className="text-amber-400 text-sm">
                                        💡 Price adjusted by <strong>₹{savings.toLocaleString()}</strong> ({((savings / report.base_price) * 100).toFixed(0)}% discount) based on damage assessment.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Explanation Card */}
                        <div className="glass-card p-6">
                            <h3 className="text-sm font-semibold text-dark-300 mb-3">AI Explanation</h3>
                            <p className="text-dark-200 leading-relaxed">{report.explanation}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Link to="/upload" className="btn-primary flex-1 text-center">New Analysis</Link>
                            <Link to="/dashboard" className="btn-secondary flex-1 text-center">All Reports</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
