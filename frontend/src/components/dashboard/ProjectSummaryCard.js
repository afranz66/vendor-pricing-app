// frontend/src/components/dashboard/ProjectSummaryCard.js
// Individual project card for dashboard display

import React from 'react';
import { CheckCircle, AlertCircle, Clock, TrendingUp } from 'lucide-react';

const ProjectSummaryCard = ({ project, onClick }) => {
  // Extract metrics from the backend-provided data
  const metrics = project.metrics || {
    totalMaterials: 0,
    quotedMaterials: 0,
    totalVendors: 0,
    activeVendors: 0,
    completionPercentage: 0
  };

  // Determine project status styling based on progress and deadlines
  const getStatusInfo = () => {
    const { status, bidDeadline } = project;
    const deadline = new Date(bidDeadline);
    const today = new Date();
    const daysUntilDeadline = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    
    if (status === 'complete') {
      return { 
        color: 'from-emerald-500 to-teal-600', 
        bgColor: 'from-emerald-50 to-teal-50', 
        icon: CheckCircle, 
        label: 'Complete' 
      };
    } else if (daysUntilDeadline < 7 && metrics.completionPercentage < 90) {
      return { 
        color: 'from-red-500 to-rose-600', 
        bgColor: 'from-red-50 to-rose-50', 
        icon: AlertCircle, 
        label: 'Urgent' 
      };
    } else if (metrics.completionPercentage < 50) {
      return { 
        color: 'from-amber-500 to-orange-600', 
        bgColor: 'from-amber-50 to-orange-50', 
        icon: Clock, 
        label: 'In Progress' 
      };
    } else {
      return { 
        color: 'from-blue-500 to-indigo-600', 
        bgColor: 'from-blue-50 to-indigo-50', 
        icon: TrendingUp, 
        label: 'On Track' 
      };
    }
  };

  const getProgressBarColor = () => {
    const deadline = new Date(project.bidDeadline);
    const today = new Date();
    const daysUntilDeadline = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    
    if (project.status === 'complete') return 'from-emerald-500 to-teal-500';
    if (daysUntilDeadline < 7 && metrics.completionPercentage < 90) return 'from-red-500 to-rose-500';
    if (metrics.completionPercentage >= 70) return 'from-blue-500 to-indigo-500';
    return 'from-amber-500 to-orange-500';
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;
  const deadline = new Date(project.bidDeadline);
  const today = new Date();
  const daysUntilDeadline = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

  return (
    <div 
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/30 overflow-hidden group"
      onClick={onClick}
    >
      {/* Project Header with Status */}
      <div className={`bg-gradient-to-r ${statusInfo.bgColor} p-6 border-b border-white/20`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors">
              {project.name}
            </h3>
            <p className="text-slate-600 font-medium">{project.client}</p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 bg-gradient-to-r ${statusInfo.color} text-white shadow-lg`}>
            <StatusIcon size={16} />
            {statusInfo.label}
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="p-6">
        {/* Progress Section */}
        <div className="mb-6">
          <div className="flex justify-between text-sm font-semibold text-slate-700 mb-3">
            <span>Bidding Progress</span>
            <span>{metrics.completionPercentage}% Complete</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 shadow-inner">
            <div 
              className={`h-3 rounded-full transition-all duration-500 bg-gradient-to-r ${getProgressBarColor()} shadow-sm`}
              style={{ width: `${metrics.completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-slate-100">
            <p className="text-2xl font-bold text-slate-800">
              {metrics.quotedMaterials}/{metrics.totalMaterials}
            </p>
            <p className="text-xs text-slate-600 font-medium">Materials Quoted</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl border border-slate-100">
            <p className="text-2xl font-bold text-slate-800">
              {metrics.activeVendors}/{metrics.totalVendors}
            </p>
            <p className="text-xs text-slate-600 font-medium">Active Vendors</p>
          </div>
        </div>

        {/* Project Information */}
        <div className="space-y-3 text-sm mb-6">
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-medium">Estimated Value:</span>
            <span className="font-bold text-slate-800 text-lg">
              ${project.estimatedValue.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-medium">Bid Deadline:</span>
            <span className={`font-bold ${daysUntilDeadline < 7 ? 'text-red-600' : 'text-slate-800'}`}>
              {deadline.toLocaleDateString()} 
              {project.status !== 'complete' && (
                <span className="ml-2 text-xs">
                  ({daysUntilDeadline > 0 ? `${daysUntilDeadline} days` : 'Overdue'})
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-200">
          <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
            View Project Details →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSummaryCard;