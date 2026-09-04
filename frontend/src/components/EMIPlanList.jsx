import React from 'react';
import EMIPlanCard from './EMIPlanCard';

const EMIPlanList = ({ plans = [], selectedPlanId, onChange }) => {
  if (!plans || plans.length === 0) {
    return (
      <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-sm text-slate-500 bg-slate-50">
        No EMI plans available for this variant.
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Available EMI plans"
      className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200"
    >
      {plans.map((plan) => (
        <EMIPlanCard
          key={plan._id}
          plan={plan}
          checked={selectedPlanId === plan._id}
          onChange={() => onChange(plan._id)}
        />
      ))}
    </div>
  );
};

export default EMIPlanList;
