// frontend/src/components/projects/CreateProject.js
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Building, Calendar, DollarSign, User, MapPin, Mail, Phone, CheckCircle, AlertCircle, Plus, Sparkles } from 'lucide-react';
import { useProjectCreation } from '../../hooks/useProjectCreation';

const CreateProject = ({ onBack, onProjectCreated }) => {
  const { createProject, getProjectTemplates, createProjectFromTemplate, loading, error } = useProjectCreation();
  
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    startDate: '',
    bidDeadline: '',
    estimatedValue: '',
    status: 'early',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    clientContactName: '',
    clientContactEmail: '',
    clientContactPhone: ''
  });

  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [includeCategories, setIncludeCategories] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Load templates on component mount
  useEffect(() => {
    const loadTemplates = async () => {
      const result = await getProjectTemplates();
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
    setSelectedTemplate(template);
    setFormData(prev => ({
      ...prev,
      description: template.description,
      estimatedValue: template.estimatedValue.toString(),
      status: template.status
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Project name is required';
    }
    
    if (!formData.client.trim()) {
      errors.client = 'Client name is required';
    }
    
    if (formData.estimatedValue && isNaN(Number(formData.estimatedValue))) {
      errors.estimatedValue = 'Estimated value must be a valid number';
    }
    
    if (formData.clientContactEmail && !/\S+@\S+\.\S+/.test(formData.clientContactEmail)) {
      errors.clientContactEmail = 'Please enter a valid email address';
    }
    
    if (formData.bidDeadline && formData.startDate && new Date(formData.bidDeadline) <= new Date(formData.startDate)) {
      errors.bidDeadline = 'Bid deadline must be after start date';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    let result;
    
    if (selectedTemplate) {
      // Create from template
      result = await createProjectFromTemplate(
        selectedTemplate.name,
        formData,
        includeCategories
      );
    } else {
      // Create regular project
      result = await createProject(formData);
    }
    
    if (result.success) {
      setShowSuccessMessage(true);
      
      // Call the callback if provided
      if (onProjectCreated) {
        onProjectCreated(result.project);
      }
      
      // Auto-redirect after success
      setTimeout(() => {
        onBack();
      }, 2000);
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    return Number(value).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-8">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-xl shadow-lg z-50">
            <div className="flex items-center gap-3">
              <CheckCircle size={24} />
              <div>
                <p className="font-semibold">Project created successfully!</p>
                <p className="text-sm">Redirecting to dashboard...</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl shadow-lg z-50">
            <div className="flex items-center gap-3">
              <AlertCircle size={24} />
              <div>
                <p className="font-semibold">Error creating project</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-8">
          <div className="flex items-center gap-6">
            <button 
              onClick={onBack}
              className="p-3 hover:bg-slate-100 rounded-2xl transition-all duration-200 hover:shadow-md"
            >
              <ArrowLeft size={24} className="text-slate-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">
                Create New Project
              </h1>
              <p className="text-lg text-slate-600 font-medium">
                Add a new construction project to your portfolio
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center">
              <Building className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Template Selection */}
        {templates.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-6 mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Start with a Template (Optional)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template.name}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                    selectedTemplate?.name === template.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <h3 className="font-semibold text-slate-800 mb-2">{template.name}</h3>
                  <p className="text-sm text-slate-600 mb-3">{template.description}</p>
                  <p className="text-lg font-bold text-blue-600">{formatCurrency(template.estimatedValue)}</p>
                  {selectedTemplate?.name === template.name && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={includeCategories}
                          onChange={(e) => setIncludeCategories(e.target.checked)}
                          className="text-blue-600 rounded focus:ring-blue-500"
                        />
                        Include template categories
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {selectedTemplate && (
              <button
                onClick={() => setSelectedTemplate(null)}
                className="mt-4 text-sm text-slate-600 hover:text-slate-800 underline"
              >
                Clear template selection
              </button>
            )}
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-8">
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.name ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder="Downtown Office Complex"
                />
                {validationErrors.name && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Client *
                </label>
                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.client ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder="Metro Development Corp"
                />
                {validationErrors.client && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.client}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Bid Deadline
                </label>
                <input
                  type="date"
                  name="bidDeadline"
                  value={formData.bidDeadline}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.bidDeadline ? 'border-red-300' : 'border-slate-300'
                  }`}
                />
                {validationErrors.bidDeadline && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.bidDeadline}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Estimated Value
                </label>
                <input
                  type="number"
                  name="estimatedValue"
                  value={formData.estimatedValue}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.estimatedValue ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder="2500000"
                />
                {validationErrors.estimatedValue && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.estimatedValue}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="early">Early Planning</option>
                  <option value="active">Active Bidding</option>
                  <option value="awarded">Awarded</option>
                  <option value="complete">Complete</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of the project..."
              />
            </div>
          </div>

          {/* Location Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Location
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123 Downtown Ave"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Metro City"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="NY"
                />
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
                  placeholder="10001"
                />
              </div>
            </div>
          </div>

          {/* Client Contact */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              Client Contact
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Contact Name
                </label>
                <input
                  type="text"
                  name="clientContactName"
                  value={formData.clientContactName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="clientContactEmail"
                  value={formData.clientContactEmail}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.clientContactEmail ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder="john@company.com"
                />
                {validationErrors.clientContactEmail && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.clientContactEmail}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="clientContactPhone"
                  value={formData.clientContactPhone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
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
                  Create Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;