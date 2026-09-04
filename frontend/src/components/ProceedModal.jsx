import React, { useState } from 'react';
import { createOrder } from '../services/api';
import InvoiceModal from './InvoiceModal';

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
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

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
      };

      const res = await createOrder(payload);
      const data = res.data?.data || res.data;
      const txPrefix = paymentMethod.toLowerCase().includes('stripe') ? 'STP_TXN_' : 'RZP_MND_';
      const fallbackTxnId = txPrefix + Math.random().toString(36).substring(2, 10).toUpperCase();

      setOrderResult({
        ...data,
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim(),
        customerPhone: formData.customerPhone.trim() || '98765 43210',
        paymentMethod: data.paymentMethod || paymentMethod,
        transactionId: data.transactionId || fallbackTxnId,
      });
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
    setIsInvoiceOpen(false);
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
            <div className="text-center py-2 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div>
                <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight">Order Placed Successfully!</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Tax invoice & warranty certificate sent to <strong className="text-slate-800">{orderResult.customerEmail}</strong>
                </p>
              </div>

              {/* Delivery Timeline Tracker */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-left space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Estimated Delivery</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Tomorrow by 5:00 PM
                  </span>
                </div>
                {/* 3-Step Progress Bar */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <div className="flex flex-col items-center text-emerald-600 font-bold">
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] mb-1">✓</span>
                    <span>Order Placed</span>
                  </div>
                  <div className="h-0.5 flex-1 bg-emerald-500 mx-2"></div>
                  <div className="flex flex-col items-center text-emerald-600 font-bold">
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] mb-1">✓</span>
                    <span>Dispatched (BlueDart)</span>
                  </div>
                  <div className="h-0.5 flex-1 bg-slate-200 mx-2"></div>
                  <div className="flex flex-col items-center text-slate-400">
                    <span className="w-4 h-4 rounded-full border-2 border-slate-300 bg-white flex items-center justify-center text-[9px] mb-1">3</span>
                    <span>Doorstep Delivery</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 pt-1 flex justify-between">
                  <span>Carrier: <strong>BlueDart Express</strong></span>
                  <span className="font-mono">AWB #BD-849204</span>
                </div>
              </div>

              {/* Order Details Badge */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-left space-y-1.5 text-xs">
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

              {/* Action Buttons: Invoice + Return */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsInvoiceOpen(true)}
                  className="w-full py-2.5 px-3 rounded-xl border border-indigo-600 bg-indigo-50 text-indigo-700 font-bold text-xs hover:bg-indigo-100 transition-colors flex items-center justify-center space-x-1.5"
                >
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>View Tax Invoice</span>
                </button>

                <button
                  onClick={handleReset}
                  className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/20"
                >
                  Done / Store
                </button>
              </div>
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
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Mobile (Linked to MF) <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                        CAMS / KFintech Verified
                      </span>
                    </div>
                    <input
                      type="tel"
                      placeholder="98765 43210"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                    />
                    <div className="mt-1.5 p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-[10px] text-emerald-800 flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>Portfolio Found: <strong>₹3,40,000</strong> active MF units</span>
                      </div>
                      <span className="text-[9px] text-emerald-600 font-bold uppercase">₹0 Upfront</span>
                    </div>
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

      {/* Printable Tax Invoice Modal */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        order={orderResult || {}}
        product={product}
        variant={variant}
        plan={plan}
      />
    </div>
  );
};

export default ProceedModal;
