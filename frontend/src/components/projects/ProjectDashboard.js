// src/components/projects/ProjectDashboard.js
// Comprehensive project management interface that demonstrates advanced React patterns

import React, { useState } from 'react';
import { ArrowLeft, Calendar, Users, TrendingUp, AlertCircle, CheckCircle, Clock, DollarSign, Award, Eye, Settings } from 'lucide-react';
import { useProjectDetails } from '../../hooks/useApi';

const ProjectDashboard = ({ projectId, onCategoryClick, onVendorManagementClick, onBack }) => {
  // State for managing which aspect of the project is currently emphasized
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch comprehensive project data using our enhanced hook
  const { project, categories, loading, error, refetch, hasCategories, hasVendors } = useProjectDetails(projectId);

  // Display loading state with beautiful, consistent styling
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-slate-600">Loading detailed project information...</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle error states with actionable feedback and recovery options
  if (error || !project) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Unable to Load Project Details</h2>
            <p className="text-slate-600 mb-4">{error || 'Project not found'}</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={refetch}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-semibold"
              >
                Try Again
              </button>
              <button 
                onClick={onBack}
                className="border-2 border-slate-300 text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-semibold"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to determine the overall project status based on deadlines and progress
  const getProjectStatus = () => {
    const deadline = new Date(project.bidDeadline);
    const today = new Date();
    const daysUntilDeadline = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    const completionPercentage = project.metrics ? project.metrics.completionPercentage : 0;
    
    if (project.status === 'complete') {
      return { status: 'Complete', color: 'from-emerald-500 to-teal-600', icon: CheckCircle };
    } else if (daysUntilDeadline < 7 && completionPercentage < 90) {
      return { status: 'Urgent', color: 'from-red-500 to-rose-600', icon: AlertCircle };
    } else if (completionPercentage >= 70) {
      return { status: 'On Track', color: 'from-blue-500 to-indigo-600', icon: TrendingUp };
    } else {
      return { status: 'In Progress', color: 'from-amber-500 to-orange-600', icon: Clock };
    }
  };

  const projectStatus = getProjectStatus();
  const StatusIcon = projectStatus.icon;
  const deadline = new Date(project.bidDeadline);
  const today = new Date();
  const daysUntilDeadline = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header Section with Navigation and Project Overview */}
      <div className="mb-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="flex items-center gap-6 mb-6">
            <button 
              onClick={onBack}
              className="p-3 hover:bg-slate-100 rounded-2xl transition-all duration-200 hover:shadow-md"
            >
              <ArrowLeft size={24} className="text-slate-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">
                {project.name}
              </h1>
              <p className="text-lg text-slate-600 font-medium">
                {project.client} • Due: {deadline.toLocaleDateString()} 
                {project.status !== 'complete' && (
                  <span className={`ml-2 ${daysUntilDeadline < 7 ? 'text-red-600' : 'text-slate-600'}`}>
                    ({daysUntilDeadline > 0 ? `${daysUntilDeadline} days remaining` : 'Overdue'})
                  </span>
                )}
              </p>
            </div>
            <div className={`px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 bg-gradient-to-r ${projectStatus.color} text-white shadow-lg`}>
              <StatusIcon size={18} />
              {projectStatus.status}
            </div>
          </div>

          {/* Project Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-slate-100">
              <p className="text-2xl font-bold text-slate-800">
                {project.metrics ? project.metrics.completionPercentage : 0}%
              </p>
              <p className="text-xs text-slate-600 font-medium">Overall Progress</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl border border-slate-100">
              <p className="text-2xl font-bold text-slate-800">
                {project.metrics ? `${project.metrics.quotedMaterials}/${project.metrics.totalMaterials}` : '0/0'}
              </p>
              <p className="text-xs text-slate-600 font-medium">Materials Quoted</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-purple-50 rounded-2xl border border-slate-100">
              <p className="text-2xl font-bold text-slate-800">
                {project.metrics ? `${project.metrics.activeVendors}/${project.metrics.totalVendors}` : '0/0'}
              </p>
              <p className="text-xs text-slate-600 font-medium">Active Vendors</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-emerald-50 rounded-2xl border border-slate-100">
              <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                ${project.estimatedValue ? project.estimatedValue.toLocaleString() : '0'}
              </p>
              <p className="text-xs text-slate-600 font-medium">Project Value</p>
            </div>
          </div>
        </div>
      </div>

      {/* Material Categories Section */}
      {hasCategories && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 p-6">
            <h2 className="text-2xl font-bold text-white">Material Categories</h2>
            <p className="text-slate-200">Click on any category to view detailed vendor comparisons and pricing analysis</p>
          </div>
          
          <div className="p-8">
            <div className="space-y-6">
              {categories.map(category => {
                const analysis = category.analysis;
                
                return (
                  <div key={category.id} className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-700 transition-colors">
                            {category.name}
                          </h3>
                          <span className={`px-4 py-2 rounded-full text-sm font-bold text-white flex items-center gap-2 bg-gradient-to-r ${getStatusStyling(category.status)} shadow-lg`}>
                            {getStatusIcon(category.status)}
                            {formatStatus(category.status)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 font-medium mb-2">
                          {category.description}
                        </p>
                        <p className="text-sm text-slate-600">
                          {analysis.quotedVendors}/{analysis.vendorCount} vendors quoted • 
                          {analysis.quotedItems}/{category.totalItems} items completed
                        </p>
                      </div>
                      <div className="text-right">
                        {analysis.bidding.lowestBid && (
                          <div>
                            <p className="text-2xl font-bold text-slate-800">
                              ${analysis.bidding.lowestBid.toLocaleString()}
                            </p>
                            <p className="text-sm text-slate-600 font-medium">Best Quote</p>
                            {analysis.bidding.potentialSavings > 0 && (
                              <p className="text-sm font-semibold text-emerald-600">
                                Save up to ${analysis.bidding.potentialSavings.toLocaleString()}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-4 mb-4 shadow-inner">
                      <div 
                        className={`h-4 rounded-full transition-all duration-500 bg-gradient-to-r ${getProgressBarColor(category.status, analysis.completionPercentage)} shadow-sm`}
                        style={{ width: `${analysis.completionPercentage}%` }}
                      ></div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-slate-600">
                          {analysis.completionPercentage}% complete
                        </span>
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getCompetitivenessStyle(analysis.bidding.competitivenessScore)}`}>
                          {analysis.bidding.competitivenessScore} Competition
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onVendorManagementClick) onVendorManagementClick(category.id);
                          }}
                          className="text-blue-600 hover:text-blue-700 font-bold text-sm hover:underline transition-all duration-200 flex items-center gap-2"
                        >
                          <Settings size={16} />
                          Manage Vendors
                        </button>
                        <button 
                          onClick={() => {
                            if (onCategoryClick) onCategoryClick(category.id);
                          }}
                          className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                        >
                          <Eye size={16} />
                          Compare Quotes
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Project Information Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Project Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-slate-700 mb-3">Project Details</h4>
            <div className="space-y-2 text-sm">
              <p><span className="text-slate-600">Description:</span> <span className="text-slate-800">{project.description}</span></p>
              <p><span className="text-slate-600">Start Date:</span> <span className="text-slate-800">{new Date(project.startDate).toLocaleDateString()}</span></p>
              <p><span className="text-slate-600">Bid Deadline:</span> <span className="text-slate-800">{deadline.toLocaleDateString()}</span></p>
              <p><span className="text-slate-600">Status:</span> <span className="text-slate-800">{project.status}</span></p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-slate-700 mb-3">Client Contact</h4>
            <div className="space-y-2 text-sm">
              <p><span className="text-slate-600">Name:</span> <span className="text-slate-800">{project.clientContact?.name}</span></p>
              <p><span className="text-slate-600">Email:</span> 
                <a href={`mailto:${project.clientContact?.email}`} className="text-blue-600 hover:text-blue-700 underline ml-1">
                  {project.clientContact?.email}
                </a>
              </p>
              <p><span className="text-slate-600">Phone:</span> 
                <a href={`tel:${project.clientContact?.phone}`} className="text-blue-600 hover:text-blue-700 underline ml-1">
                  {project.clientContact?.phone}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions for styling and status management
const getStatusStyling = (status) => {
  switch (status) {
    case 'complete': return 'from-emerald-500 to-teal-600';
    case 'in_progress': return 'from-blue-500 to-indigo-600';
    case 'early': return 'from-amber-500 to-orange-600';
    default: return 'from-slate-400 to-gray-500';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'complete': return <CheckCircle size={16} />;
    case 'urgent': return <AlertCircle size={16} />;
    default: return <Clock size={16} />;
  }
};

const formatStatus = (status) => {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const getProgressBarColor = (status, percentage) => {
  if (status === 'complete') return 'from-emerald-500 to-teal-500';
  if (percentage >= 70) return 'from-blue-500 to-indigo-500';
  return 'from-amber-500 to-orange-500';
};

const getCompetitivenessStyle = (score) => {
  switch (score) {
    case 'High': return 'bg-emerald-100 text-emerald-700';
    case 'Low': return 'bg-amber-100 text-amber-700';
    default: return 'bg-slate-100 text-slate-700';
  }
};

export default ProjectDashboard;