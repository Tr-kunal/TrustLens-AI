import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BRANDS } from '../../data/phoneData';

export default function BrandSelector({ value, onChange, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const selectedBrand = BRANDS.find(b => b.value === value);

  const filtered = BRANDS.filter(b =>
    b.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (brand) => {
    onChange(brand.value);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-300 tracking-wide">
        Brand Name <span className="text-cyan-400">*</span>
      </label>
      <div className="relative">
        <button
          type="button"
          id="brand-selector"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) setTimeout(() => inputRef.current?.focus(), 100);
          }}
          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all duration-300
            ${isOpen
              ? 'bg-white/10 border-cyan-400/50 ring-2 ring-cyan-400/20 shadow-[0_0_20px_rgba(0,212,255,0.1)]'
              : error
                ? 'bg-white/5 border-red-500/50 hover:border-red-400/70'
                : 'bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/[0.07]'
            }`}
        >
          {selectedBrand ? (
            <>
              <span className="text-xl">{selectedBrand.icon}</span>
              <span className="text-white font-medium">{selectedBrand.label}</span>
            </>
          ) : (
            <span className="text-gray-500">Select phone brand...</span>
          )}
          <svg
            className={`ml-auto w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute z-50 w-full mt-2 rounded-xl border border-white/10 bg-[#12121a]/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden"
            >
              <div className="p-2 border-b border-white/5">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search brands..."
                    className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/40"
                  />
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
                {filtered.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center">No brands found</div>
                ) : (
                  filtered.map((brand) => (
                    <button
                      key={brand.value}
                      type="button"
                      onClick={() => handleSelect(brand)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150
                        ${value === brand.value
                          ? 'bg-cyan-400/10 text-cyan-400'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      <span className="text-lg">{brand.icon}</span>
                      <span className="text-sm font-medium">{brand.label}</span>
                      {value === brand.value && (
                        <svg className="ml-auto w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))
                )}
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
