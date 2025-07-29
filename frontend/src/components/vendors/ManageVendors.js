import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Plus, Search, Filter, Mail, Phone, MapPin, Calendar, Clock, CheckCircle, AlertCircle, Send, UserPlus, Edit3, Trash2, Star, Award, Building } from 'lucide-react';

const ManageVendorsPage = ({ categoryId, onBack }) => {
  const [category, setCategory] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [selectedVendors, setSelectedVendors] = useState([]);

  // Mock data - in real app, this would come from your API
  useEffect(() => {
    setTimeout(() => {
      const mockCategory = {
        id: 301,
        name: "Structural Steel",
        description: "Primary structural steel framework and support systems",
        totalItems: 12,
        quotedItems: 8,
        deadlineDate: "2025-02-01"
      };

      const mockVendors = [
        {
          id: 101,
          name: "SteelCorp Industries",
          email: "quotes@steelcorp.com",
          phone: "(555) 123-4567",
          address: "123 Industrial Blvd, Steel City, NY 10001",
          website: "www.steelcorp.com",
          bidStatus: "submitted",
          bidAmount: 145000,
          bidDate: "2025-01-20",
          inviteDate: "2025-01-15",
          lastContact: "2025-01-22",
          rating: 4.8,
          completedProjects: 47,
          specialties: ["Structural Steel", "Welding", "Fabrication"],
          certifications: ["ISO 9001", "AISC Certified"],
          notes: "Reliable vendor with excellent track record",
          status: "active"
        },
        {
          id: 102,
          name: "Metropolitan Steel",
          email: "sales@metrosteel.com",
          phone: "(555) 987-6543",
          address: "456 Metro Ave, Steel City, NY 10002",
          website: "www.metrosteel.com",
          bidStatus: "submitted",
          bidAmount: 162000,
          bidDate: "2025-01-18",
          inviteDate: "2025-01-15",
          lastContact: "2025-01-20",
          rating: 4.5,
          completedProjects: 32,
          specialties: ["Structural Steel", "Construction"],
          certifications: ["ISO 9001"],
          notes: "Good pricing, standard delivery times",
          status: "active"
        },
        {
          id: 103,
          name: "BuildStrong Materials",
          email: "info@buildstrong.com",
          phone: "(555) 456-7890",
          address: "789 Construction Way, Steel City, NY 10003",
          website: "www.buildstrong.com",
          bidStatus: "submitted",
          bidAmount: 178000,
          bidDate: "2025-01-17",
          inviteDate: "2025-01-15",
          lastContact: "2025-01-19",
          rating: 4.2,
          completedProjects: 28,
          specialties: ["Materials Supply", "Steel", "Bulk Orders"],
          certifications: ["AISC Certified"],
          notes: "Bulk pricing specialist",
          status: "active"
        },
        {
          id: 104,
          name: "ProSteel Solutions",
          email: "contact@prosteel.com",
          phone: "(555) 321-0987",
          address: "321 Steel Ave, Steel City, NY 10004",
          website: "www.prosteel.com",
          bidStatus: "pending",
          bidAmount: null,
          bidDate: null,
          inviteDate: "2025-01-15",
          lastContact: "2025-01-16",
          rating: 4.6,
          completedProjects: 52,
          specialties: ["Custom Fabrication", "Steel", "Engineering"],
          certifications: ["ISO 9001", "AISC Certified", "AWS Certified"],
          notes: "High-end fabrication specialist",
          status: "invited"
        },
        {
          id: 105,
          name: "QuickSteel Corp",
          email: "quotes@quicksteel.com",
          phone: "(555) 654-3210",
          address: "654 Industrial Dr, Steel City, NY 10005",
          website: "www.quicksteel.com",
          bidStatus: "declined",
          bidAmount: null,
          bidDate: null,
          inviteDate: "2025-01-15",
          lastContact: "2025-01-17",
          rating: 3.9,
          completedProjects: 19,
          specialties: ["Fast Delivery", "Steel", "Emergency Orders"],
          certifications: ["ISO 9001"],
          notes: "Declined due to capacity constraints",
          status: "declined"
        }
      ];

      setCategory(mockCategory);
      setVendors(mockVendors);
      setLoading(false);
    }, 500);
  }, [categoryId]);

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      submitted: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Quote Submitted' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Quote Pending' },
      invited: { color: 'bg-blue-100 text-blue-800', icon: Send, label: 'Invited' },
      declined: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Declined' },
      active: { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle, label: 'Active' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
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
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading vendor management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="flex items-center gap-6">
            <button 
              onClick={onBack}
              className="p-3 hover:bg-slate-100 rounded-2xl transition-all duration-200 hover:shadow-md"
            >
              <ArrowLeft size={24} className="text-slate-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">
                {category.name} - Vendor Management
              </h1>
              <p className="text-lg text-slate-600 font-medium">
                Managing {vendors.length} vendors • Deadline: {formatDate(category.deadlineDate)}
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowAddVendorModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white px-6 py-3 rounded-2xl hover:from-green-700 hover:to-emerald-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                <UserPlus size={20} />
                Add Vendor
              </button>
              <button 
                onClick={handleInviteVendors}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                <Send size={20} />
                Send Invites
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-800">{vendors.length}</p>
            <p className="text-sm text-slate-600 font-medium">Total Vendors</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{vendors.filter(v => v.bidStatus === 'submitted').length}</p>
            <p className="text-sm text-slate-600 font-medium">Quotes Received</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600">{vendors.filter(v => v.bidStatus === 'pending').length}</p>
            <p className="text-sm text-slate-600 font-medium">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{vendors.filter(v => v.bidStatus === 'invited' || v.status === 'invited').length}</p>
            <p className="text-sm text-slate-600 font-medium">Invited</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">{vendors.filter(v => v.bidStatus === 'declined').length}</p>
            <p className="text-sm text-slate-600 font-medium">Declined</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search vendors by name, email, or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-3">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="submitted">Quote Submitted</option>
              <option value="pending">Quote Pending</option>
              <option value="invited">Invited</option>
              <option value="declined">Declined</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-slate-700 font-medium transition-colors">
              <Filter size={20} />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedVendors.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              {selectedVendors.length} vendor{selectedVendors.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => handleBulkAction('invite')}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Send Invites
              </button>
              <button 
                onClick={() => handleBulkAction('reminder')}
                className="px-4 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors font-medium"
              >
                Send Reminder
              </button>
              <button 
                onClick={() => setSelectedVendors([])}
                className="px-4 py-2 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vendor List */}
      <div className="space-y-6">
        {filteredVendors.map((vendor) => (
          <div key={vendor.id} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 transition-all duration-300 hover:shadow-2xl">
            {/* Vendor Header */}
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
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
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                    <Building className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-slate-800">{vendor.name}</h3>
                      {getStatusBadge(vendor.bidStatus)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        {getRatingStars(vendor.rating)}
                        <span className="ml-1 font-medium">{vendor.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{vendor.completedProjects} completed projects</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {vendor.bidAmount ? (
                    <>
                      <p className="text-3xl font-bold text-slate-800">{formatCurrency(vendor.bidAmount)}</p>
                      <p className="text-sm text-slate-600">Quote submitted {formatDate(vendor.bidDate)}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xl font-semibold text-slate-500">No Quote Yet</p>
                      <p className="text-sm text-slate-600">Invited {formatDate(vendor.inviteDate)}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Vendor Details */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {/* Contact Info */}
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Contact Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <a href={`mailto:${vendor.email}`} className="text-blue-600 hover:text-blue-800">{vendor.email}</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <a href={`tel:${vendor.phone}`} className="text-blue-600 hover:text-blue-800">{vendor.phone}</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">{vendor.address}</span>
                    </div>
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Specialties & Certifications
                  </h4>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {vendor.specialties.map((specialty, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-medium">
                          {specialty}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {vendor.certifications.map((cert, index) => (
                        <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-xs font-medium">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Timeline
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Invited:</span>
                      <span className="font-medium">{formatDate(vendor.inviteDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Last Contact:</span>
                      <span className="font-medium">{formatDate(vendor.lastContact)}</span>
                    </div>
                    {vendor.bidDate && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Quote Date:</span>
                        <span className="font-medium text-green-600">{formatDate(vendor.bidDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {vendor.notes && (
                <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                  <h4 className="font-semibold text-slate-800 mb-2">Notes</h4>
                  <p className="text-slate-700 text-sm">{vendor.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg">
                  <Mail size={16} />
                  Email Vendor
                </button>
                <button className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white px-4 py-2 rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg">
                  <Send size={16} />
                  Send Quote Request
                </button>
                <button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl transition-colors font-medium shadow-md hover:shadow-lg">
                  <Clock size={16} />
                  Send Reminder
                </button>
                <button className="flex items-center gap-2 border-2 border-slate-300 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-medium">
                  <Edit3 size={16} />
                  Edit Details
                </button>
                <button className="flex items-center gap-2 border-2 border-red-300 text-red-700 px-4 py-2 rounded-xl hover:bg-red-50 hover:border-red-400 transition-all duration-200 font-medium">
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No vendors found</h3>
          <p className="text-slate-600 mb-6">Try adjusting your search or filter criteria</p>
          <button 
            onClick={() => setShowAddVendorModal(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
          >
            Add New Vendor
          </button>
        </div>
      )}

      {/* Modals would go here - simplified for demo */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Send Quote Invitations</h3>
            <p className="text-slate-600 mb-6">Send quote requests to selected vendors for {category.name}.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowInviteModal(false)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-xl font-semibold"
              >
                Send Invites
              </button>
              <button 
                onClick={() => setShowInviteModal(false)}
                className="px-6 py-3 border border-slate-300 rounded-xl font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddVendorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add New Vendor</h3>
            <p className="text-slate-600 mb-6">Add a new vendor to your {category.name} category.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowAddVendorModal(false)}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 text-white py-3 rounded-xl font-semibold"
              >
                Add Vendor
              </button>
              <button 
                onClick={() => setShowAddVendorModal(false)}
                className="px-6 py-3 border border-slate-300 rounded-xl font-semibold"
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

export default ManageVendorsPage;