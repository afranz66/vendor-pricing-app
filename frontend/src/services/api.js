// src/services/api.js
// This file handles the fundamental HTTP communication with your backend

/**
 * Base configuration for API communication
 * This centralizes your backend URL and common request settings
 */
const API_BASE_URL = 'http://localhost:8000';

/**
 * Generic function to make HTTP requests to your backend
 * This handles common concerns like error responses and JSON parsing
 * Think of this as your universal translator between frontend and backend
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    // Construct the full URL by combining base URL with specific endpoint
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Set up default request configuration
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers // Allow override of headers if needed
      },
      ...options // Merge any additional options like method, body, etc.
    };

    // Make the actual HTTP request
    const response = await fetch(url, config);
    
    // Check if the request was successful
    if (!response.ok) {
      // Create detailed error information for debugging
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    // Parse and return the JSON response
    const data = await response.json();
    return data;
    
  } catch (error) {
    // Log the error for debugging and re-throw for component handling
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Specific API functions for different types of data
 * These provide a clean interface for components to request backend data
 */

/**
 * Get all projects with calculated metrics
 * This replaces your static projects array with dynamic data from the backend
 */
export const fetchProjects = async () => {
  return await apiRequest('/api/projects');
};

/**
 * Get detailed information for a specific project
 * This supports your project dashboard view with complete category and vendor data
 */
export const fetchProjectDetails = async (projectId) => {
  return await apiRequest(`/api/projects/${projectId}`);
};

/**
 * Get all vendors from the catalog
 * This supports the owner rep vendor management functionality
 */
export const fetchVendors = async () => {
  return await apiRequest('/api/vendors');
};

/**
 * Get enriched vendor information for a specific category
 * This provides the vendor profiles with contact info and bid details
 */
export const fetchCategoryVendors = async (categoryId) => {
  return await apiRequest(`/api/categories/${categoryId}/vendors`);
};

/**
 * Health check function to verify backend connectivity
 * This is useful for debugging connection issues during development
 */
export const checkBackendHealth = async () => {
  try {
    const response = await apiRequest('/');
    return response;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return null;
  }
};