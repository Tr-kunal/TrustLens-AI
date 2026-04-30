import { motion } from 'framer-motion';

export default function SubmitSection({ isValid, isSubmitting }) {
  return (
    <div className="space-y-6">
      {/* Submit button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={!isSubmitting ? { scale: 1.02, y: -2 } : {}}
        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
        className={`relative w-full py-4 px-8 rounded-2xl font-semibold text-base tracking-wide overflow-hidden
          transition-all duration-500 group
          ${isSubmitting
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 text-gray-900 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40'
          }`}
      >
        {/* Shimmer effect */}
        {!isSubmitting && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        )}

        <span className="relative flex items-center justify-center gap-3">
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              Predict Real Price
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </span>
      </motion.button>

      {/* Trust badges */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-purple-500/10 border border-purple-500/20">
            <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          </div>
          <span>Powered by <span className="text-purple-400 font-medium">YOLOv8 AI</span></span>
        </div>

        <div className="w-px h-4 bg-white/10 hidden sm:block" />

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20">
            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <span><span className="text-emerald-400 font-medium">256-bit</span> Encrypted</span>
        </div>

        <div className="w-px h-4 bg-white/10 hidden sm:block" />

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-cyan-500/10 border border-cyan-500/20">
            <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span>Results in <span className="text-cyan-400 font-medium">&lt;30 sec</span></span>
        </div>
      </div>
    </div>
  );
}
