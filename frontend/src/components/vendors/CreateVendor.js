// src/components/vendors/CreateVendor.js
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Building, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Award, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  X,
  Sparkles
} from 'lucide-react';
import { useVendorCreation } from '../../hooks/useVendorCreation';

const CreateVendor = ({ onBack, onVendorCreated }) => {
  const { 
    createVendor, 
    getVendorTemplates, 
    getCommonSpecialties,
    validateVendorData,
    loading, 
    error 
  } = useVendorCreation();
  
  const [formData, setFormData] = useState({
    companyName: '',
    representative: '',
    email: '',
    phone: '',
    website: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    specialties: [],
    notes: ''
  });

  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [showSpecialtyDropdown, setShowSpecialtyDropdown] = useState(false);

  const commonSpecialties = getCommonSpecialties();

  // Load templates on component mount
  useEffect(() => {
    const loadTemplates = async () => {
      const result = await getVendorTemplates();
      if (result.success) {
        setTemplates(result.data);
      }
    };
    loadTemplates();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleTemplateSelect = (template) => {
    if (selectedTemplate?.name === template.name) {
      // Deselect template
      setSelectedTemplate(null);
      setFormData(prev => ({
        ...prev,
        specialties: [],
        notes: ''
      }));
    } else {
      // Select template
      setSelectedTemplate(template);
      setFormData(prev => ({
        ...prev,
        specialties: [...template.specialties],
        notes: template.notes
      }));
    }
  };

  const handleAddSpecialty = (specialty) => {
    if (specialty && !formData.specialties.includes(specialty)) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialty]
      }));
      setSpecialtyInput('');
      setShowSpecialtyDropdown(false);
      
      // Clear validation error
      if (validationErrors.specialties) {
        setValidationErrors(prev => ({
          ...prev,
          specialties: null
        }));
      }
    }
  };

  const handleRemoveSpecialty = (specialtyToRemove) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialtyToRemove)
    }));
  };

  const handleSpecialtyInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSpecialty(specialtyInput.trim());
    }
  };

  const filteredSpecialties = commonSpecialties.filter(specialty =>
    specialty.toLowerCase().includes(specialtyInput.toLowerCase()) &&
    !formData.specialties.includes(specialty)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateVendorData(formData);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }
    
    const result = await createVendor(formData);
    
    if (result.success) {
      setShowSuccessMessage(true);
      
      // Call the callback immediately with the new vendor data
      if (onVendorCreated) {
        onVendorCreated(result.data);
      }
      
      // Show success message for 2 seconds, then navigate
      setTimeout(() => {
        setShowSuccessMessage(false);
        onBack();
      }, 2000);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (showSuccessMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-12 text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Vendor Created Successfully!</h2>
          <p className="text-slate-600 mb-6">
            {formData.companyName} has been added to your vendor catalog.
          </p>
          <div className="animate-pulse text-sm text-slate-500">
            Redirecting to vendor catalog...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-8">
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
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-3">
                  Add New Vendor
                </h1>
                <p className="text-lg text-slate-600 font-medium">
                  Expand your vendor network with trusted construction partners
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-800">Error Creating Vendor</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Vendor Templates */}
        {templates.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-8 mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Quick Start Templates
            </h2>
            <p className="text-slate-600 mb-6">
              Select a template to pre-fill common vendor information, or start from scratch.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map(template => (
                <div
                  key={template.name}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedTemplate?.name === template.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <h3 className="font-semibold text-slate-800 mb-2">{template.name}</h3>
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {template.specialties.slice(0, 2).map(specialty => (
                        <span key={specialty} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {specialty}
                        </span>
                      ))}
                      {template.specialties.length > 2 && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                          +{template.specialties.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">{template.notes}</p>
                </div>
              ))}
            </div>
            {selectedTemplate && (
              <button
                onClick={() => handleTemplateSelect(selectedTemplate)}
                className="mt-4 text-sm text-slate-600 hover:text-slate-800 underline"
              >
                Clear template selection
              </button>
            )}
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-8">
          {/* Company Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              Company Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.companyName ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder="SteelCorp Industries"
                />
                {validationErrors.companyName && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.companyName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.website ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder="https://steelcorp.com"
                />
                {validationErrors.website && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.website}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" />
              Contact Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Representative Name *
                </label>
                <input
                  type="text"
                  name="representative"
                  value={formData.representative}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.representative ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder="Sarah Johnson"
                />
                {validationErrors.representative && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.representative}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.email ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder="sarah.johnson@steelcorp.com"
                />
                {validationErrors.email && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.phone ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder="(555) 123-4567"
                />
                {validationErrors.phone && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              Address Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1234 Industrial Blvd"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.city ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder="Pittsburgh"
                />
                {validationErrors.city && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.city}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.state ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder="PA"
                />
                {validationErrors.state && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.state}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="15201"
                />
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              Specialties *
            </h2>
            
            {/* Current Specialties */}
            {formData.specialties.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {formData.specialties.map(specialty => (
                    <span key={specialty} className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium">
                      {specialty}
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecialty(specialty)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X size={16} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Add Specialty */}
            <div className="relative">
              <input
                type="text"
                value={specialtyInput}
                onChange={(e) => {
                  setSpecialtyInput(e.target.value);
                  setShowSpecialtyDropdown(true);
                }}
                onKeyPress={handleSpecialtyInputKeyPress}
                onFocus={() => setShowSpecialtyDropdown(true)}
                className={`w-full px-4 py-3 border rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.specialties ? 'border-red-300' : 'border-slate-300'
                }`}
                placeholder="Type to search specialties or add custom..."
              />
              
              {/* Specialty Dropdown */}
              {showSpecialtyDropdown && specialtyInput && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {filteredSpecialties.length > 0 ? (
                    filteredSpecialties.slice(0, 10).map(specialty => (
                      <button
                        key={specialty}
                        type="button"
                        onClick={() => handleAddSpecialty(specialty)}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700"
                      >
                        {specialty}
                      </button>
                    ))
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAddSpecialty(specialtyInput.trim())}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700"
                    >
                      Add "{specialtyInput.trim()}"
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {validationErrors.specialties && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.specialties}</p>
            )}
            
            <p className="text-sm text-slate-600 mt-2">
              Type to search common specialties or enter custom ones. Press Enter to add.
            </p>
          </div>

          {/* Notes */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Additional Notes
            </h2>
            
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any additional information about this vendor, such as delivery capabilities, special certifications, past performance, etc."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onBack}
              className="px-8 py-3 border-2 border-slate-300 text-slate-700 rounded-2xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-3 rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Add Vendor
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVendor;