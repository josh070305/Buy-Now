import React from 'react';

const InvoiceModal = ({ isOpen, onClose, order, product, variant, plan }) => {
  if (!isOpen || !order || !product || !variant) return null;

  const invoiceNumber = `INV-${(order.orderId || 'ORD').substring(0, 8).toUpperCase()}`;
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const price = variant.price || 127400;
  const basePrice = Math.round(price / 1.18);
  const gstAmount = price - basePrice;
  const monthlyAmount = plan?.monthlyAmount || Math.round(price / (plan?.tenureMonths || 3));
  const tenure = plan?.tenureMonths || 3;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 print:p-0 print:bg-white animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 print:my-0 print:shadow-none print:border-none">
        {/* Header bar (hidden when printing) */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Official Tax Invoice & Warranty</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center space-x-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Invoice Printable Document */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800 font-sans text-xs">
          {/* Top Brand & Invoice Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black text-slate-900 tracking-tight">1Fi</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                  MF-Backed Commerce
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">1Fi Credit Technologies Private Limited</p>
              <p className="text-[11px] text-slate-500">SEBI / RBI Registered Fintech Partner</p>
              <p className="text-[11px] text-slate-400">GSTIN: 27AAACF1029F1Z4</p>
            </div>

            <div className="sm:text-right space-y-1">
              <span className="text-lg font-extrabold text-slate-900 block">TAX INVOICE</span>
              <p><span className="text-slate-500 font-medium">Invoice No:</span> <strong className="font-mono">{invoiceNumber}</strong></p>
              <p><span className="text-slate-500 font-medium">Date:</span> <strong>{currentDate}</strong></p>
              <p><span className="text-slate-500 font-medium">Order ID:</span> <strong className="font-mono">{order.orderId}</strong></p>
              <p><span className="text-slate-500 font-medium">Delivery:</span> <strong className="text-emerald-700">Tomorrow by 5 PM (BlueDart #BD-849204)</strong></p>
            </div>
          </div>

          {/* Billed To & Shipping Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Customer Details</span>
              <p className="text-sm font-bold text-slate-900">{order.customerName || 'Valued Customer'}</p>
              <p className="text-slate-600">{order.customerEmail || 'customer@example.com'}</p>
              <p className="text-slate-600">Mobile: +91 {order.customerPhone || '98765 43210'}</p>
              <p className="text-emerald-600 font-medium">✓ Verified Mutual Fund Portfolio Holder</p>
            </div>
            <div className="space-y-1 sm:text-right">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Fulfillment Partner</span>
              <p className="font-bold text-slate-900">Balaji Infocom (Authorized Apple Partner)</p>
              <p className="text-slate-600">Dispatch Hub: Mumbai Logistics Center</p>
              <p className="text-slate-600">Warranty: 1 Year Official Apple Manufacturer</p>
            </div>
          </div>

          {/* Itemized Table */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-300 text-[10px] uppercase font-bold text-slate-500">
                <th className="py-2">Description</th>
                <th className="py-2 text-center">HSN</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Taxable Value</th>
                <th className="py-2 text-right">GST (18%)</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3">
                  <div className="font-bold text-slate-900">{product.name}</div>
                  <div className="text-[11px] text-slate-500">{variant.label} • Finish: {variant.colorName}</div>
                </td>
                <td className="py-3 text-center text-slate-500 font-mono">85171300</td>
                <td className="py-3 text-center font-bold">1</td>
                <td className="py-3 text-right text-slate-700">₹{basePrice.toLocaleString('en-IN')}</td>
                <td className="py-3 text-right text-slate-700">₹{gstAmount.toLocaleString('en-IN')}</td>
                <td className="py-3 text-right font-extrabold text-slate-900">₹{price.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>

          {/* Financing & Payment Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-slate-700">
              <span className="font-bold text-slate-900">1Fi Mutual Fund Financing Breakdown:</span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                0% Foreclosure Penalty
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
              <div>
                <span className="text-slate-400 block">Upfront Paid:</span>
                <span className="font-extrabold text-emerald-600">₹0.00</span>
              </div>
              <div>
                <span className="text-slate-400 block">Monthly Installment:</span>
                <span className="font-bold text-slate-900">₹{monthlyAmount.toLocaleString('en-IN')}/mo</span>
              </div>
              <div>
                <span className="text-slate-400 block">Tenure:</span>
                <span className="font-bold text-slate-900">{tenure} Months</span>
              </div>
              <div>
                <span className="text-slate-400 block">Mandate Gateway:</span>
                <span className="font-bold text-indigo-700">{order.paymentMethod || 'Razorpay UPI AutoPay'}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-[10px] text-slate-400 leading-relaxed pt-3 border-t border-slate-200 text-center">
            This is a computer-generated tax invoice and does not require a physical signature. Mutual fund units remain under beneficial lien with CAMS/KFintech until EMI completion.
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
