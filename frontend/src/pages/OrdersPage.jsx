import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import InvoiceModal from '../components/InvoiceModal';
import { getOrderById } from '../services/api';

const OrdersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const orderIdFromUrl = searchParams.get('id') || '';

  const [searchId, setSearchId] = useState(orderIdFromUrl);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Load recent orders from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('1fi_recent_orders') || '[]');
      setRecentOrders(saved);

      // If URL has id, lookup, else load most recent
      const targetId = orderIdFromUrl || saved[0]?.orderId;
      if (targetId) {
        setSearchId(targetId);
        fetchOrder(targetId);
      }
    } catch (e) {
      console.warn('Failed to parse recent orders:', e);
    }
  }, [orderIdFromUrl]);

  const fetchOrder = async (id) => {
    if (!id || !id.trim()) return;
    try {
      setLoading(true);
      setError(null);

      // Check localStorage first for instant client cache
      const saved = JSON.parse(localStorage.getItem('1fi_recent_orders') || '[]');
      const localMatch = saved.find(o => o.orderId === id.trim() || o._id === id.trim());

      try {
        const res = await getOrderById(id.trim());
        const serverData = res.data?.data || res.data;
        setCurrentOrder({
          ...localMatch,
          ...serverData,
          orderId: serverData._id || serverData.orderId || id.trim(),
        });
      } catch (apiErr) {
        // Fallback to local match if server lookup fails
        if (localMatch) {
          setCurrentOrder(localMatch);
        } else {
          setError('Order not found. Please check your Order ID.');
        }
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Could not retrieve order details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    setSearchParams({ id: searchId.trim() });
    fetchOrder(searchId.trim());
  };

  const product = currentOrder?.productId || currentOrder?.product || { name: 'iPhone 17 Pro' };
  const variant = currentOrder?.variantId || currentOrder?.variant || { label: '256GB Cosmic Orange', colorName: 'Cosmic Orange', price: 127400 };
  const plan = currentOrder?.emiPlanId || currentOrder?.plan || { monthlyAmount: currentOrder?.amount || 44967, tenureMonths: currentOrder?.tenureMonths || 3 };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-24">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium mb-4">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-700 font-semibold">Track Order & Delivery Status</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Order Tracking & Delivery Status
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Live fulfillment, BlueDart courier tracking, and 1Fi Mutual Fund mandate schedule.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Enter Order Reference ID..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs w-64 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 bg-white"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
            >
              Track
            </button>
          </form>
        </div>

        {loading ? (
          <div className="p-16 text-center space-y-3 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-semibold text-slate-500">Retrieving order details from logistics partner...</p>
          </div>
        ) : error ? (
          <div className="p-10 text-center space-y-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              !
            </div>
            <h3 className="text-base font-bold text-slate-900">{error}</h3>
            <p className="text-xs text-slate-500">Please verify your order reference number or browse your store catalog.</p>
            <Link
              to="/"
              className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md hover:bg-indigo-700 transition-all"
            >
              ← Back to Catalog
            </Link>
          </div>
        ) : currentOrder ? (
          <div className="space-y-6">
            {/* Top Fulfillment Status Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center space-x-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                      Status: Dispatched & In Transit
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                      1Fi MF Lien Active
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                    Arriving Tomorrow by 5:00 PM
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Shipped via <strong>BlueDart Air Express</strong> • Airway Bill Tracking <strong className="font-mono text-slate-800">#BD-849204</strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsInvoiceOpen(true)}
                  className="px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors flex items-center space-x-1.5 self-start sm:self-center"
                >
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download Tax Invoice</span>
                </button>
              </div>

              {/* 4-Step Interactive Progress Bar */}
              <div className="pt-8 pb-4">
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-4 left-6 right-6 h-1 bg-slate-200 -z-0">
                    <div className="h-full bg-emerald-500 w-2/3"></div>
                  </div>

                  <div className="grid grid-cols-4 relative z-10 text-center">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-emerald-500/20">
                        ✓
                      </div>
                      <span className="text-xs font-bold text-slate-900 mt-2">Order Confirmed</span>
                      <span className="text-[10px] text-slate-400">MF Lien Verified</span>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-emerald-500/20">
                        ✓
                      </div>
                      <span className="text-xs font-bold text-slate-900 mt-2">Dispatched</span>
                      <span className="text-[10px] text-slate-400">Mumbai Logistics Hub</span>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-indigo-100 shadow-md">
                        3
                      </div>
                      <span className="text-xs font-bold text-indigo-700 mt-2">In Transit</span>
                      <span className="text-[10px] text-slate-500">BlueDart Air Cargo</span>
                    </div>

                    {/* Step 4 */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-300 text-slate-400 flex items-center justify-center text-xs font-bold">
                        4
                      </div>
                      <span className="text-xs font-semibold text-slate-400 mt-2">Out for Delivery</span>
                      <span className="text-[10px] text-slate-400">Tomorrow by 5 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Two Column Summary: Item Details & Financing Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product & Customer Summary */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Item & Customer Details</div>
                <div className="flex items-center space-x-3.5 pb-4 border-b border-slate-100">
                  <div className="w-14 h-16 bg-slate-50 rounded-2xl border border-slate-200 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={variant.images?.[0] || product.thumbnail || '/assets/iphone-orange.jpg'}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{product.name}</h3>
                    <p className="text-xs text-slate-500 truncate">{variant.label || variant.storage}</p>
                    <p className="text-xs font-extrabold text-indigo-700 mt-0.5">₹{variant.price?.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Order Reference:</span>
                    <span className="font-mono font-bold text-slate-900">{currentOrder.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Recipient Name:</span>
                    <span className="font-semibold text-slate-800">{currentOrder.customerName || 'Customer'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email Updates:</span>
                    <span className="font-semibold text-slate-800">{currentOrder.customerEmail || 'Sent to registered email'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Delivery Address:</span>
                    <span className="font-semibold text-slate-800 text-right">Registered Address (Standard Delivery)</span>
                  </div>
                </div>
              </div>

              {/* 1Fi Financing & Mandate Breakdown */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">1Fi Repayment & Mandate Schedule</div>

                <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-emerald-800 font-semibold">Amount Paid Today:</span>
                    <span className="font-extrabold text-emerald-700">₹0.00 (Zero Upfront)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-800 font-semibold">Monthly EMI Installment:</span>
                    <span className="font-extrabold text-slate-900">₹{plan.monthlyAmount?.toLocaleString('en-IN')}/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-800 font-semibold">Tenure Length:</span>
                    <span className="font-bold text-slate-900">{plan.tenureMonths} Months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-800 font-semibold">Next Auto-Debit Date:</span>
                    <span className="font-bold text-indigo-700">5th of Next Month</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment / Mandate Gateway:</span>
                    <span className="font-bold text-slate-800">{currentOrder.paymentMethod || 'Razorpay UPI AutoPay'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mandate Reference:</span>
                    <span className="font-mono text-slate-700">{currentOrder.transactionId || 'RZP_MND_84A291B'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mutual Fund Security Status:</span>
                    <span className="font-semibold text-emerald-600">Active Lien (Compounding Earned)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-16 text-center space-y-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">No Active Order Found</h3>
            <p className="text-xs text-slate-500">Enter an Order ID above or place an order from the product catalog.</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md hover:bg-indigo-700 transition-all"
            >
              Explore Products on EMI
            </Link>
          </div>
        )}
      </main>

      {/* Printable Invoice Modal */}
      {currentOrder && (
        <InvoiceModal
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          order={currentOrder}
          product={product}
          variant={variant}
          plan={plan}
        />
      )}
    </div>
  );
};

export default OrdersPage;
