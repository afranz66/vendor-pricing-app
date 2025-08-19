// src/components/vendors/VendorCatalog.js
// Complete vendor catalog component for the vendors section

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  Star,
  Calendar,
  Edit3,
  Eye,
  Users,
  Award,
  TrendingUp
} from 'lucide-react';
import { useVendors } from '../../hooks/useApi';

const VendorCatalog = ({ onCreateVendor, onViewVendor, onEditVendor }) => {
  const { vendors, loading, error, refetchVendors } = useVendors();
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('companyName');

  // Get unique specialties for filter
  const specialties = vendors ? [...new Set(vendors.flatMap(vendor => vendor.specialties || []))] : [];

  // Filter and sort vendors
  const filteredVendors = vendors?.filter(vendor => {
    const matchesSearch = vendor.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.contactInfo?.representative?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = specialtyFilter === 'all' || 
                           vendor.specialties?.includes(specialtyFilter);
    
    return matchesSearch && matchesSpecialty;
  }).sort((a, b) => {
    if (sortBy === 'companyName') {
      return a.companyName?.localeCompare(b.companyName) || 0;
    }
    if (sortBy === 'dateAdded') {
      return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);
    }
    return 0;
  }) || [];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRatingStars = (rating = 4.5) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-slate-300'}
      />
    ));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading vendor catalog...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Unable to Load Vendors</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={refetchVendors}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-3">
                Vendor Catalog
              </h1>
              <p className="text-lg text-slate-600 font-medium">
                Manage relationships with {vendors?.length || 0} construction vendors
              </p>
            </div>
            <button
              onClick={onCreateVendor} 
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus size={24} />
              Add Vendor
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search vendors by name or representative..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-4">
              <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Specialties</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="companyName">Sort by Name</option>
                <option value="dateAdded">Sort by Date Added</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-slate-800">{vendors?.length || 0}</p>
              <p className="text-slate-600 font-medium">Total Vendors</p>
            </div>
            <Building className="text-blue-600" size={32} />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-teal-100 rounded-2xl p-6 border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-slate-800">{specialties.length}</p>
              <p className="text-slate-600 font-medium">Specialties</p>
            </div>
            <Award className="text-emerald-600" size={32} />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-6 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-slate-800">
                {vendors?.filter(v => new Date(v.dateAdded) > new Date(Date.now() - 30*24*60*60*1000)).length || 0}
              </p>
              <p className="text-slate-600 font-medium">New This Month</p>
            </div>
            <TrendingUp className="text-purple-600" size={32} />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-6 border border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-slate-800">4.6</p>
              <p className="text-slate-600 font-medium">Avg Rating</p>
            </div>
            <Star className="text-amber-600" size={32} />
          </div>
        </div>
      </div>

      {/* Vendor Grid */}
      {filteredVendors.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredVendors.map(vendor => (
            <div key={vendor.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-800 to-blue-900 p-6 text-white">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold">{vendor.companyName}</h3>
                  <div className="flex items-center gap-1">
                    {getRatingStars()}
                  </div>
                </div>
                <p className="text-slate-200">{vendor.contactInfo?.representative}</p>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Contact Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-slate-400" />
                    <span className="text-sm text-slate-600">{vendor.contactInfo?.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-slate-400" />
                    <span className="text-sm text-slate-600">{vendor.contactInfo?.phone}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-slate-400 mt-0.5" />
                    <span className="text-sm text-slate-600">
                      {vendor.address?.city}, {vendor.address?.state}
                    </span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-slate-800 mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {vendor.specialties?.map(specialty => (
                      <span key={specialty} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Date Added */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                  <Calendar size={14} />
                  Added {formatDate(vendor.dateAdded)}
                </div>

                {/* Notes */}
                {vendor.notes && (
                  <div className="mb-4">
                    <p className="text-sm text-slate-600 italic">"{vendor.notes}"</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-slate-200">
                  <button 
                    onClick={() => onViewVendor?.(vendor.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all duration-200 font-medium"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button 
                    onClick={() => onEditVendor?.(vendor.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all duration-200 font-medium"
                  >
                    <Edit3 size={16} />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-12 text-center">
          <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            {searchTerm || specialtyFilter !== 'all' ? 'No Vendors Found' : 'No Vendors Yet'}
          </h3>
          <p className="text-slate-600 mb-6">
            {searchTerm || specialtyFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Start building your vendor network by adding your first vendor.'
            }
          </p>
          {(!searchTerm && specialtyFilter === 'all') && (
            <button
              onClick={onCreateVendor}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              Add Your First Vendor
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default VendorCatalog;