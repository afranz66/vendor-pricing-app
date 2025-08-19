// src/hooks/useVendorCreation.js
import { useState } from 'react';

const API_BASE_URL = 'http://localhost:8000';

export const useVendorCreation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Transform form data to backend-expected format
   */
  const transformVendorData = (formData) => {
    return {
      companyName: formData.companyName,
      contactInfo: {
        representative: formData.representative,
        email: formData.email,
        phone: formData.phone,
        website: formData.website || ''
      },
      specialties: formData.specialties || [],
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      },
      notes: formData.notes || ''
    };
  };

  /**
   * Create a new vendor
   */
  const createVendor = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const vendorData = transformVendorData(formData);

      const response = await fetch(`${API_BASE_URL}/api/vendors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendorData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create vendor');
      }

      const result = await response.json();
      
      return {
        success: true,
        data: result.vendor || result,
        message: result.message || 'Vendor created successfully'
      };

    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get vendor templates (predefined vendor types for common specialties)
   */
  const getVendorTemplates = async () => {
    try {
      // For now, return static templates
      // In a real app, this could come from the backend
      const templates = [
        {
          name: 'Structural Steel Vendor',
          specialties: ['Structural Steel', 'Steel Erection', 'Custom Fabrication'],
          notes: 'Steel fabrication and erection specialist'
        },
        {
          name: 'Concrete Contractor',
          specialties: ['Ready Mix Concrete', 'Concrete Pumping', 'Precast Concrete'],
          notes: 'Full-service concrete contractor'
        },
        {
          name: 'Electrical Contractor',
          specialties: ['Electrical Installation', 'Electrical Design', 'Power Systems'],
          notes: 'Commercial and industrial electrical services'
        },
        {
          name: 'HVAC Contractor',
          specialties: ['HVAC Systems', 'Ventilation', 'Climate Control'],
          notes: 'Heating, ventilation, and air conditioning specialist'
        },
        {
          name: 'General Supplier',
          specialties: ['Material Supply', 'Equipment Rental', 'Tools & Hardware'],
          notes: 'General construction materials and equipment'
        }
      ];

      return {
        success: true,
        data: templates
      };

    } catch (err) {
      return {
        success: false,
        error: err.message || 'Failed to load vendor templates'
      };
    }
  };

  /**
   * Get common specialties for dropdown
   */
  const getCommonSpecialties = () => {
    return [
      'Structural Steel',
      'Ready Mix Concrete',
      'Precast Concrete',
      'Electrical Installation',
      'HVAC Systems',
      'Plumbing',
      'Roofing',
      'Windows & Glazing',
      'Flooring',
      'Painting',
      'Drywall',
      'Insulation',
      'Site Work',
      'Excavation',
      'Masonry',
      'Waterproofing',
      'Fire Protection',
      'Security Systems',
      'Material Supply',
      'Equipment Rental',
      'Steel Erection',
      'Custom Fabrication',
      'Concrete Pumping',
      'Electrical Design',
      'Power Systems',
      'Ventilation',
      'Climate Control',
      'Tools & Hardware'
    ].sort();
  };

  /**
   * Validate vendor data
   */
  const validateVendorData = (formData) => {
    const errors = {};

    // Required fields
    if (!formData.companyName?.trim()) {
      errors.companyName = 'Company name is required';
    }

    if (!formData.representative?.trim()) {
      errors.representative = 'Representative name is required';
    }

    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone?.trim()) {
      errors.phone = 'Phone number is required';
    }

    if (!formData.city?.trim()) {
      errors.city = 'City is required';
    }

    if (!formData.state?.trim()) {
      errors.state = 'State is required';
    }

    // Specialties validation
    if (!formData.specialties || formData.specialties.length === 0) {
      errors.specialties = 'At least one specialty is required';
    }

    // Website validation (if provided)
    if (formData.website && formData.website.trim()) {
      const websiteRegex = /^https?:\/\/.+/;
      if (!websiteRegex.test(formData.website)) {
        errors.website = 'Website must start with http:// or https://';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  return {
    createVendor,
    getVendorTemplates,
    getCommonSpecialties,
    validateVendorData,
    loading,
    error
  };
};