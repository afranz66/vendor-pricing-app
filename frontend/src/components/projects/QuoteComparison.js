// frontend/src/components/projects/QuoteComparison.js
import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, Award, Clock, DollarSign, FileText, Phone, Mail, MapPin, CheckCircle, AlertCircle, Calendar, Info } from 'lucide-react';
import { useQuoteComparison } from '../../hooks/useQuoteComparison';

const QuoteComparison = ({ categoryId, onBack }) => {
  const { category, vendors, analytics, loading, error, refetch } = useQuoteComparison(categoryId);
  const [sortBy, setSortBy] = useState('bidAmount');
  const [sortOrder, setSortOrder] = useState('asc');

  const sortVendors = (vendors) => {
    return [...vendors].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'bidAmount' || sortBy === 'savings') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

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
      submitted: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Submitted' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      rejected: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Rejected' }
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

  const getBestQuoteBadge = (vendor, allVendors) => {
    const lowestBid = Math.min(...allVendors.map(v => v.bidAmount));
    return vendor.bidAmount === lowestBid;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading quote comparison data...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Unable to Load Quote Data</h2>
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

  const sortedVendors = sortVendors(vendors);

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
                {category.name} - Quote Comparison
              </h1>
              <p className="text-lg text-slate-600 font-medium">
                Compare {vendors.length} vendor quotes • Deadline: {formatDate(category.deadlineDate)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600 font-medium">Estimated Value</p>
              <p className="text-2xl font-bold text-slate-800">{formatCurrency(category.estimatedValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Info Panel */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">Description</p>
              <p className="text-slate-800 font-semibold">{category.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">Progress</p>
              <p className="text-slate-800 font-semibold">{category.quotedItems}/{category.totalItems} items quoted</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
              <Info className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">Specifications</p>
              <p className="text-slate-800 font-semibold">{category.specifications || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-4 mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-700">Sort by:</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="bidAmount">Price</option>
            <option value="bidDate">Date Submitted</option>
            <option value="deliveryTime">Delivery Time</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-slate-700 font-medium transition-colors"
          >
            {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
          </button>
        </div>
      </div>

      {/* Quote Comparison Cards */}
      <div className="space-y-6">
        {sortedVendors.map((vendor, index) => {
          const isBestQuote = getBestQuoteBadge(vendor, vendors);
          
          return (
            <div key={vendor.id} className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border transition-all duration-300 hover:shadow-2xl ${isBestQuote ? 'border-green-300 ring-2 ring-green-100' : 'border-white/30'}`}>
              {/* Header */}
              <div className={`p-6 rounded-t-3xl ${isBestQuote ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 'bg-gradient-to-r from-slate-50 to-blue-50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isBestQuote ? 'bg-green-100' : 'bg-slate-100'}`}>
                      <span className="text-2xl font-bold text-slate-700">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-slate-800">{vendor.name}</h3>
                        {isBestQuote && (
                          <div className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                            <Award size={16} />
                            Best Quote
                          </div>
                        )}
                        {getStatusBadge(vendor.bidStatus)}
                      </div>
                      <p className="text-slate-600 font-medium">Submitted {formatDate(vendor.bidDate)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-slate-800">{formatCurrency(vendor.bidAmount)}</p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Delivery</p>
                      <p className="font-semibold text-slate-800">{vendor.deliveryTime || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Warranty</p>
                      <p className="font-semibold text-slate-800">{vendor.warranty || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Certifications</p>
                      <p className="font-semibold text-slate-800">{vendor.certifications?.join(', ') || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Bid Date</p>
                      <p className="font-semibold text-slate-800">{formatDate(vendor.bidDate)}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                  <h4 className="font-semibold text-slate-800 mb-3">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <a href={`mailto:${vendor.email}`} className="text-blue-600 hover:text-blue-800 font-medium">{vendor.email}</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-500" />
                      <a href={`tel:${vendor.phone}`} className="text-blue-600 hover:text-blue-800 font-medium">{vendor.phone}</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-700">{vendor.address}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {vendor.notes && (
                  <div className="bg-blue-50 rounded-2xl p-4 mb-4">
                    <h4 className="font-semibold text-slate-800 mb-2">Additional Notes</h4>
                    <p className="text-slate-700">{vendor.notes}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-6 bg-slate-50 rounded-b-3xl">
                <div className="flex gap-3">
                  <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl">
                    Select This Quote
                  </button>
                  <button className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-2xl hover:bg-slate-100 hover:border-slate-400 transition-all duration-200 font-semibold">
                    Contact Vendor
                  </button>
                  <button className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-2xl hover:bg-slate-100 hover:border-slate-400 transition-all duration-200 font-semibold">
                    Request Revision
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Quote Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(analytics.bestQuote)}</p>
              <p className="text-sm text-slate-600 font-medium">Best Quote</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{formatCurrency(analytics.averageQuote)}</p>
              <p className="text-sm text-slate-600 font-medium">Average Quote</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{analytics.submittedQuotes}</p>
              <p className="text-sm text-slate-600 font-medium">Submitted Quotes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{analytics.totalVendors}</p>
              <p className="text-sm text-slate-600 font-medium">Total Vendors</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteComparison;