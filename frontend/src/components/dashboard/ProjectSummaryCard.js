// frontend/src/components/dashboard/ProjectSummaryCard.js
// Individual project card for dashboard display with GC information

import React from 'react';
import { CheckCircle, AlertCircle, Clock, TrendingUp, Building2, User } from 'lucide-react';

const ProjectSummaryCard = ({ project, onClick, onGCClick }) => {
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
    
    if (project.status === 'complete') {
      return 'from-emerald-400 to-teal-500';
    } else if (daysUntilDeadline < 7 && metrics.completionPercentage < 90) {
      return 'from-red-400 to-rose-500';
    } else if (metrics.completionPercentage < 50) {
      return 'from-amber-400 to-orange-500';
    } else {
      return 'from-blue-400 to-indigo-500';
    }
  };

  const statusInfo = getStatusInfo();
  const deadline = new Date(project.bidDeadline);
  const today = new Date();
  const daysUntilDeadline = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  const StatusIcon = statusInfo.icon;

  return (
    <div 
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-8 hover:shadow-lg transition-all duration-200 cursor-pointer hover:bg-white/90"
      onClick={onClick}
    >
      <div className="space-y-6">
        {/* Project Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight">
              {project.name}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {project.description}
            </p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold text-white bg-gradient-to-r ${statusInfo.color} shadow-lg`}>
            <StatusIcon size={16} />
            {statusInfo.label}
          </div>
        </div>

        {/* Client and General Contractor Information */}
        <div className="grid grid-cols-1 gap-4">
          {/* Client Info */}
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl border border-slate-100">
            <User size={16} className="text-blue-600" />
            <div className="flex-1">
              <p className="text-xs text-slate-600 font-medium">Client</p>
              <p className="text-sm font-bold text-slate-800">{project.client}</p>
            </div>
          </div>
          
          {/* General Contractor Info - Clickable Button */}
          {project.generalcontractor && (
            <button 
              className="flex items-center gap-3 p-3 bg-gradient-to-r from-slate-50 to-green-50 rounded-2xl border border-slate-100 hover:from-green-50 hover:to-green-100 hover:border-green-200 transition-all duration-200 w-full text-left hover:shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                if (onGCClick) {
                  onGCClick(project);
                }
              }}
            >
              <Building2 size={16} className="text-green-600" />
              <div className="flex-1">
                <p className="text-xs text-slate-600 font-medium">General Contractor</p>
                <p className="text-sm font-bold text-slate-800">{project.generalcontractor}</p>
                {project.gcContact && project.gcContact.name && (
                  <p className="text-xs text-slate-500">{project.gcContact.name}</p>
                )}
              </div>
              <div className="text-xs text-green-600 font-medium">
                View details →
              </div>
            </button>
          )}
        </div>

        {/* Progress Tracking */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-700">Progress</span>
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
            <span className="text-slate-600 font-medium">Total Value:</span>
            <span className="font-bold text-slate-800 text-lg">
              ${project.estimatedValue.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-medium">Next Deadline</span>
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
          <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl">
            View Project Details →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSummaryCard;