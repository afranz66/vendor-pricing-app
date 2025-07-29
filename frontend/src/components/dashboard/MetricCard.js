// frontend/src/components/dashboard/MetricCard.js
// Reusable metric display component for portfolio summary

import React from 'react';

const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color, 
  iconColor, 
  valueStyle = "text-slate-800" 
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/30 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${valueStyle}`}>{value}</p>
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        </div>
        <div className={`p-4 bg-gradient-to-br ${color} rounded-2xl`}>
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;