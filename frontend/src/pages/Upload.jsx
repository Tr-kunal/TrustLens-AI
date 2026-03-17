import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Upload() {
    const [files, setFiles] = useState([])
    const [previews, setPreviews] = useState([])
    const [basePrice, setBasePrice] = useState('')
    const [uploading, setUploading] = useState(false)
    const [analyzing, setAnalyzing] = useState(false)
    const [dragOver, setDragOver] = useState(false)
    const fileRef = useRef()
    const navigate = useNavigate()

    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files)
        if (selected.length + files.length > 5) {
            toast.error('Maximum 5 images allowed')
            return
        }
        const newFiles = [...files, ...selected].slice(0, 5)
        setFiles(newFiles)
        setPreviews(newFiles.map((f) => URL.createObjectURL(f)))
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragOver(false)
        const dropped = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'))
        if (dropped.length + files.length > 5) {
            toast.error('Maximum 5 images allowed')
            return
        }
        const newFiles = [...files, ...dropped].slice(0, 5)
        setFiles(newFiles)
        setPreviews(newFiles.map((f) => URL.createObjectURL(f)))
    }

    const removeFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index)
        setFiles(newFiles)
        setPreviews(newFiles.map((f) => URL.createObjectURL(f)))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (files.length === 0) return toast.error('Please upload at least one image')
        if (!basePrice || parseFloat(basePrice) <= 0) return toast.error('Enter a valid base price')

        try {
            setUploading(true)
            const formData = new FormData()
            files.forEach((f) => formData.append('files', f))
            const uploadRes = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            setUploading(false)

            setAnalyzing(true)
            const analyzeRes = await api.post('/analyze', {
                image_urls: uploadRes.data.image_urls,
                base_price: parseFloat(basePrice),
            })
            setAnalyzing(false)

            toast.success('Analysis complete!')
            navigate(`/report/${analyzeRes.data.id}`)
        } catch (err) {
            setUploading(false)
            setAnalyzing(false)
            toast.error(err.response?.data?.detail || 'Something went wrong')
        }
    }

    const isProcessing = uploading || analyzing

    return (
        <div className="relative min-h-screen bg-[#f7f7f7] text-slate-900 antialiased" style={{ fontFamily: "'Work Sans', 'Inter', sans-serif" }}>
            {/* Background mesh */}
            <div className="fixed inset-0 pointer-events-none -z-10"
                style={{
                    backgroundImage: 'radial-gradient(at 0% 100%, rgba(103,130,158,0.08) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(45,212,191,0.06) 0px, transparent 50%)'
                }}
            />

            {/* Loading Overlay */}
            {isProcessing && (
                <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center max-w-sm shadow-2xl">
                        <LoadingSpinner size="xl" />
                        <h3 className="text-xl font-bold text-slate-900 mt-6 mb-2">
                            {uploading ? 'Uploading Images...' : 'Running AI Analysis...'}
                        </h3>
                        <p className="text-slate-500 text-sm">
                            {uploading
                                ? 'Securely uploading your product images'
                                : 'Detecting damage, scoring severity, and generating report'}
                        </p>
                        {analyzing && (
                            <div className="mt-6 space-y-3 text-left">
                                {[
                                    { icon: 'search', text: 'Running YOLOv8 damage detection...', color: 'text-[#67829e]' },
                                    { icon: 'analytics', text: 'Computing severity score...', color: 'text-amber-600' },
                                    { icon: 'payments', text: 'Calculating price recommendation...', color: 'text-emerald-600' },
                                    { icon: 'description', text: 'Generating AI explanation...', color: 'text-teal-600' },
                                ].map((step, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-lg px-3 py-2">
                                        <span className={`material-symbols-outlined text-lg ${step.color}`}>{step.icon}</span>
                                        <span className="text-xs text-slate-600 font-medium">{step.text}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-r from-[#67829e] to-teal-500 text-white">
                <div className="max-w-3xl mx-auto px-6 md:px-20 py-10 pt-24">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white">cloud_upload</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">Upload & Analyze</h1>
                    </div>
                    <p className="text-white/70 text-sm max-w-lg">
                        Upload up to 5 product images for AI-powered condition analysis. Our YOLOv8 model detects cracks, scratches, and stains in seconds.
                    </p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 md:px-20 py-10 -mt-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Drop Zone */}
                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                        onDragLeave={() => setDragOver(false)}
                        onClick={() => fileRef.current?.click()}
                        className={`bg-white/80 backdrop-blur-xl border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 group shadow-lg hover:shadow-xl
                            ${dragOver ? 'border-teal-500 bg-teal-50/50' : 'border-slate-200 hover:border-[#67829e]/40'}`}
                    >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors
                            ${dragOver ? 'bg-teal-100 text-teal-600' : 'bg-[#67829e]/10 text-[#67829e] group-hover:bg-[#67829e]/20'}`}>
                            <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900 mb-1">Drag & drop images here</p>
                        <p className="text-slate-500 text-sm mb-5">or click to browse (JPG, PNG, WebP — max 5 images)</p>
                        <div className="inline-flex items-center gap-2 rounded-xl h-10 px-5 border border-[#67829e]/20 bg-[#67829e]/5 text-[#67829e] text-sm font-bold hover:bg-[#67829e]/10 transition-all">
                            <span className="material-symbols-outlined text-lg">photo_library</span>
                            Select Images
                        </div>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                        />
                    </div>

                    {/* Previews */}
                    {previews.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg text-[#67829e]">collections</span>
                                    Selected Images
                                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{previews.length}/5</span>
                                </p>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                {previews.map((src, i) => (
                                    <div key={i} className="relative group rounded-xl overflow-hidden aspect-square border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
                                        <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center
                                                opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                                        >
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </button>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute bottom-2 left-2 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            Image {i + 1}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Base Price */}
                    <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-xl p-6 shadow-lg">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                            <span className="material-symbols-outlined text-lg text-[#67829e]">currency_rupee</span>
                            Original Product Price (₹)
                        </label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-xl">payments</span>
                            <input
                                id="base-price"
                                type="number"
                                min="1"
                                step="0.01"
                                value={basePrice}
                                onChange={(e) => setBasePrice(e.target.value)}
                                placeholder="e.g. 15000"
                                className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-[#67829e] focus:border-transparent transition-all placeholder:text-slate-300 text-sm font-medium"
                            />
                        </div>
                        <p className="text-slate-400 text-xs mt-2 flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">info</span>
                            Enter the original/retail price. We'll recommend a fair price based on detected damage.
                        </p>
                    </div>

                    {/* Submit */}
                    <button
                        id="analyze-btn"
                        type="submit"
                        disabled={isProcessing || files.length === 0}
                        className="w-full h-14 rounded-xl bg-gradient-to-r from-[#67829e] to-teal-400 text-white font-bold text-base shadow-lg shadow-[#67829e]/20 hover:shadow-[#67829e]/40 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? (
                            <LoadingSpinner size="sm" />
                        ) : (
                            <>
                                <span className="material-symbols-outlined">search</span>
                                Run AI Analysis
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
