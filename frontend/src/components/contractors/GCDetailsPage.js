// frontend/src/components/contractors/GCDetailsPage.js
// Dedicated page for general contractor details and bid information

import React from 'react';
import { ArrowLeft, Building2, User, Phone, Mail, DollarSign, Calendar, MapPin, FileText, Clock } from 'lucide-react';

const GCDetailsPage = ({ project, onBack }) => {
  if (!project) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center text-slate-600">
          <p>No project data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header with Back Button */}
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="flex items-center gap-4 mb-4">
            <Building2 className="text-green-600" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-slate-800">General Contractor Details</h1>
              <p className="text-slate-600">Project: {project.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Contractor Information */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <Building2 className="text-green-600" size={24} />
            Contractor Information
          </h2>

          {/* Company Name */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 mb-6">
            <h3 className="font-bold text-slate-800 text-xl">{project.generalcontractor}</h3>
            <p className="text-slate-600 mt-1">General Contractor</p>
          </div>

          {/* Contact Information */}
          {project.gcContact && (
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-800 text-lg border-b border-slate-200 pb-2">
                Contact Information
              </h4>
              
              {project.gcContact.name && (
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <User size={20} className="text-slate-600" />
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Representative</p>
                    <p className="font-semibold text-slate-800 text-lg">{project.gcContact.name}</p>
                  </div>
                </div>
              )}

              {project.gcContact.email && (
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <Mail size={20} className="text-slate-600" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-500 font-medium">Email</p>
                    <a 
                      href={`mailto:${project.gcContact.email}?subject=Project: ${project.name}`}
                      className="font-semibold text-blue-600 hover:text-blue-800 transition-colors text-lg"
                    >
                      {project.gcContact.email}
                    </a>
                  </div>
                </div>
              )}

              {project.gcContact.phone && (
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <Phone size={20} className="text-slate-600" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-500 font-medium">Phone</p>
                    <a 
                      href={`tel:${project.gcContact.phone}`}
                      className="font-semibold text-blue-600 hover:text-blue-800 transition-colors text-lg"
                    >
                      {project.gcContact.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Contact Actions */}
          <div className="flex gap-3 mt-8">
            <button 
              onClick={() => {
                if (project.gcContact && project.gcContact.email) {
                  window.open(`mailto:${project.gcContact.email}?subject=Project: ${project.name}`, '_blank');
                }
              }}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              disabled={!project.gcContact || !project.gcContact.email}
            >
              <Mail size={18} />
              Send Email
            </button>
            <button 
              onClick={() => {
                if (project.gcContact && project.gcContact.phone) {
                  window.open(`tel:${project.gcContact.phone}`, '_blank');
                }
              }}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              disabled={!project.gcContact || !project.gcContact.phone}
            >
              <Phone size={18} />
              Call
            </button>
          </div>
        </div>

        {/* Project & Bid Information */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <FileText className="text-blue-600" size={24} />
            Project & Bid Information
          </h2>

          <div className="space-y-6">
            {/* Project Value */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="text-blue-600" size={20} />
                <p className="text-sm text-slate-600 font-medium">Project Estimated Value</p>
              </div>
              <p className="font-bold text-slate-800 text-2xl">${project.estimatedValue.toLocaleString()}</p>
            </div>

            {/* Bid Deadline */}
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="text-amber-600" size={20} />
                <p className="text-sm text-slate-600 font-medium">Bid Deadline</p>
              </div>
              <p className="font-bold text-slate-800 text-xl">{new Date(project.bidDeadline).toLocaleDateString()}</p>
              <p className="text-sm text-slate-500 mt-1">
                {Math.ceil((new Date(project.bidDeadline) - new Date()) / (1000 * 60 * 60 * 24))} days remaining
              </p>
            </div>

            {/* Project Status */}
            <div className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="text-slate-600" size={20} />
                <p className="text-sm text-slate-600 font-medium">Current Status</p>
              </div>
              <p className="font-bold text-slate-800 text-xl capitalize">{project.status.replace('_', ' ')}</p>
            </div>

            {/* Project Location */}
            {project.location && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="text-green-600" size={20} />
                  <p className="text-sm text-slate-600 font-medium">Project Location</p>
                </div>
                <p className="font-semibold text-slate-800">
                  {project.location.address}
                </p>
                <p className="text-slate-600">
                  {project.location.city}, {project.location.state} {project.location.zipCode}
                </p>
              </div>
            )}

            {/* Start Date */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="text-purple-600" size={20} />
                <p className="text-sm text-slate-600 font-medium">Project Start Date</p>
              </div>
              <p className="font-bold text-slate-800 text-xl">{new Date(project.startDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Description */}
      {project.description && (
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Project Description</h2>
          <p className="text-slate-700 leading-relaxed text-lg">{project.description}</p>
        </div>
      )}
    </div>
  );
};

export default GCDetailsPage;