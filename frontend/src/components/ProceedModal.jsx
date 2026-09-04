import React, { useState } from 'react';
import { createOrder } from '../services/api';

const ProceedModal = ({ isOpen, onClose, product, variant, plan }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('Razorpay UPI AutoPay');
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen || !product || !variant || !plan) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.customerEmail.trim()) {
      setErrorMsg('Please provide your name and email address.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      const payload = {
        productId: product._id,
        variantId: variant._id,
        emiPlanId: plan._id,
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim(),
        paymentMethod: paymentMethod,
      };

      const res = await createOrder(payload);
      const data = res.data?.data || res.data;
      setOrderResult(data);
    } catch (err) {
      console.error('Order creation error:', err);
      setErrorMsg(err?.response?.data?.error?.message || err.message || 'Failed to submit order');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setOrderResult(null);
    setErrorMsg(null);
    onClose();
  };

  // Calculations
  const monthlyAmount = plan.monthlyAmount;
  const tenure = plan.tenureMonths;
  const totalPayable = monthlyAmount * tenure;
  const interestAmount = Math.max(0, totalPayable - variant.price);
  const cashback = plan.cashback || 0;
  const netEffectiveCost = totalPayable - cashback;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all my-8">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">1Fi Instant Checkout</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                MF Backed
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">Confirm Your EMI Plan</h3>
          </div>
          <button
            onClick={handleReset}
            className="text-slate-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {orderResult ? (
            /* SUCCESS CONFIRMATION VIEW */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div>
                <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight">Order Placed Successfully!</h4>
                <p className="text-sm text-slate-500 mt-1">
                  Your zero-downpayment EMI application is approved & backed by mutual funds.
                </p>
              </div>

              {/* Order Details Badge */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Order Reference:</span>
                  <span className="font-mono font-bold text-indigo-700">{orderResult.orderId || 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Product:</span>
                  <span className="font-semibold text-slate-900">{product.name} ({variant.label})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment / Mandate:</span>
                  <span className="font-bold text-emerald-700 flex items-center space-x-1">
                    <span>✓</span>
                    <span>{orderResult.paymentMethod || paymentMethod}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mandate / Txn ID:</span>
                  <span className="font-mono text-xs text-slate-700">{orderResult.transactionId || 'RZP_MND_' + Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Paid Today:</span>
                  <span className="font-bold text-emerald-600">₹0.00 (Zero Down Payment)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Repayment Schedule:</span>
                  <span className="font-semibold text-slate-900">₹{monthlyAmount.toLocaleString('en-IN')}/mo x {tenure} months</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold pt-1 border-t border-slate-200">
                  <span>Cashback Credited:</span>
                  <span>₹{cashback.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* 1Fi MF Portfolio Status */}
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3.5 text-left flex items-start space-x-3 text-xs text-indigo-900">
                <span className="text-base">📈</span>
                <p>
                  <strong>Investment Mandate Active:</strong> Your mutual fund portfolio remains active and earning market returns. First monthly installment will be automatically auto-debited on the 5th of next month via <strong>{orderResult.paymentMethod || paymentMethod}</strong>.
                </p>
              </div>

              <button
                onClick={handleReset}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-md shadow-indigo-600/20"
              >
                Done / Back to Store
              </button>
            </div>
          ) : (
            /* CHECKOUT FORM VIEW */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product & Variant Preview Card */}
              <div className="flex items-center space-x-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-14 bg-white rounded-xl border border-slate-200 p-1 flex items-center justify-center shrink-0">
                  <img
                    src={variant.images?.[0] || '/assets/iphone-natural.svg'}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{product.name}</h4>
                  <p className="text-xs text-slate-500 truncate">{variant.label}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-extrabold text-indigo-700">₹{variant.price?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* 1Fi Domain Concept Badge: How MF backs EMI */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100/80 text-xs text-emerald-950 flex items-start space-x-2.5">
                <svg className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="leading-relaxed">
                  <strong>Mutual Fund Advantage:</strong> Pay <strong>₹0 down payment</strong>. Your existing mutual fund units act as security without selling. They keep earning returns while you pay regular monthly EMIs!
                </p>
              </div>

              {/* Financial Breakdown Table */}
              <div className="bg-slate-50/70 rounded-2xl p-3.5 border border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Down Payment:</span>
                  <span className="font-semibold text-emerald-600">₹0 (Zero Upfront)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Monthly Installment:</span>
                  <span className="font-bold text-slate-900">₹{monthlyAmount.toLocaleString('en-IN')} x {tenure} mos</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Interest Rate:</span>
                  <span className="font-semibold text-slate-900">{plan.interestRate}% ({interestAmount > 0 ? `₹${interestAmount.toLocaleString('en-IN')}` : 'Zero-Cost'})</span>
                </div>
                {cashback > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Cashback Incentive:</span>
                    <span>-₹{cashback.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200 text-sm">
                  <span>Net Effective Cost:</span>
                  <span className="text-indigo-700">₹{netEffectiveCost.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Customer Form Inputs */}
              <div className="space-y-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="rahul@example.com"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number (Linked to MF)
                    </label>
                    <input
                      type="tel"
                      placeholder="98765 43210"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                    />
                  </div>
                </div>
              </div>

              {/* Payment & Mandate Method Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select EMI Mandate / Payment Gateway
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div
                    onClick={() => setPaymentMethod('Razorpay UPI AutoPay')}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'Razorpay UPI AutoPay'
                        ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-900">Razorpay UPI</span>
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Popular
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">GPay, PhonePe e-Mandate</p>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('1Fi Mutual Fund Lien')}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === '1Fi Mutual Fund Lien'
                        ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-900">1Fi MF Lien</span>
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                        ₹0 Cash
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">CAMS / KFintech OTP</p>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('Stripe Cards / NetBanking')}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'Stripe Cards / NetBanking'
                        ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-900">Stripe / Cards</span>
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        Global
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Credit/Debit Card EMI</p>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      <span>Connecting {paymentMethod}...</span>
                    </>
                  ) : (
                    <span>Authorize & Confirm with {paymentMethod.split(' ')[0]}</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProceedModal;
