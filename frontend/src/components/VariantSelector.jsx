import React from 'react';

const VariantSelector = ({ variants = [], selectedVariantId, onChange }) => {
  if (!variants || variants.length === 0) return null;

  const currentVariant = variants.find(v => v._id === selectedVariantId) || variants[0];

  // Extract unique storage options
  const storageOptions = Array.from(
    new Set(variants.map(v => v.storage || (v.label.match(/\d+GB|\d+TB/i)?.[0]) || 'Standard'))
  );

  // Extract finishes/colors
  const uniqueFinishes = [];
  const seenColors = new Set();
  variants.forEach(v => {
    const colorKey = v.colorName || v.label;
    if (!seenColors.has(colorKey)) {
      seenColors.add(colorKey);
      uniqueFinishes.push({
        id: v._id,
        colorName: v.colorName || v.label,
        colorHex: v.colorHex || '#64748B',
        storage: v.storage,
        variant: v
      });
    }
  });

  const handleStorageChange = (storage) => {
    // Find a variant that matches this storage and prefer same color if possible
    const matchSameColor = variants.find(
      v => (v.storage === storage || v.label.includes(storage)) && v.colorName === currentVariant.colorName
    );
    const fallbackMatch = variants.find(
      v => v.storage === storage || v.label.includes(storage)
    );
    if (matchSameColor) onChange(matchSameColor._id);
    else if (fallbackMatch) onChange(fallbackMatch._id);
  };

  const handleFinishChange = (finish) => {
    // Find variant with this finish and prefer current storage
    const matchSameStorage = variants.find(
      v => (v.colorName === finish.colorName) && (v.storage === currentVariant.storage)
    );
    const fallbackMatch = variants.find(
      v => v.colorName === finish.colorName
    );
    if (matchSameStorage) onChange(matchSameStorage._id);
    else if (fallbackMatch) onChange(fallbackMatch._id);
    else onChange(finish.id);
  };

  return (
    <div className="space-y-4">
      {/* 1. Storage Selection Pills */}
      {storageOptions.length > 1 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Storage Capacity
            </span>
            <span className="text-xs font-semibold text-slate-700">
              {currentVariant.storage || 'Selected'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {storageOptions.map((storage) => {
              const isSelected = (currentVariant.storage === storage) || currentVariant.label.includes(storage);
              return (
                <button
                  key={storage}
                  type="button"
                  onClick={() => handleStorageChange(storage)}
                  className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {storage}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Color Finish Swatches - Exact match to Reference "Available in X finishes" */}
      {uniqueFinishes.length > 1 && (
        <div className="pt-2 flex flex-col items-center text-center">
          <span className="text-xs text-slate-500 font-medium mb-2.5">
            Available in {uniqueFinishes.length} finishes
          </span>

          <div className="flex items-center justify-center space-x-2.5">
            {uniqueFinishes.map((finish) => {
              const isSelected = currentVariant.colorName === finish.colorName;
              return (
                <button
                  key={finish.id}
                  type="button"
                  title={finish.colorName}
                  onClick={() => handleFinishChange(finish)}
                  className={`group relative flex items-center justify-center w-5 h-5 rounded-full transition-all focus:outline-none ${
                    isSelected
                      ? 'ring-2 ring-indigo-600 ring-offset-2 scale-110'
                      : 'hover:scale-105 opacity-85 hover:opacity-100 ring-1 ring-slate-300'
                  }`}
                >
                  <span
                    className="w-full h-full rounded-full border border-black/10 shadow-inner"
                    style={{ backgroundColor: finish.colorHex }}
                  />
                  {/* Tooltip on hover */}
                  <span className="absolute -top-7 scale-0 group-hover:scale-100 transition-all text-[10px] font-semibold bg-slate-900 text-white px-2 py-0.5 rounded shadow-lg whitespace-nowrap pointer-events-none z-20">
                    {finish.colorName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default VariantSelector;
