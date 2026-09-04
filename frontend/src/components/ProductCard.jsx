import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // Approximate starting EMI
  const startingPrice = product.startingPrice || 100000;
  const startingEMI = Math.round(startingPrice / 60);

  return (
    <div className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 overflow-hidden flex flex-col justify-between">
      <Link
        to={`/products/${product.slug || product._id}`}
        className="block p-6 flex-1 flex flex-col"
        aria-label={`View ${product.name} EMI plans`}
      >
        {/* Top Badges */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
            {product.brand || 'Flagship'}
          </span>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>MF Backed EMI</span>
          </span>
        </div>

        {/* Product Image Stage */}
        <div className="w-full aspect-[4/3] bg-gradient-to-b from-slate-50 to-slate-100/50 rounded-2xl p-4 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
          <img
            src={product.thumbnail || '/assets/iphone-natural.svg'}
            alt={product.name}
            className="w-full h-full object-contain filter drop-shadow-sm"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/assets/iphone-natural.svg';
            }}
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Pricing & EMI Teaser */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Price Starting At
                </span>
                <span className="text-xl font-black text-slate-900">
                  ₹{startingPrice?.toLocaleString?.('en-IN')}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                  MF EMI From
                </span>
                <span className="text-sm font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                  ₹{startingEMI?.toLocaleString?.('en-IN')}/mo
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Action Footer */}
      <div className="px-6 pb-6 pt-0">
        <Link
          to={`/products/${product.slug || product._id}`}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs tracking-wide transition-all flex items-center justify-center space-x-1.5 shadow-sm group-hover:shadow-md"
        >
          <span>Explore EMI Options</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
