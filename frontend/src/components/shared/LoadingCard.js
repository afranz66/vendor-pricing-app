// frontend/src/components/shared/LoadingCard.js
// Reusable loading state component with consistent styling

import React from 'react';

const LoadingCard = ({ message = "Loading..." }) => {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-slate-600">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingCard;