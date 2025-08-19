// frontend/src/components/dashboard/GroupCard.js
// Card component for displaying project groups with images

import React from 'react';
import { Building2, MapPin, Calendar, DollarSign, FolderOpen, Users } from 'lucide-react';

const GroupCard = ({ group, onClick }) => {
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

  const getTypeIcon = () => {
    switch (group.type) {
      case 'residential':
        return <Building2 size={20} className="text-white" />;
      case 'commercial':
        return <Building2 size={20} className="text-white" />;
      default:
        return <FolderOpen size={20} className="text-white" />;
    }
  };

  // Use actual metrics from backend if available, otherwise fall back to static data
  const projectCount = group.actualProjectCount ?? group.totalProjects ?? 0;
  const totalValue = group.actualTotalValue ?? group.totalValue ?? 0;
  const activeProjects = group.activeProjects ?? 0;
  const completedProjects = group.completedProjects ?? 0;

  return (
    <div 
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      {/* Hero Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-blue-100 overflow-hidden">
        {group.image ? (
          <img 
            src={group.image} 
            alt={group.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback to gradient background if image fails to load
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-200 to-blue-200 flex items-center justify-center">
            <Building2 size={48} className="text-slate-400" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <div className={`px-3 py-1 rounded-full text-sm font-bold text-white bg-gradient-to-r ${getStatusColor()} shadow-lg flex items-center gap-2`}>
            {getTypeIcon()}
            {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
          </div>
        </div>

        {/* Project Count Badge */}
        <div className="absolute top-4 left-4">
          <div className="px-3 py-1 rounded-full text-sm font-bold bg-black/20 backdrop-blur-sm text-white border border-white/20">
            {projectCount} Projects
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Group Header */}
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">
            {group.name}
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
            {group.description}
          </p>
        </div>

        {/* Group Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Client */}
          <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-100">
            <Users size={16} className="text-blue-600" />
            <div>
              <p className="text-xs text-slate-500 font-medium">Client</p>
              <p className="text-sm font-bold text-slate-800">{group.client}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-slate-50 to-green-50 rounded-xl border border-slate-100">
            <MapPin size={16} className="text-green-600" />
            <div>
              <p className="text-xs text-slate-500 font-medium">Location</p>
              <p className="text-sm font-bold text-slate-800">{group.location.city}, {group.location.state}</p>
            </div>
          </div>
        </div>

        {/* Project Status Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <p className="text-lg font-bold text-blue-700">{activeProjects}</p>
            <p className="text-xs text-blue-600 font-medium">Active</p>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
            <p className="text-lg font-bold text-emerald-700">{completedProjects}</p>
            <p className="text-xs text-emerald-600 font-medium">Complete</p>
          </div>
        </div>

        {/* Financial & Timeline Info */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-medium flex items-center gap-2">
              <DollarSign size={16} />
              Total Value:
            </span>
            <span className="font-bold text-slate-800 text-lg">
              ${totalValue.toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-medium flex items-center gap-2">
              <Calendar size={16} />
              Expected Completion:
            </span>
            <span className="font-bold text-slate-800">
              {new Date(group.expectedCompletion).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-200">
          <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl">
            View {projectCount} Projects →
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;