// frontend/src/components/dashboard/Dashboard.js
// Main dashboard component showing only project groups

import React from 'react';
import { FileText, Clock, CheckCircle, TrendingUp, Plus, FolderOpen } from 'lucide-react';
import { useProjects } from '../../hooks/useApi';
import { useGroups } from '../../hooks/useGroups';
import LoadingCard from '../shared/LoadingCard';
import ErrorCard from '../shared/ErrorCard';
import GroupCard from './GroupCard';
import MetricCard from './MetricCard';

const Dashboard = ({ onProjectClick, onCreateProjectClick, onGCClick, onGroupClick }) => {
  // Fetch projects and groups data using our custom hooks
  const { projects, loading: projectsLoading, error: projectsError, refetchProjects } = useProjects();
  const { groups, loading: groupsLoading, error: groupsError, refetchGroups } = useGroups();

  // Handle loading state with a shared component
  if (projectsLoading || groupsLoading) {
    return <LoadingCard message="Loading your project collections..." />;
  }

  // Handle error state with actionable feedback
  if (projectsError || groupsError) {
    return (
      <ErrorCard 
        title="Unable to Load Data"
        message={projectsError || groupsError}
        onRetry={() => {
          refetchProjects();
          refetchGroups();
        }}
      />
    );
  }

  // Calculate portfolio metrics from real data
  const portfolioMetrics = {
    totalProjects: projects.length,
    totalGroups: groups.length,
    activeProjects: projects.filter(p => p.status === 'active' || p.status === 'early').length,
    completedProjects: projects.filter(p => p.status === 'complete').length,
    totalValue: projects.reduce((sum, p) => sum + (p.estimatedValue || 0), 0)
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Dashboard Header */}
      <div className="mb-10">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-3">
                Project Collections Dashboard
              </h1>
              <p className="text-lg text-slate-600 font-medium">
                Manage your project groups and track progress across related developments
              </p>
            </div>
            <button
              onClick={onCreateProjectClick} 
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl"
            >
              <Plus size={24} />
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <MetricCard
          title="Total Projects"
          value={portfolioMetrics.totalProjects}
          subtitle="Across all collections"
          icon={FileText}
          color="from-blue-100 to-indigo-100"
          iconColor="text-blue-600"
        />
        <MetricCard
          title="Project Collections"
          value={portfolioMetrics.totalGroups}
          subtitle="Active groups"
          icon={FolderOpen}
          color="from-purple-100 to-pink-100"
          iconColor="text-purple-600"
        />
        <MetricCard
          title="Active Projects"
          value={portfolioMetrics.activeProjects}
          subtitle="Currently in progress"
          icon={Clock}
          color="from-amber-100 to-orange-100"
          iconColor="text-amber-600"
        />
        <MetricCard
          title="Portfolio Value"
          value={`${(portfolioMetrics.totalValue / 1000000).toFixed(1)}M`}
          subtitle="Total estimated value"
          icon={TrendingUp}
          color="from-emerald-100 to-teal-100"
          iconColor="text-emerald-600"
        />
      </div>

      {/* Project Groups Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Project Collections</h2>
            <p className="text-slate-600">Organized groups of related construction projects</p>
          </div>
          <span className="text-sm text-slate-600 bg-slate-100 px-4 py-2 rounded-full font-medium">
            {groups.length} collections • {portfolioMetrics.totalProjects} total projects
          </span>
        </div>

        {groups.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {groups.map(group => (
              <GroupCard
                key={group.id}
                group={group}
                onClick={() => onGroupClick && onGroupClick(group)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-12 text-center">
            <FolderOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Project Collections Yet</h3>
            <p className="text-slate-600 mb-6">Create your first project collection to organize related developments.</p>
            <button
              onClick={onCreateProjectClick}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 flex items-center gap-2 mx-auto"
            >
              <Plus size={20} />
              Create First Project
            </button>
          </div>
        )}
      </div>

      {/* Quick Stats Section */}
      {groups.length > 0 && (
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Collection Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              <p className="text-2xl font-bold text-blue-700">
                {groups.filter(g => g.status === 'active').length}
              </p>
              <p className="text-sm text-blue-600 font-medium">Active Collections</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
              <p className="text-2xl font-bold text-emerald-700">
                {Math.round(portfolioMetrics.totalProjects / groups.length)}
              </p>
              <p className="text-sm text-emerald-600 font-medium">Avg Projects per Collection</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
              <p className="text-2xl font-bold text-purple-700">
                ${(portfolioMetrics.totalValue / groups.length / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm text-purple-600 font-medium">Avg Value per Collection</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;