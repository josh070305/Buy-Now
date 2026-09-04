import React from 'react';

const EMIPlanCard = ({ plan, checked, onChange }) => {
  const isZeroPercent = plan.interestRate === 0;

  return (
    <div
      role="radio"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onChange();
        }
      }}
      onClick={onChange}
      className={`relative w-full p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none text-left ${
        checked
          ? 'border-indigo-600 bg-indigo-50/40 shadow-sm ring-1 ring-indigo-600'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left Side: Radio circle + Monthly Amount & Tenure */}
        <div className="flex items-start space-x-3.5">
          <div className="pt-0.5">
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                checked
                  ? 'border-indigo-600 bg-indigo-600'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {checked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
          </div>

          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-base font-bold text-slate-900 tracking-tight">
                ₹{plan.monthlyAmount?.toLocaleString?.('en-IN') ?? plan.monthlyAmount}
              </span>
              <span className="text-sm font-semibold text-slate-600">
                x {plan.tenureMonths} months
              </span>
            </div>

            {/* Cashback / Benefit Subtext */}
            {plan.cashback && plan.cashback > 0 ? (
              <div className="mt-1 flex items-center space-x-1 text-xs font-semibold text-emerald-600">
                <svg className="w-3.5 h-3.5 shrink-0 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Additional cashback of ₹{plan.cashback?.toLocaleString?.('en-IN') ?? plan.cashback}</span>
              </div>
            ) : (
              <div className="mt-1 text-xs text-slate-400">Standard repayment schedule</div>
            )}
          </div>
        </div>

        {/* Right Side: Interest Badge & Popular Tag */}
        <div className="flex flex-col items-end space-y-1.5 shrink-0">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              isZeroPercent
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {plan.interestRate}% interest
          </span>

          {plan.isPopular && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              Most Popular
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EMIPlanCard;
