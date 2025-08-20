// frontend/src/components/dashboard/GroupDashboard.js
// Dashboard view for projects within a specific group - with compact project cards

import React from 'react';
import { ArrowLeft, Building2, MapPin, Calendar, DollarSign, Users, FolderOpen, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useProjects } from '../../hooks/useApi';
import LoadingCard from '../shared/LoadingCard';
import ErrorCard from '../shared/ErrorCard';
import MetricCard from './MetricCard';

const GroupDashboard = ({ group, onBack, onProjectClick, onGCClick }) => {
  const { projects, loading, error, refetchProjects } = useProjects();

  // Handle loading state
  if (loading) {
    return <LoadingCard message="Loading group projects..." />;
  }

  // Handle error state
  if (error) {
    return (
      <ErrorCard 
        title="Unable to Load Group Projects"
        message={error}
        onRetry={refetchProjects}
      />
    );
  }

  // Filter projects for this group
  const groupProjects = projects.filter(project => project.groupId === group.id);

  // Calculate group metrics
  const groupMetrics = {
    totalProjects: groupProjects.length,
    activeProjects: groupProjects.filter(p => p.status === 'active' || p.status === 'early').length,
    completedProjects: groupProjects.filter(p => p.status === 'complete').length,
    totalValue: groupProjects.reduce((sum, p) => sum + (p.estimatedValue || 0), 0)
  };

  const getStatusColor = () => {
    switch (group.status) {
      case 'active':
        return 'from-blue-500 to-indigo-600';
      case 'planning':
        return 'from-amber-500 to-orange-600';
      case 'completed':
        return 'from-emerald-500 to-teal-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  // Helper functions for project status
  const getProjectStatusStyling = (status) => {
    const styles = {
      active: 'from-blue-500 to-indigo-600',
      early: 'from-purple-500 to-indigo-600',
      complete: 'from-green-500 to-emerald-600',
      planning: 'from-yellow-500 to-orange-600'
    };
    return styles[status] || styles.planning;
  };

  const getProjectStatusIcon = (status) => {
    const icons = {
      active: <Clock size={12} />,
      early: <Clock size={12} />,
      complete: <CheckCircle size={12} />,
      planning: <Calendar size={12} />
    };
    return icons[status] || icons.planning;
  };

  const formatProjectStatus = (status) => {
    const labels = {
      active: 'Active',
      early: 'Early',
      complete: 'Done',
      planning: 'Planning'
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

  const formatCompactCurrency = (amount) => {
    if (!amount) return 'N/A';
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return formatCurrency(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-1 py-8">
      {/* Header with Back Button */}
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
      </div>

      {/* Group Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <MetricCard
          title="Total Projects"
          value={groupMetrics.totalProjects}
          subtitle="In this collection"
          icon={FolderOpen}
          color="from-blue-100 to-indigo-100"
          iconColor="text-blue-600"
        />
        <MetricCard
          title="Active Projects"
          value={groupMetrics.activeProjects}
          subtitle="Currently in progress"
          icon={Building2}
          color="from-amber-100 to-orange-100"
          iconColor="text-amber-600"
        />
        <MetricCard
          title="Completed"
          value={groupMetrics.completedProjects}
          subtitle="Successfully finished"
          icon={Calendar}
          color="from-emerald-100 to-teal-100"
          iconColor="text-emerald-600"
        />
        <MetricCard
          title="Actual Value"
          value={`$${(groupMetrics.totalValue / 1000000).toFixed(1)}M`}
          subtitle="Current project total"
          icon={DollarSign}
          color="from-purple-100 to-pink-100"
          iconColor="text-purple-600"
        />
      </div>

      {/* Compact Projects in Group */}
      <div className="mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 p-4">
            <h2 className="text-xl font-bold text-white">Projects in {group.name}</h2>
            <p className="text-slate-200 text-sm">Click on any project to view detailed information</p>
          </div>
          
          {groupProjects.length > 0 ? (
            <div className="p-4">
              <div className="space-y-2">
                {groupProjects.map(project => {
                  const completionPercent = project.metrics?.completionPercentage || 0;
                  const activeVendors = project.metrics?.activeVendors || 0;
                  const totalVendors = project.metrics?.totalVendors || 0;
                  const quotedMaterials = project.metrics?.quotedMaterials || 0;
                  const totalMaterials = project.metrics?.totalMaterials || 0;
                  
                  return (
                    <div 
                      key={project.id} 
                      className="bg-gradient-to-r from-white to-slate-50 border border-slate-200 rounded-md p-3 hover:shadow-md transition-all duration-200 cursor-pointer group hover:border-blue-300 h-min"
                      onClick={() => onProjectClick(project.id)}
                    >
                      <div className="flex items-center justify-between">
                        {/* Left side - Name and Status */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors truncate">
                            {project.name}
                          </h3>
                          <span className={`px-2 py-1 rounded-lg text-xs font-semibold text-white flex items-center gap-1 bg-gradient-to-r ${getProjectStatusStyling(project.status)} shadow-sm`}>
                            {getProjectStatusIcon(project.status)}
                            {formatProjectStatus(project.status)}
                          </span>
                        </div>

                        {/* Middle - Progress and Metrics */}
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-semibold text-slate-700">{activeVendors}/{totalVendors}</div>
                            <div className="text-xs text-slate-500">Vendors</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-slate-700">{quotedMaterials}/{totalMaterials}</div>
                            <div className="text-xs text-slate-500">Materials</div>
                          </div>
                        </div>

                        {/* Right side - Value and Actions */}
                        <div className="flex items-center gap-3 text-sm">
                          <div className="text-right">
                            <div className="font-semibold text-slate-800">{formatCompactCurrency(project.estimatedValue)}</div>
                            <div className="text-xs text-slate-500">Value</div>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                onGCClick && onGCClick(project.id);
                              }}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                              title="General Contractor View"
                            >
                              <Building2 size={16} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                onProjectClick(project.id);
                              }}
                              className="p-2 text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 rounded-lg transition-all duration-200 shadow-sm"
                              title="View Project Details"
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
          ) : (
            <div className="p-12 text-center">
              <FolderOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">No Projects Yet</h3>
              <p className="text-slate-600">Projects will appear here as they're added to this group.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupDashboard;