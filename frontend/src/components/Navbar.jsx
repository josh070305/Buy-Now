import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            1Fi
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 tracking-tight text-lg">1Fi Store</span>
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100">
                MF EMI
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Smartphones backed by Mutual Funds</p>
          </div>
        </Link>

        {/* Feature Badges / Navigation */}
        <div className="flex items-center space-x-4 sm:space-x-6 text-sm">
          <Link
            to="/"
            className="text-slate-600 hover:text-indigo-600 font-medium transition-colors hidden md:flex items-center space-x-1"
          >
            <span>Browse Products</span>
          </Link>

          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>0% Interest • ₹0 Down Payment</span>
          </div>

          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              alert("1Fi Mutual Fund EMI: Instead of breaking your Mutual Fund investments or paying high credit card interest, 1Fi lets you pledge units to unlock instant zero-cost EMIs while your mutual funds continue to grow!");
            }}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>How MF EMI Works</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
