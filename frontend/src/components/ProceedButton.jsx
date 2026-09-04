import React from 'react';

const ProceedButton = ({ onClick, disabled, label = 'Proceed', summary }) => {
  return (
    <div className="flex items-center space-x-4">
      <button onClick={onClick} disabled={disabled} className="bg-accent text-white px-4 py-2 rounded disabled:opacity-50">
        {label}
      </button>
      {summary && <div className="text-sm text-gray-600">{summary}</div>}
    </div>
  );
};

export default ProceedButton;
