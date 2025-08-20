// frontend/src/components/projects/ProjectDashboard.js
// Updated with compact one-line project cards

import React, { useState } from 'react';
import { ArrowLeft, Calendar, Users, TrendingUp, AlertCircle, CheckCircle, Clock, DollarSign, Award, Eye, Settings, Building } from 'lucide-react';
import { useProjectDetails } from '../../hooks/useApi';

const ProjectDashboard = ({ 
  projectId, 
  onBack, 
  onQuoteComparisonClick, 
  onVendorManagementClick 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch comprehensive project data using your existing hook
  const { project, categories, loading, error, refetch, hasCategories, hasVendors } = useProjectDetails(projectId);

  // Helper function to calculate analysis from your actual data structure
  const calculateCategoryAnalysis = (category) => {
    const vendorParticipation = category.vendorParticipation || [];
    const submittedBids = vendorParticipation.filter(v => v.bidStatus === 'submitted');
    const bestQuote = submittedBids.length > 0 ? Math.min(...submittedBids.map(v => v.bidAmount)) : null;
    const estimatedSavings = bestQuote && category.estimatedValue ? Math.max(0, category.estimatedValue - bestQuote) : 0;
    
    return {
      quotedVendors: submittedBids.length,
      vendorCount: vendorParticipation.length,
      completedItems: category.quotedItems || 0,
      totalItems: category.totalItems || 0,
      bestQuote: bestQuote,
      estimatedSavings: estimatedSavings,
      competitionLevel: submittedBids.length >= 3 ? "High" : submittedBids.length > 0 ? "Low" : "None"
    };
  };

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

  if (error || !project) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Unable to Load Project Details</h2>
            <p className="text-slate-600 mb-4">{error || 'Project not found'}</p>
            <div className="flex justify-center gap-4">
              <button onClick={refetch} className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-semibold">
                Try Again
              </button>
              <button onClick={onBack} className="border-2 border-slate-300 text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-semibold">
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Helper functions for status and formatting
  const getStatusStyling = (status) => {
    const styles = {
      in_progress: 'from-blue-500 to-indigo-600',
      complete: 'from-green-500 to-emerald-600',
      pending: 'from-yellow-500 to-orange-600'
    };
    return styles[status] || styles.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      in_progress: <Clock size={12} />,
      complete: <CheckCircle size={12} />,
      pending: <Calendar size={12} />
    };
    return icons[status] || icons.pending;
  };

  const formatStatus = (status) => {
    const labels = {
      in_progress: 'Active',
      complete: 'Done',
      pending: 'Pending'
    };
    return labels[status] || 'Unknown';
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getCompetitionColor = (level) => {
    switch(level) {
      case 'High': return 'text-green-600 bg-green-50';
      case 'Low': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-8">
        {/* Project Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30 mb-8">
          <div className="flex items-center gap-6">
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
                {project.location?.address || project.address || 'No address provided'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600 font-medium">Project Value</p>
              <p className="text-3xl font-bold text-slate-800">{formatCurrency(project.estimatedValue)}</p>
              <p className="text-green-600 font-semibold">{project.metrics?.completionPercentage || 0}% Complete</p>
            </div>
          </div>
        </div>

        {/* Material Categories Section - Compact List */}
        {hasCategories && (
          <div className="bg-white/80 backdrop-blur-sm rounded-md shadow-2xl border border-white/30 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 p-4">
              <h2 className="text-xl font-bold text-white">Material Categories</h2>
              <p className="text-slate-200 text-sm">Click on any category to view detailed vendor comparisons</p>
            </div>
            
            <div className="p-4">
              <div className="space-y-2">
                {categories.map(category => {
                  const analysis = calculateCategoryAnalysis(category);
                  const completionPercent = analysis.totalItems > 0 ? Math.round((analysis.completedItems / analysis.totalItems) * 100) : 0;
                  
                  return (
                    <div key={category.id} className="bg-gradient-to-r from-white to-slate-50 border border-slate-200 rounded-xl p-3 hover:shadow-md transition-all duration-200 cursor-pointer group hover:border-blue-300 h-min">
                      <div className="flex items-center justify-between">
                        {/* Left side - Name and Status */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors truncate">
                            {category.name}
                          </h3>
                          <span className={`px-2 py-1 rounded-lg text-xs font-semibold text-white flex items-center gap-1 bg-gradient-to-r ${getStatusStyling(category.status)} shadow-sm`}>
                            {getStatusIcon(category.status)}
                            {formatStatus(category.status)}
                          </span>
                        </div>

                        {/* Middle - Progress and Metrics */}
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-semibold text-slate-700">{completionPercent}%</div>
                            <div className="text-xs text-slate-500">Complete</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-slate-700">{analysis.quotedVendors}/{analysis.vendorCount}</div>
                            <div className="text-xs text-slate-500">Vendors</div>
                          </div>
                          <div className={`px-2 py-1 rounded-md text-xs font-medium ${getCompetitionColor(analysis.competitionLevel)}`}>
                            {analysis.competitionLevel}
                          </div>
                        </div>

                        {/* Right side - Price and Actions */}
                        <div className="flex items-center gap-3">
                          {analysis.bestQuote && (
                            <div className="text-right">
                              <div className="font-bold text-slate-800">{formatCurrency(analysis.bestQuote)}</div>
                              <div className="text-xs text-slate-500">Best Quote</div>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                onVendorManagementClick(category.id);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              title="Manage Vendors"
                            >
                              <Settings size={16} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                onQuoteComparisonClick(category.id);
                              }}
                              className="p-2 text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 rounded-lg transition-all duration-200 shadow-sm"
                              title="Compare Quotes"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Show message if no categories */}
        {!hasCategories && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-12 text-center">
            <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Material Categories Yet</h3>
            <p className="text-slate-600">Categories and vendor information will appear here as they're added to the project.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDashboard;