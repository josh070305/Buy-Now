import React, { useState, useEffect } from 'react';

const ProductGallery = ({ images = [], alt = '', isNew = true }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  // Reset index when variant images change
  useEffect(() => {
    setActiveIdx(0);
  }, [images]);

  const currentImage = images[activeIdx] || images[0] || '/assets/iphone-natural.svg';

  return (
    <div className="flex flex-col items-center">
      {/* Phone Stage Box */}
      <div className="relative w-full max-w-[340px] aspect-[4/5] bg-white rounded-3xl border border-slate-100 p-6 flex items-center justify-center shadow-sm overflow-hidden group">
        {/* "NEW" pill badge from reference image */}
        {isNew && (
          <div className="absolute top-4 left-4 z-10">
            <span className="text-[11px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full border border-rose-100 shadow-sm">
              NEW
            </span>
          </div>
        )}

        {/* 1Fi MF Backed watermarking */}
        <div className="absolute bottom-3 right-4 z-10 flex items-center space-x-1 text-[10px] font-bold text-slate-400/80 uppercase tracking-wider">
          <svg className="w-3 h-3 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>MF Verified</span>
        </div>

        {/* Product Image */}
        <img
          src={currentImage}
          alt={alt}
          className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300 ease-out"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/assets/iphone-natural.svg';
          }}
        />
      </div>

      {/* Thumbnails if multiple images */}
      {images.length > 1 && (
        <div className="flex items-center space-x-2 mt-3">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={`w-12 h-12 rounded-xl p-1 border transition-all ${
                i === activeIdx
                  ? 'border-indigo-600 ring-2 ring-indigo-600/30'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <img src={src} alt={`${alt} view ${i + 1}`} className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
