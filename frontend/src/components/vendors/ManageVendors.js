// frontend/src/components/vendors/ManageVendors.js
// Compact vendor management with one-line vendor cards

import React, { useState } from 'react';
import { ArrowLeft, Users, Plus, Search, Filter, Mail, Phone, MapPin, Calendar, Clock, CheckCircle, AlertCircle, Send, UserPlus, Edit3, Trash2, Star, Award, Building, Eye } from 'lucide-react';
import { useVendorManagement } from '../../hooks/useVendorManagement';

const ManageVendors = ({ categoryId, onBack }) => {
  const { category, vendors, statistics, loading, error, refetch } = useVendorManagement(categoryId);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [selectedVendors, setSelectedVendors] = useState([]);

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      submitted: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Submitted' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      invited: { color: 'bg-blue-100 text-blue-800', icon: Send, label: 'Invited' },
      declined: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Declined' },
      active: { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle, label: 'Active' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${config.color}`}>
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  const getRating = (rating) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        <Star size={12} className="text-yellow-400 fill-current" />
        <span className="text-xs font-medium text-slate-700">{rating}</span>
      </div>
    );
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.specialties?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || vendor.bidStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleInviteVendors = () => {
    setShowInviteModal(true);
  };

  const handleBulkAction = (action) => {
    console.log(`Performing ${action} on vendors:`, selectedVendors);
    // Implement bulk actions
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading vendor management data...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Unable to Load Vendor Data</h2>
            <p className="text-red-600 mb-4">{error || 'Category not found'}</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={refetch}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
              >
                Try Again
              </button>
              <button 
                onClick={onBack}
                className="border border-slate-300 text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors font-semibold"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Compact Header */}
      <div className="mb-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-md p-4 shadow-lg border border-white/20">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                {category.name} - Vendor Management
              </h1>
              <p className="text-sm text-slate-600">
                {vendors.length} vendors • Deadline: {formatDate(category.deadlineDate)}
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowAddVendorModal(true)}
                className="flex items-center gap-1 bg-gradient-to-r from-green-600 to-emerald-700 text-white px-3 py-2 rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-200 font-medium text-sm"
              >
                <UserPlus size={16} />
                Add
              </button>
              <button 
                onClick={handleInviteVendors}
                className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-3 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-medium text-sm"
              >
                <Send size={16} />
                Invite
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Stats Panel */}
      <div className="bg-white/80 backdrop-blur-sm rounded-md shadow-lg border border-white/30 p-4 mb-6">
        <div className="grid grid-cols-5 gap-4">
          <div className="text-center">
            <p className="text-xl font-bold text-slate-800">{statistics.totalVendors || 0}</p>
            <p className="text-xs text-slate-600">Total</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-green-600">{statistics.quotesReceived || 0}</p>
            <p className="text-xs text-slate-600">Received</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-yellow-600">{statistics.pendingQuotes || 0}</p>
            <p className="text-xs text-slate-600">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-blue-600">{statistics.invitedVendors || 0}</p>
            <p className="text-xs text-slate-600">Invited</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-red-600">{statistics.declinedVendors || 0}</p>
            <p className="text-xs text-slate-600">Declined</p>
          </div>
        </div>
      </div>

      {/* Compact Search and Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-md shadow-lg border border-white/30 p-4 mb-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="pending">Pending</option>
            <option value="invited">Invited</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>

      {/* Compact Bulk Actions */}
      {selectedVendors.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 text-sm font-medium">
              {selectedVendors.length} selected
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => handleBulkAction('invite')}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Invite
              </button>
              <button 
                onClick={() => handleBulkAction('reminder')}
                className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
              >
                Remind
              </button>
              <button 
                onClick={() => setSelectedVendors([])}
                className="px-3 py-1 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compact Vendor List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-md shadow-2xl border border-white/30 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 p-4">
          <h2 className="text-xl font-bold text-white">Vendors</h2>
          <p className="text-slate-200 text-sm">Manage vendor quotes and communications</p>
        </div>
        
        <div className="p-4">
          <div className="space-y-2">
            {filteredVendors.map((vendor) => (
              <div key={vendor.id} className="bg-gradient-to-r from-white to-slate-50 border border-slate-200 rounded-xl p-3 hover:shadow-md transition-all duration-200 cursor-pointer group hover:border-blue-300 h-min">
                <div className="flex items-center justify-between">
                  {/* Left side - Checkbox, Name and Status */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={selectedVendors.includes(vendor.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedVendors([...selectedVendors, vendor.id]);
                        } else {
                          setSelectedVendors(selectedVendors.filter(id => id !== vendor.id));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                      <Building className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors truncate">
                        {vendor.name}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">{vendor.email}</p>
                    </div>
                    {getStatusBadge(vendor.bidStatus)}
                  </div>

                  {/* Middle - Contact and Rating */}
                  <div className="flex items-center gap-7 text-sm">
                    <div className="text-center hidden md:block">
                      <div className="text-xs text-slate-500">Phone</div>
                      <div className="font-medium text-slate-700 text-xs">{vendor.phone || 'N/A'}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500">Last Contact</div>
                      <div className="font-medium text-slate-700 text-xs">{formatDate(vendor.lastContact)}</div>
                    </div>
                  </div>

                  {/* Right side - Quote and Actions */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      {vendor.bidAmount ? (
                        <>
                          <div className="font-bold text-slate-800">{formatCompactCurrency(vendor.bidAmount)}</div>
                          <div className="text-xs text-slate-500">Quote</div>
                        </>
                      ) : (
                        <>
                          <div className="text-sm font-medium text-slate-500">No Quote</div>
                          <div className="text-xs text-slate-500">Invited {formatDate(vendor.inviteDate)}</div>
                        </>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Email Vendor"
                      >
                        <Mail size={16} />
                      </button>
                      <button 
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                        title="Send Quote Request"
                      >
                        <Send size={16} />
                      </button>
                      <button 
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200"
                        title="Send Reminder"
                      >
                        <Clock size={16} />
                      </button>
                      <button 
                        className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-all duration-200"
                        title="Edit Details"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Compact specialties row */}
                {vendor.specialties && vendor.specialties.length > 0 && (
                  <div className="mt-2 pl-11">
                    <div className="flex flex-wrap gap-1">
                      {vendor.specialties.slice(0, 3).map((specialty, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">
                          {specialty}
                        </span>
                      ))}
                      {vendor.specialties.length > 3 && (
                        <span className="text-xs text-slate-500">+{vendor.specialties.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {filteredVendors.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">No vendors found</h3>
          <p className="text-slate-600 mb-4">Try adjusting your search or filter criteria</p>
          <button 
            onClick={() => setShowAddVendorModal(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-medium"
          >
            Add New Vendor
          </button>
        </div>
      )}

      {/* Modals remain the same but simplified */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-3">Send Quote Invitations</h3>
            <p className="text-slate-600 mb-4">Send quote requests to selected vendors for {category.name}.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowInviteModal(false)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2 rounded-xl font-medium"
              >
                Send Invites
              </button>
              <button 
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddVendorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-3">Add New Vendor</h3>
            <p className="text-slate-600 mb-4">Add a new vendor to your {category.name} category.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowAddVendorModal(false)}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 text-white py-2 rounded-xl font-medium"
              >
                Add Vendor
              </button>
              <button 
                onClick={() => setShowAddVendorModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVendors;