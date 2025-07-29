// frontend/src/components/shared/ErrorCard.js
// Reusable error state component with retry functionality

import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorCard = ({ 
  title = "Something went wrong", 
  message, 
  onRetry, 
  retryText = "Try Again" 
}) => {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>
          <p className="text-slate-600 mb-4">{message}</p>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-semibold"
            >
              {retryText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorCard;