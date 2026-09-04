import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/api';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts();
        const items = response.data?.data || response.data || [];
        setProducts(items);
      } catch (err) {
        console.error('Error fetching catalog:', err);
        setError(err?.response?.data?.error?.message || err.message || 'Failed to connect to backend server');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const brands = ['All', ...new Set(products.map(p => p.brand).filter(Boolean))];
  const filteredProducts = selectedBrand === 'All'
    ? products
    : products.filter(p => p.brand === selectedBrand);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* Hero Banner with 1Fi Value Proposition */}
      <section className="bg-gradient-to-b from-indigo-900 via-indigo-800 to-slate-900 text-white py-14 sm:py-18 px-4 sm:px-6 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-indigo-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>1Fi Flagship Financial Innovation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight sm:leading-tight">
            Buy Now on Zero-Cost EMI <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-emerald-300">
              Backed by Mutual Funds
            </span>
          </h1>

          <p className="text-sm sm:text-base text-indigo-100/80 max-w-2xl mx-auto font-normal leading-relaxed">
            Don't liquidate your investments or pay 16% credit card interest. Pledge your mutual fund portfolio to get instant smartphone EMIs with <strong>₹0 down payment</strong> while your wealth keeps compounding.
          </p>

          {/* 3 Pillar Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-200">
            <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/10">
              <span className="text-emerald-400">✓</span>
              <span>₹0 Down Payment</span>
            </div>
            <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/10">
              <span className="text-emerald-400">✓</span>
              <span>0% Interest Plans</span>
            </div>
            <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/10">
              <span className="text-emerald-400">✓</span>
              <span>Up to ₹7,500 Cashback</span>
            </div>
            <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/10">
              <span className="text-emerald-400">✓</span>
              <span>Mutual Funds Keep Growing</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Section Header & Brand Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Featured Flagship Smartphones
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select a device to view customizable monthly installment options
            </p>
          </div>

          {/* Brand Filter Pills */}
          {brands.length > 2 && (
            <div className="flex items-center space-x-2 overflow-x-auto pb-1">
              {brands.map(brand => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedBrand === brand
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* State Renderers */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-slate-500">Connecting to product API...</p>
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto font-bold">!</div>
            <h3 className="text-base font-bold text-rose-900">Failed to load catalog</h3>
            <p className="text-xs text-rose-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p className="text-base font-semibold">No smartphones found in this category.</p>
          </div>
        )}

        {/* Product Cards Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Trust & FAQ Footer Banner */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mx-auto md:mx-0">
              ₹
            </div>
            <h4 className="text-sm font-bold text-slate-900">Zero Liquidations</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your mutual funds stay invested in your folio and continue earning NAV compounding throughout the tenure.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mx-auto md:mx-0">
              ⚡
            </div>
            <h4 className="text-sm font-bold text-slate-900">Instant Online Approval</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Digital lien marking on CAMS/KFintech records allows paperless setup in under 2 minutes.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mx-auto md:mx-0">
              🛡️
            </div>
            <h4 className="text-sm font-bold text-slate-900">RBI Regulated NBFCs</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Credit facilities powered by institutional banking partners with complete transparency and zero hidden fees.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© 2026 1Fi Full-Stack SDE1 Project Submission</p>
          <p>Built with React 19, Tailwind CSS, Express, and MongoDB</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
