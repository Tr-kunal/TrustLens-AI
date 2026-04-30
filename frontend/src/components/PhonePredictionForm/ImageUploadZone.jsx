import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageUploadZone({ images, onImagesChange, error }) {
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = useCallback((fileList) => {
    const validFiles = Array.from(fileList).filter(f =>
      f.type.startsWith('image/') && f.size <= 10 * 1024 * 1024
    );

    if (validFiles.length === 0) return;

    const newImages = validFiles.map(file => ({
      file,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(1),
    }));

    onImagesChange(prev => {
      const combined = [...prev, ...newImages].slice(0, 5);
      return combined;
    });
  }, [onImagesChange]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleFileInput = (e) => {
    processFiles(e.target.files);
    e.target.value = '';
  };

  const removeImage = (id) => {
    onImagesChange(prev => {
      const img = prev.find(i => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter(i => i.id !== id);
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-300 tracking-wide">
          Product Images <span className="text-cyan-400">*</span>
        </label>
        <span className="text-xs text-gray-500">{images.length}/5 images</span>
      </div>

      {/* Drop zone */}
      <motion.label
        htmlFor="image-upload-input"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.005 }}
        className={`relative flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300
          ${isDragging
            ? 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_40px_rgba(0,212,255,0.15)]'
            : error
              ? 'border-red-500/50 bg-red-500/5 hover:border-red-400/60'
              : 'border-white/15 bg-white/[0.02] hover:border-cyan-400/40 hover:bg-white/[0.04]'
          }
          ${images.length >= 5 ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          type="file"
          id="image-upload-input"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={images.length >= 5}
        />

        {/* Camera icon */}
        <div className={`p-4 rounded-2xl transition-all duration-300 ${isDragging ? 'bg-cyan-400/20' : 'bg-white/5'}`}>
          <svg className={`w-8 h-8 transition-colors duration-300 ${isDragging ? 'text-cyan-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
          </svg>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-300">
            <span className="text-cyan-400 font-semibold">Click to upload</span>
            {' '}or drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP up to 10MB • Max 5 images</p>
        </div>

        {/* Animated border glow on drag */}
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 rounded-2xl border-2 border-cyan-400 pointer-events-none"
            style={{
              boxShadow: '0 0 30px rgba(0, 212, 255, 0.2), inset 0 0 30px rgba(0, 212, 255, 0.05)',
            }}
          />
        )}
      </motion.label>

      {/* Preview thumbnails */}
      <AnimatePresence mode="popLayout">
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-3 sm:grid-cols-5 gap-3"
          >
            {images.map((img, idx) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: idx * 0.05 }}
                className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5"
              >
                <img
                  src={img.preview}
                  alt={img.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500/90 backdrop-blur-sm flex items-center justify-center
                    opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 hover:bg-red-400"
                >
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* File size */}
                <span className="absolute bottom-1.5 left-1.5 text-[9px] text-white/70 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded-md
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {img.size} MB
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400">
          {error}
        </motion.p>
      )}
    </div>
  );
}
