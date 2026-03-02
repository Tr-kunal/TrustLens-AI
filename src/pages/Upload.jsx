import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import { HiCloudUpload, HiPhotograph, HiX, HiCurrencyDollar } from 'react-icons/hi'

export default function Upload() {
    const [files, setFiles] = useState([])
    const [previews, setPreviews] = useState([])
    const [basePrice, setBasePrice] = useState('')
    const [uploading, setUploading] = useState(false)
    const [analyzing, setAnalyzing] = useState(false)
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
            // Step 1: Upload images
            setUploading(true)
            const formData = new FormData()
            files.forEach((f) => formData.append('files', f))
            const uploadRes = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            setUploading(false)

            // Step 2: Analyze
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
        <div className="min-h-screen pt-24 pb-12">
            <div className="section-container max-w-3xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold mb-2">Upload Product Images</h1>
                    <p className="text-dark-400">Upload up to 5 images for AI-powered condition analysis</p>
                </div>

                {/* Loading Overlay */}
                {isProcessing && (
                    <div className="fixed inset-0 z-50 bg-dark-950/80 backdrop-blur-sm flex items-center justify-center">
                        <div className="glass-card p-10 text-center max-w-sm">
                            <LoadingSpinner size="xl" />
                            <h3 className="text-xl font-semibold mt-6 mb-2">
                                {uploading ? 'Uploading Images...' : 'Running AI Analysis...'}
                            </h3>
                            <p className="text-dark-400 text-sm">
                                {uploading
                                    ? 'Securely uploading your product images'
                                    : 'Detecting damage, scoring severity, and generating report'}
                            </p>
                            {analyzing && (
                                <div className="mt-4 space-y-2 text-xs text-dark-500">
                                    <p>🔍 Running YOLOv8 damage detection...</p>
                                    <p>📊 Computing severity score...</p>
                                    <p>💰 Calculating price recommendation...</p>
                                    <p>📝 Generating AI explanation...</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Drop Zone */}
                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => fileRef.current?.click()}
                        className="glass-card border-dashed border-2 border-white/10 hover:border-primary-500/40
              p-12 text-center cursor-pointer transition-all duration-300 group hover:bg-white/5"
                    >
                        <HiCloudUpload className="w-14 h-14 text-dark-500 mx-auto mb-4 group-hover:text-primary-400 transition-colors" />
                        <p className="text-lg font-medium mb-1">Drag & drop images here</p>
                        <p className="text-dark-400 text-sm mb-4">or click to browse (JPG, PNG, WebP — max 5)</p>
                        <div className="btn-secondary inline-flex items-center gap-2 text-sm !py-2">
                            <HiPhotograph className="w-4 h-4" />
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
                            <p className="text-sm font-medium text-dark-300 mb-3">
                                Selected Images ({previews.length}/5)
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                {previews.map((src, i) => (
                                    <div key={i} className="relative group rounded-xl overflow-hidden aspect-square">
                                        <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeFile(i)}
                                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500/80 text-white flex items-center justify-center
                        opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                        >
                                            <HiX className="w-4 h-4" />
                                        </button>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Base Price */}
                    <div className="glass-card p-6">
                        <label className="block text-sm font-medium text-dark-300 mb-2">
                            Original Product Price (₹)
                        </label>
                        <div className="relative">
                            <HiCurrencyDollar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500 w-5 h-5" />
                            <input
                                id="base-price"
                                type="number"
                                min="1"
                                step="0.01"
                                value={basePrice}
                                onChange={(e) => setBasePrice(e.target.value)}
                                placeholder="e.g. 15000"
                                className="input-field !pl-11"
                            />
                        </div>
                        <p className="text-dark-500 text-xs mt-2">
                            Enter the original/retail price. We'll recommend a fair price based on detected damage.
                        </p>
                    </div>

                    {/* Submit */}
                    <button
                        id="analyze-btn"
                        type="submit"
                        disabled={isProcessing || files.length === 0}
                        className="btn-primary w-full text-lg !py-4 flex items-center justify-center gap-2"
                    >
                        {isProcessing ? <LoadingSpinner size="sm" /> : '🔍 Run AI Analysis'}
                    </button>
                </form>
            </div>
        </div>
    )
}
