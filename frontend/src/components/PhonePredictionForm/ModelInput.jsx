import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MODEL_SUGGESTIONS } from '../../data/phoneData';

export default function ModelInput({ value, onChange, brand, error }) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  const suggestions = brand ? (MODEL_SUGGESTIONS[brand] || []) : [];
  const filtered = suggestions.filter(m =>
    m.toLowerCase().includes((value || '').toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-2" ref={wrapperRef}>
      <label className="block text-sm font-medium text-gray-300 tracking-wide">
        Model Name <span className="text-cyan-400">*</span>
      </label>
      <div className="relative">
        <input
          type="text"
          id="model-input"
          value={value || ''}
          onChange={e => {
            onChange(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            if (filtered.length > 0) setShowSuggestions(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder={brand ? `Enter ${brand} model name...` : 'Select a brand first...'}
          disabled={!brand}
          className={`w-full px-4 py-3.5 rounded-xl border text-white placeholder-gray-500 transition-all duration-300
            disabled:opacity-40 disabled:cursor-not-allowed
            ${isFocused
              ? 'bg-white/10 border-cyan-400/50 ring-2 ring-cyan-400/20 shadow-[0_0_20px_rgba(0,212,255,0.1)]'
              : error
                ? 'bg-white/5 border-red-500/50'
                : 'bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/[0.07]'
            }
            focus:outline-none`}
        />

        <AnimatePresence>
          {showSuggestions && filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute z-50 w-full mt-2 rounded-xl border border-white/10 bg-[#12121a]/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden"
            >
              <div className="max-h-52 overflow-y-auto py-1 custom-scrollbar">
                {filtered.map((model) => (
                  <button
                    key={model}
                    type="button"
                    onClick={() => {
                      onChange(model);
                      setShowSuggestions(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-150
                      ${value === model
                        ? 'bg-cyan-400/10 text-cyan-400'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 mt-1">
          {error}
        </motion.p>
      )}
    </div>
  );
}
