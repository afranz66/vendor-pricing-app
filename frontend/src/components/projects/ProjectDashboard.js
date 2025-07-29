// frontend/src/components/projects/ProjectDashboard.js
// Updated to work with your actual data structure

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
      competitionLevel: submittedBids.length >= 3 ? "High Competition" : submittedBids.length > 0 ? "Low Competition" : "No Competition"
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
      in_progress: <Clock size={16} />,
      complete: <CheckCircle size={16} />,
      pending: <Calendar size={16} />
    };
    return icons[status] || icons.pending;
  };

  const formatStatus = (status) => {
    const labels = {
      in_progress: 'In Progress',
      complete: 'Complete',
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

        {/* Project Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {project.metrics ? `${project.metrics.quotedMaterials}/${project.metrics.totalMaterials}` : '0/0'}
                </p>
                <p className="text-sm text-slate-600 font-medium">Materials Quoted</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {project.metrics ? `${project.metrics.activeVendors}/${project.metrics.totalVendors}` : '0/0'}
                </p>
                <p className="text-sm text-slate-600 font-medium">Active Vendors</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{formatCurrency(project.estimatedValue)}</p>
                <p className="text-sm text-slate-600 font-medium">Project Value</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{project.metrics?.completionPercentage || 0}%</p>
                <p className="text-sm text-slate-600 font-medium">Complete</p>
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
                  // Calculate analysis from your actual data structure
                  const analysis = calculateCategoryAnalysis(category);
                  
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
                            {analysis.completedItems}/{analysis.totalItems} items completed
                          </p>
                        </div>
                        <div className="text-right ml-6">
                          {analysis.bestQuote && (
                            <>
                              <p className="text-2xl font-bold text-slate-800">{formatCurrency(analysis.bestQuote)}</p>
                              <p className="text-sm text-slate-600 font-medium">Best Quote</p>
                              {analysis.estimatedSavings > 0 && (
                                <p className="text-green-600 font-semibold">Save up to {formatCurrency(analysis.estimatedSavings)}</p>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-slate-700">
                            {analysis.totalItems > 0 ? Math.round((analysis.completedItems / analysis.totalItems) * 100) : 0}% complete
                          </span>
                          <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                            analysis.competitionLevel === 'High Competition' 
                              ? 'bg-green-100 text-green-800' 
                              : analysis.competitionLevel === 'Low Competition'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {analysis.competitionLevel}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${
                              category.status === 'complete' ? 'from-green-500 to-emerald-600' : 'from-orange-400 to-yellow-500'
                            } transition-all duration-1000 ease-out`}
                            style={{ width: `${analysis.totalItems > 0 ? (analysis.completedItems / analysis.totalItems) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onVendorManagementClick(category.id);
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all duration-200 font-semibold hover:shadow-md"
                        >
                          <Settings size={16} />
                          Manage Vendors
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuoteComparisonClick(category.id);
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                        >
                          <Eye size={16} />
                          Compare Quotes
                        </button>
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