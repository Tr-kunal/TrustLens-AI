import { useState } from 'react';
import { motion } from 'framer-motion';
import { generatePdf } from '../../utils/generatePdf';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

function SeverityGauge({ score }) {
  const pct = (score / 10) * 100;
  const color = score <= 2 ? '#00e68a' : score <= 5 ? '#ffd000' : score <= 7 ? '#ff8c00' : '#ff4060';
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
          <circle cx="60" cy="60" r="52" fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={`${pct * 3.267} 326.7`} strokeLinecap="round"
            className="transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{score}</span>
          <span className="text-[10px] text-gray-500">/10</span>
        </div>
      </div>
      <span className="text-xs font-medium" style={{ color }}>Severity Score</span>
    </div>
  );
}

function PriceCard({ pricing }) {
  const { originalPrice, predictedPrice, priceLow, priceHigh, discount, marketDiffPercent } = pricing;
  const fmt = (n) => '₹' + n.toLocaleString('en-IN');
  return (
    <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
      className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6 overflow-hidden">
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
          <span className="text-emerald-400 text-sm">💰</span>
        </div>
        <h3 className="text-sm font-semibold text-white">Predicted Market Price</h3>
      </div>
      <div className="text-center py-4">
        <p className="text-xs text-gray-500 line-through mb-1">{fmt(originalPrice)} MRP</p>
        <p className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          {fmt(predictedPrice)}
        </p>
        <p className="text-xs text-gray-500 mt-2">Range: {fmt(priceLow)} — {fmt(priceHigh)}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500 mb-0.5">Discount</p>
          <p className="text-lg font-bold text-orange-400">{(discount * 100).toFixed(0)}%</p>
        </div>
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500 mb-0.5">vs Market</p>
          <p className={`text-lg font-bold ${marketDiffPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {marketDiffPercent >= 0 ? '+' : ''}{marketDiffPercent}%
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ConditionCard({ analysis, phoneInfo }) {
  const gradeColors = { 'A+': '#00d4ff', 'A': '#00e68a', 'B+': '#ffd000', 'C+': '#ff8c00', 'D': '#ff4060' };
  const gradeColor = gradeColors[analysis.grade] || '#ffd000';
  return (
    <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
      className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6 overflow-hidden">
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
          <span className="text-cyan-400 text-sm">🔍</span>
        </div>
        <h3 className="text-sm font-semibold text-white">Condition Analysis</h3>
      </div>
      <div className="flex items-center justify-between gap-4 mb-5">
        <SeverityGauge score={analysis.severityScore} />
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5">
            <span className="text-xs text-gray-400">Grade</span>
            <span className="text-xl font-bold" style={{ color: gradeColor }}>{analysis.grade}</span>
          </div>
          <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5">
            <span className="text-xs text-gray-400">Confidence</span>
            <span className="text-sm font-semibold text-cyan-400">{analysis.confidenceScore}%</span>
          </div>
          <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5">
            <span className="text-xs text-gray-400">Condition</span>
            <span className="text-sm font-semibold text-white">{phoneInfo.condition}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DetectionsCard({ detections, totalDamageArea, imagesAnalyzed }) {
  const sevColors = { Low: '#00e68a', Medium: '#ffd000', High: '#ff8c00', Critical: '#ff4060' };
  if (detections.length === 0) {
    return (
      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
        className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-sm">✅</div>
          <h3 className="text-sm font-semibold text-white">Damage Detection</h3>
        </div>
        <div className="text-center py-6">
          <p className="text-emerald-400 font-semibold">No damage detected</p>
          <p className="text-xs text-gray-500 mt-1">{imagesAnalyzed} image(s) analyzed by YOLOv8</p>
        </div>
      </motion.div>
    );
  }
  return (
    <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
      className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center text-sm">⚡</div>
          <h3 className="text-sm font-semibold text-white">Damage Detection</h3>
        </div>
        <span className="text-xs text-gray-500">{imagesAnalyzed} image(s) • {totalDamageArea}% area</span>
      </div>
      <div className="space-y-2.5">
        {detections.map((d, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: sevColors[d.severity] }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">{d.label}</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ color: sevColors[d.severity], backgroundColor: `${sevColors[d.severity]}15` }}>
                  {d.severity}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[11px] text-gray-500">Confidence: {(d.confidence * 100).toFixed(0)}%</span>
                <span className="text-[11px] text-gray-500">Area: {d.area}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function RecommendationsCard({ recommendations }) {
  return (
    <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible"
      className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center text-sm">💡</div>
        <h3 className="text-sm font-semibold text-white">AI Recommendations</h3>
      </div>
      <div className="space-y-2.5">
        {recommendations.map((rec, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="flex items-start gap-3 bg-white/5 rounded-xl px-4 py-3">
            <span className="text-base mt-0.5 flex-shrink-0">{rec.icon}</span>
            <p className="text-sm text-gray-300 leading-relaxed">{rec.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function PhoneInfoBar({ phoneInfo }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
      {[phoneInfo.brand, phoneInfo.model, phoneInfo.condition, phoneInfo.storage, phoneInfo.ram].map((v, i) => (
        <span key={i} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 font-medium">
          {typeof v === 'string' ? v.charAt(0).toUpperCase() + v.slice(1) : v}
        </span>
      ))}
    </div>
  );
}

export default function AnalysisResults({ result, onReset }) {
  const { phoneInfo, pricing, analysis, recommendations } = result;
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await generatePdf(result);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-semibold">Analysis Complete</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Price <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Analysis Report</span>
        </h2>
      </motion.div>

      {/* Phone info chips */}
      <PhoneInfoBar phoneInfo={phoneInfo} />

      {/* Price + Condition side-by-side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PriceCard pricing={pricing} />
        <ConditionCard analysis={analysis} phoneInfo={phoneInfo} />
      </div>

      {/* Detections */}
      <DetectionsCard detections={analysis.detections} totalDamageArea={analysis.totalDamageArea} imagesAnalyzed={analysis.imagesAnalyzed} />

      {/* Recommendations */}
      <RecommendationsCard recommendations={recommendations} />

      {/* Actions */}
      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible"
        className="flex flex-col sm:flex-row gap-3 pt-2">
        <button onClick={onReset}
          className="flex-1 py-3.5 px-6 rounded-xl border border-white/10 bg-white/5 text-white font-medium
            hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-sm">
          ← Analyze Another Phone
        </button>
        <button onClick={handleDownload} disabled={downloading}
          className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-gray-900 font-semibold
            shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all duration-300 text-sm
            disabled:opacity-60 disabled:cursor-wait">
          {downloading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Generating PDF...
            </span>
          ) : '📄 Download Report'}
        </button>
      </motion.div>

      {/* Footer badges */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2 pb-4">
        <span className="text-[11px] text-gray-600">Generated {new Date(result.timestamp).toLocaleString()}</span>
        <span className="text-[11px] text-gray-600">•</span>
        <span className="text-[11px] text-gray-600">Powered by YOLOv8 AI + TrustLens Engine</span>
      </div>
    </div>
  );
}

