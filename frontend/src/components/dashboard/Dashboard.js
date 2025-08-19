// frontend/src/components/dashboard/Dashboard.js
// Main dashboard component that provides portfolio overview and navigation

import React from 'react';
import { FileText, Clock, CheckCircle, TrendingUp, Plus, AlertCircle } from 'lucide-react';
import { useProjects } from '../../hooks/useApi';
import LoadingCard from '../shared/LoadingCard';
import ErrorCard from '../shared/ErrorCard';
import ProjectSummaryCard from './ProjectSummaryCard';
import MetricCard from './MetricCard';

const Dashboard = ({ onProjectClick, onCreateProjectClick }) => {
  // Fetch projects data using our custom hook
  const { projects, loading, error, refetchProjects } = useProjects();

  // Handle loading state with a shared component
  if (loading) {
    return <LoadingCard message="Loading your projects..." />;
  }

  // Handle error state with actionable feedback
  if (error) {
    return (
      <ErrorCard 
        title="Unable to Load Projects"
        message={error}
        onRetry={refetchProjects}
      />
    );
  }

  // Calculate portfolio metrics from real data
  const portfolioMetrics = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active' || p.status === 'early').length,
    completedProjects: projects.filter(p => p.status === 'complete').length
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Dashboard Header */}
      <div className="mb-10">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-3">
                Altadena Collective/Brass Tacks Vendor Management
              </h1>
              <p className="text-lg text-slate-600 font-medium">
                Manage your projects and track bidding progress across all active jobs
              </p>
            </div>
            <button
              onClick={onCreateProjectClick} 
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus size={24} />
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <MetricCard
          title="Total Projects"
          value={portfolioMetrics.totalProjects}
          subtitle="Active portfolio"
          icon={FileText}
          color="from-blue-100 to-indigo-100"
          iconColor="text-blue-600"
        />
        <MetricCard
          title="Active Projects"
          value={portfolioMetrics.activeProjects}
          subtitle="In progress"
          icon={Clock}
          color="from-amber-100 to-orange-100"
          iconColor="text-amber-600"
        />
        <MetricCard
          title="Completed"
          value={portfolioMetrics.completedProjects}
          subtitle="Successfully finished"
          icon={CheckCircle}
          color="from-emerald-100 to-teal-100"
          iconColor="text-emerald-600"
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {projects.map(project => (
          <ProjectSummaryCard
            key={project.id}
            project={project}
            onClick={() => onProjectClick(project.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;