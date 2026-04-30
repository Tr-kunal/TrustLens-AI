import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api/axios';
import BrandSelector from '../components/PhonePredictionForm/BrandSelector';
import ModelInput from '../components/PhonePredictionForm/ModelInput';
import SpecsSelector from '../components/PhonePredictionForm/SpecsSelector';
import ImageUploadZone from '../components/PhonePredictionForm/ImageUploadZone';
import SubmitSection from '../components/PhonePredictionForm/SubmitSection';
import AnalysisResults from '../components/PhonePredictionForm/AnalysisResults';
import { generateAnalysis } from '../data/priceDatabase';

const STEPS = [
  { id: 1, label: 'Details', icon: '📝' },
  { id: 2, label: 'Upload', icon: '📸' },
  { id: 3, label: 'Predict', icon: '🤖' },
];

function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8 sm:mb-10">
      {STEPS.map((step, idx) => {
        const isActive = step.id <= currentStep;
        const isCurrent = step.id === currentStep;
        return (
          <div key={step.id} className="flex items-center">
            <motion.div
              initial={false}
              animate={{
                scale: isCurrent ? 1.05 : 1,
              }}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-500
                ${isCurrent
                  ? 'bg-cyan-400/15 text-cyan-400 border border-cyan-400/30 shadow-[0_0_15px_rgba(0,212,255,0.1)]'
                  : isActive
                    ? 'bg-white/5 text-cyan-400/70 border border-white/5'
                    : 'bg-white/[0.02] text-gray-600 border border-white/5'
                }`}
            >
              <span className="text-sm">{step.icon}</span>
              <span className="hidden sm:inline">{step.label}</span>
            </motion.div>
            {idx < STEPS.length - 1 && (
              <div className={`w-6 sm:w-10 h-px mx-1 transition-colors duration-500 ${isActive ? 'bg-cyan-400/30' : 'bg-white/5'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function PhonePrediction() {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [condition, setCondition] = useState('');
  const [storage, setStorage] = useState('');
  const [ram, setRam] = useState('');
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const mainRef = useRef(null);

  // Calculate current step
  const hasDetails = brand && model && condition && storage && ram;
  const hasImages = images.length > 0;
  const currentStep = hasDetails && hasImages ? 3 : hasDetails ? 2 : 1;

  const validate = () => {
    const errs = {};
    if (!brand) errs.brand = 'Please select a brand';
    if (!model) errs.model = 'Please enter the model name';
    if (!condition) errs.condition = 'Please select a condition';
    if (!storage) errs.storage = 'Please select storage';
    if (!ram) errs.ram = 'Please select RAM';
    if (images.length === 0) errs.images = 'Please upload at least one image';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBrandChange = (val) => {
    setBrand(val);
    setModel('');
    setErrors(prev => ({ ...prev, brand: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Generate client-side analysis for pricing/recommendations display
    const localResult = generateAnalysis({ brand, model, condition, storage, ram, images });

    try {
      // Step 1: Upload images to backend
      const formData = new FormData();
      images.forEach((img) => {
        formData.append('files', img.file);
      });

      const uploadRes = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const imageUrls = uploadRes.data.image_urls;

      // Step 2: Call /analyze with uploaded image URLs and base price
      const analyzeRes = await api.post('/analyze', {
        image_urls: imageUrls,
        base_price: localResult.pricing.originalPrice,
      });

      const backendReport = analyzeRes.data;
      console.log('📱 TrustLens AI — Backend Report:', backendReport);

      // Step 3: Merge backend YOLO detections + severity into the local result
      // so the rich UI still renders properly, but data comes from real AI
      const mergedDetections = (backendReport.detections || []).map((d) => ({
        type: d.label,
        label: d.label.charAt(0).toUpperCase() + d.label.slice(1),
        confidence: d.confidence,
        area: d.area_pct || 0,
        severity: d.confidence >= 0.9 ? 'Critical' : d.confidence >= 0.75 ? 'High' : d.confidence >= 0.5 ? 'Medium' : 'Low',
      }));

      const mergedResult = {
        ...localResult,
        // Override analysis with real backend data
        analysis: {
          ...localResult.analysis,
          severityScore: backendReport.severity ?? localResult.analysis.severityScore,
          detections: mergedDetections.length > 0 ? mergedDetections : localResult.analysis.detections,
          totalDamageArea: mergedDetections.length > 0
            ? mergedDetections.reduce((sum, d) => sum + d.area, 0).toFixed(1)
            : localResult.analysis.totalDamageArea,
          imagesAnalyzed: imageUrls.length,
        },
        pricing: {
          ...localResult.pricing,
          predictedPrice: backendReport.recommended_price ?? localResult.pricing.predictedPrice,
          priceLow: Math.round((backendReport.recommended_price ?? localResult.pricing.predictedPrice) * 0.92),
          priceHigh: Math.round((backendReport.recommended_price ?? localResult.pricing.predictedPrice) * 1.08),
        },
        backendReportId: backendReport.id,
        explanation: backendReport.explanation,
      };

      setAnalysisResult(mergedResult);
      toast.success('Report generated & saved to your dashboard!');
    } catch (err) {
      console.warn('⚠️ Backend analysis failed, using local analysis:', err);
      // Fallback: use client-side analysis (report won't be saved to DB)
      setAnalysisResult(localResult);
      const isAuthError = err.response?.status === 401;
      if (isAuthError) {
        toast.error('Please log in to save reports to your dashboard.');
      } else {
        toast('Analysis complete (offline mode — not saved to dashboard)', { icon: '⚠️' });
      }
    } finally {
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setBrand(''); setModel(''); setCondition(''); setStorage(''); setRam('');
    setImages([]); setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImagesChange = useCallback((updater) => {
    setImages(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return next;
    });
    setErrors(prev => ({ ...prev, images: undefined }));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Background ambient effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/[0.015] rounded-full blur-[150px]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 blur-md opacity-40 -z-10" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                TrustLens <span className="text-cyan-400">AI</span>
              </h1>
              <p className="text-[10px] text-gray-500 -mt-0.5 tracking-wider uppercase">Price Verification</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">AI Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main ref={mainRef} className={`relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 ${analysisResult ? 'max-w-4xl' : 'max-w-2xl'}`}>
        <AnimatePresence mode="wait">
          {analysisResult ? (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <AnalysisResults result={analysisResult} onReset={handleReset} />
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              {/* Page title */}
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Phone Price <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Prediction</span>
                </h2>
                <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">Upload your phone details and images for an instant AI-powered real market price estimate.</p>
              </motion.div>

              <StepIndicator currentStep={currentStep} />

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                className="relative rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/20">
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
                <form onSubmit={handleSubmit} className="space-y-7">
                  <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
                    <BrandSelector value={brand} onChange={handleBrandChange} error={errors.brand} />
                  </motion.div>
                  <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
                    <ModelInput value={model} onChange={(v) => { setModel(v); setErrors(prev => ({...prev, model: undefined})); }} brand={brand} error={errors.model} />
                  </motion.div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/5" />
                    <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">Specifications</span>
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/5" />
                  </div>
                  <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
                    <SpecsSelector condition={condition} onConditionChange={(v) => { setCondition(v); setErrors(prev => ({...prev, condition: undefined})); }}
                      storage={storage} onStorageChange={(v) => { setStorage(v); setErrors(prev => ({...prev, storage: undefined})); }}
                      ram={ram} onRamChange={(v) => { setRam(v); setErrors(prev => ({...prev, ram: undefined})); }} errors={errors} />
                  </motion.div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/5" />
                    <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">Product Photos</span>
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/5" />
                  </div>
                  <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
                    <ImageUploadZone images={images} onImagesChange={handleImagesChange} error={errors.images} />
                  </motion.div>
                  <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                  <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
                    <SubmitSection isValid={true} isSubmitting={isSubmitting} />
                  </motion.div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="h-12" />
      </main>
    </div>
  );
}
