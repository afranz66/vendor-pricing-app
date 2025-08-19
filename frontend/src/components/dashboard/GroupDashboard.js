// frontend/src/components/dashboard/GroupDashboard.js
// Dashboard view for projects within a specific group

import React from 'react';
import { ArrowLeft, Building2, MapPin, Calendar, DollarSign, Users, FolderOpen } from 'lucide-react';
import { useProjects } from '../../hooks/useApi';
import LoadingCard from '../shared/LoadingCard';
import ErrorCard from '../shared/ErrorCard';
import ProjectSummaryCard from './ProjectSummaryCard';
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

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header with Back Button */}
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        
        {/* Group Hero Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-48 bg-gradient-to-br from-slate-100 to-blue-100">
            {group.image ? (
              <img 
                src={group.image} 
                alt={group.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-200 to-blue-200 flex items-center justify-center">
                <Building2 size={64} className="text-slate-400" />
              </div>
            )}
            
            {/* Status Badge */}
            <div className="absolute top-6 right-6">
              <div className={`px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r ${getStatusColor()} shadow-lg`}>
                {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
              </div>
            </div>
          </div>

          {/* Group Information */}
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-3">
                  {group.name}
                </h1>
                <p className="text-lg text-slate-600 font-medium mb-4">
                  {group.description}
                </p>
                
                {/* Group Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Users size={20} className="text-blue-600" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Client</p>
                      <p className="font-bold text-slate-800">{group.client}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <MapPin size={20} className="text-green-600" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Location</p>
                      <p className="font-bold text-slate-800">{group.location.city}, {group.location.state}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Calendar size={20} className="text-purple-600" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Expected Completion</p>
                      <p className="font-bold text-slate-800">{new Date(group.expectedCompletion).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <DollarSign size={20} className="text-emerald-600" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Total Value</p>
                      <p className="font-bold text-slate-800">${group.totalValue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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

      {/* Projects in Group */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Projects in {group.name}</h2>
        
        {groupProjects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {groupProjects.map(project => (
              <ProjectSummaryCard
                key={project.id}
                project={project}
                onClick={() => onProjectClick(project.id)}
                onGCClick={onGCClick}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-12 text-center">
            <FolderOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Projects Yet</h3>
            <p className="text-slate-600">Projects will appear here as they're added to this group.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDashboard;