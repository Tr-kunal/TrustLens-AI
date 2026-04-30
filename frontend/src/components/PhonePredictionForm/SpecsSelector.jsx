import { useState } from 'react';
import { motion } from 'framer-motion';
import { CONDITION_OPTIONS, STORAGE_OPTIONS, RAM_OPTIONS } from '../../data/phoneData';

function SelectDropdown({ id, label, options, value, onChange, error, icon }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300 tracking-wide">
        {label} <span className="text-cyan-400">*</span>
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            {icon}
          </span>
        )}
        <select
          id={id}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full appearance-none ${icon ? 'pl-10' : 'pl-4'} pr-10 py-3.5 rounded-xl border text-white transition-all duration-300 cursor-pointer
            ${isFocused
              ? 'bg-white/10 border-cyan-400/50 ring-2 ring-cyan-400/20 shadow-[0_0_20px_rgba(0,212,255,0.1)]'
              : error
                ? 'bg-white/5 border-red-500/50'
                : 'bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/[0.07]'
            }
            focus:outline-none
            [&>option]:bg-[#12121a] [&>option]:text-white`}
        >
          <option value="" disabled className="text-gray-500">Select {label.toLowerCase()}...</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <svg
          className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 mt-1">
          {error}
        </motion.p>
      )}
    </div>
  );
}

function ConditionSelector({ value, onChange, error }) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300 tracking-wide">
        Phone Condition <span className="text-cyan-400">*</span>
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {CONDITION_OPTIONS.map((cond) => {
          const isSelected = value === cond.value;
          return (
            <motion.button
              key={cond.value}
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onChange(cond.value)}
              className={`relative flex flex-col items-center gap-1 px-3 py-3.5 rounded-xl border text-center transition-all duration-300
                ${isSelected
                  ? 'border-transparent shadow-lg'
                  : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
                }`}
              style={isSelected ? {
                background: `linear-gradient(135deg, ${cond.color}15, ${cond.color}08)`,
                borderColor: `${cond.color}60`,
                boxShadow: `0 0 20px ${cond.color}15`,
              } : {}}
            >
              <span
                className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                style={{ backgroundColor: isSelected ? cond.color : '#4a4a5a' }}
              />
              <span
                className="text-sm font-semibold transition-colors duration-300"
                style={{ color: isSelected ? cond.color : '#9ca3af' }}
              >
                {cond.label}
              </span>
              <span className="text-[10px] text-gray-500 leading-tight hidden sm:block">
                {cond.description}
              </span>
            </motion.button>
          );
        })}
      </div>
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 mt-1">
          {error}
        </motion.p>
      )}
    </div>
  );
}

export default function SpecsSelector({
  condition, onConditionChange,
  storage, onStorageChange,
  ram, onRamChange,
  errors = {}
}) {
  return (
    <div className="space-y-6">
      <ConditionSelector value={condition} onChange={onConditionChange} error={errors.condition} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectDropdown
          id="storage-select"
          label="Storage"
          options={STORAGE_OPTIONS}
          value={storage}
          onChange={onStorageChange}
          error={errors.storage}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
          }
        />
        <SelectDropdown
          id="ram-select"
          label="RAM"
          options={RAM_OPTIONS}
          value={ram}
          onChange={onRamChange}
          error={errors.ram}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          }
        />
      </div>
    </div>
  );
}
