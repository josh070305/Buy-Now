import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductBySlug } from '../services/api';
import Navbar from '../components/Navbar';
import ProductGallery from '../components/ProductGallery';
import VariantSelector from '../components/VariantSelector';
import EMIPlanList from '../components/EMIPlanList';
import ProceedModal from '../components/ProceedModal';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getProductBySlug(slug);
        const payload = res.data?.data || res.data;
        setProduct(payload);

        // Select first variant and first plan by default
        const firstVariant = payload?.variants?.[0];
        if (firstVariant) {
          setSelectedVariantId(firstVariant._id);
          const defaultPlan = firstVariant.emiPlans?.find(p => p.isPopular) || firstVariant.emiPlans?.[0];
          setSelectedPlanId(defaultPlan?._id || null);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError(err?.response?.data?.error?.message || err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500">Loading product & mutual fund EMI plans...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{error || 'Product Not Found'}</h2>
          <p className="text-sm text-slate-500">The product you requested could not be retrieved from the database.</p>
          <Link
            to="/"
            className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm shadow-md hover:bg-indigo-700 transition-all"
          >
            ← Return to Store Catalog
          </Link>
        </div>
      </div>
    );
  }

  const selectedVariant = product.variants?.find(v => v._id === selectedVariantId) || product.variants?.[0];
  const selectedPlan = selectedVariant?.emiPlans?.find(p => p._id === selectedPlanId) || selectedVariant?.emiPlans?.[0];

  const savingsAmount = selectedVariant ? Math.max(0, (selectedVariant.mrp || 0) - selectedVariant.price) : 0;
  const discountPercent = selectedVariant?.mrp ? Math.round((savingsAmount / selectedVariant.mrp) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* Breadcrumb Navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <nav className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/" className="hover:text-indigo-600 transition-colors">{product.category || 'Smartphones'}</Link>
          <span>/</span>
          <span className="text-slate-700 font-semibold truncate">{product.name}</span>
        </nav>
      </div>

      {/* Main Content Area - Styled faithfully after the Snapmint/1Fi reference */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-20">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* LEFT COLUMN: Product Visual & Finish Selector */}
            <div className="lg:col-span-5 flex flex-col justify-start">
              {/* Product Header info (above gallery, exact match to reference screenshot) */}
              <div className="mb-4">
                <span className="text-xs font-semibold text-rose-500 lowercase block mb-0.5">
                  new
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-sm font-semibold text-slate-500">
                    {selectedVariant?.storage || selectedVariant?.label}
                  </p>
                  <span className="text-slate-300">•</span>
                  <div className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold">
                    <span>★ 4.8</span>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    70+ sold on EMI
                  </span>
                </div>
              </div>

              {/* High-res Stage & Gallery */}
              <ProductGallery
                images={selectedVariant?.images || []}
                alt={`${product.name} ${selectedVariant?.label}`}
                isNew={false}
              />

              {/* Color Finish Swatches - Exact match to reference "Available in 3 finishes" */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <VariantSelector
                  variants={product.variants || []}
                  selectedVariantId={selectedVariantId}
                  onChange={(newVariantId) => {
                    setSelectedVariantId(newVariantId);
                    const newVar = product.variants.find(v => v._id === newVariantId);
                    if (newVar?.emiPlans?.length) {
                      // Keep matching tenure if exists, or pick popular
                      const matchingPlan = newVar.emiPlans.find(p => p.tenureMonths === selectedPlan?.tenureMonths) || newVar.emiPlans[0];
                      setSelectedPlanId(matchingPlan._id);
                    }
                  }}
                />
              </div>

              {/* Description preview */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-50/70 border border-slate-100 text-xs text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-800 block mb-1">Key Highlights:</span>
                {product.description}
              </div>

              {/* Trust & Guarantees - Snapmint signature assurance */}
              <div className="mt-3 p-3.5 rounded-2xl bg-indigo-50/40 border border-indigo-100/60">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Shop with Confidence
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>100% Genuine</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>2 Days Replacement</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>Free Delivery</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>1Fi Mutual Fund Backed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Pricing, MF Banner, and Stack of EMI Plan Cards */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                {/* 1. Price Header - Exact layout as reference screenshot */}
                <div className="pb-5 border-b border-slate-100">
                  <div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                      ₹{selectedVariant?.price?.toLocaleString?.('en-IN')}
                    </div>
                    {selectedVariant?.mrp && selectedVariant.mrp > selectedVariant.price && (
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm sm:text-base text-slate-400 line-through font-medium">
                          ₹{selectedVariant.mrp.toLocaleString('en-IN')}
                        </span>
                        {savingsAmount > 0 && (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Save ₹{savingsAmount.toLocaleString('en-IN')} ({discountPercent}% OFF)
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Subtitle exact match to assignment PDF */}
                  <div className="mt-4 flex items-center justify-between">
                    <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
                      EMI plans backed by mutual funds
                    </h2>

                    <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                      ₹0 Down Payment
                    </span>
                  </div>
                </div>

                {/* 2. List of Available EMI Plans */}
                <div className="mt-5">
                  <EMIPlanList
                    plans={selectedVariant?.emiPlans || []}
                    selectedPlanId={selectedPlanId}
                    onChange={setSelectedPlanId}
                  />
                </div>
              </div>

              {/* 3. Bottom Sticky Action Section */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <div className="text-xs text-slate-500 font-medium">Selected Repayment Plan</div>
                    <div className="text-base font-extrabold text-slate-900">
                      {selectedPlan
                        ? `₹${selectedPlan.monthlyAmount?.toLocaleString?.('en-IN')}/month • ${selectedPlan.tenureMonths} Months`
                        : 'Please select an EMI plan'}
                    </div>
                    {selectedPlan?.cashback > 0 && (
                      <div className="text-xs font-semibold text-emerald-600">
                        Includes ₹{selectedPlan.cashback.toLocaleString('en-IN')} Cashback
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    disabled={!selectedPlan}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center space-x-2"
                  >
                    <span>Proceed with selected plan</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Checkout Modal */}
      <ProceedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
        variant={selectedVariant}
        plan={selectedPlan}
      />
    </div>
  );
};

export default ProductDetailPage;
