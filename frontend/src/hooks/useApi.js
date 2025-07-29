// src/hooks/useApi.js
// Corrected API hooks that prevent infinite loops through stable function references

import { useState, useEffect, useCallback } from 'react';
// Import API functions at the top level to ensure they're stable across renders
// This prevents the infinite loop issue by providing consistent function references
import { fetchProjects, fetchProjectDetails, fetchVendors, fetchCategoryVendors } from '../services/api';

/**
 * Generic hook for managing API requests with stable dependencies
 * This version uses useCallback properly to prevent infinite loops while maintaining
 * the clean separation between data fetching logic and component rendering
 */
export const useApiData = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create a stable fetch function that only changes when apiFunction actually changes
  // The key insight here is that apiFunction should be stable across renders
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction();
      setData(result);
      
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
      console.error('API call failed:', err);
    } finally {
      setLoading(false);
    }
  }, [apiFunction]); // This only changes when apiFunction changes

  // Effect runs when fetchData changes OR when explicit dependencies change
  // Since fetchData is now stable (when apiFunction is stable), this prevents infinite loops
  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook for fetching all projects - now with stable function reference
 * Since fetchProjects is imported at the top level, it's the same function object
 * on every render, which prevents the infinite loop issue
 */
export const useProjects = () => {
  // Pass the stable fetchProjects function directly
  const { data, loading, error, refetch } = useApiData(fetchProjects, []);

  return {
    projects: data || [],
    loading,
    error,
    refetchProjects: refetch
  };
};

/**
 * Enhanced hook for project details with proper dependency management
 * This version creates a stable function using useCallback to prevent infinite loops
 * while still allowing the function to depend on the projectId parameter
 */
export const useProjectDetails = (projectId) => {
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create a stable function that depends only on projectId
  // useCallback ensures this function only changes when projectId actually changes
  const fetchProjectDetailsWithId = useCallback(async () => {
    if (!projectId) {
      setProjectData(null);
      setLoading(false);
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Call the stable imported function with the projectId parameter
      const enrichedProject = await fetchProjectDetails(projectId);
      setProjectData(enrichedProject);
      return enrichedProject;
      
    } catch (err) {
      setError(err.message || 'Unable to load project details');
      console.error('Failed to fetch project details:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [projectId]); // Only recreate when projectId changes

  // Use the stable function with useApiData pattern, but manage state locally
  // for more complex project-specific processing
  useEffect(() => {
    fetchProjectDetailsWithId();
  }, [fetchProjectDetailsWithId]);

  // Helper function for category analysis - stable because it only depends on projectData
  const getCategoryAnalysis = useCallback(() => {
    if (!projectData || !projectData.categories) {
      return [];
    }

    return projectData.categories.map(category => {
      const vendorCount = category.vendors ? category.vendors.length : 0;
      const quotedVendors = category.vendors 
        ? category.vendors.filter(vendor => vendor.bidInfo && vendor.bidInfo.bidStatus === 'submitted').length 
        : 0;
      
      const bidAmounts = category.vendors 
        ? category.vendors
            .filter(vendor => vendor.bidInfo && vendor.bidInfo.bidAmount)
            .map(vendor => vendor.bidInfo.bidAmount)
        : [];
      
      const lowestBid = bidAmounts.length > 0 ? Math.min(...bidAmounts) : null;
      const highestBid = bidAmounts.length > 0 ? Math.max(...bidAmounts) : null;
      const averageBid = bidAmounts.length > 0 
        ? bidAmounts.reduce((sum, bid) => sum + bid, 0) / bidAmounts.length 
        : null;

      return {
        ...category,
        analysis: {
          vendorCount,
          quotedVendors,
          completionPercentage: category.totalItems > 0 
            ? Math.round((category.quotedItems / category.totalItems) * 100) 
            : 0,
          bidding: {
            lowestBid,
            highestBid,
            averageBid,
            potentialSavings: (highestBid && lowestBid) ? highestBid - lowestBid : 0,
            competitivenessScore: bidAmounts.length > 1 ? 'High' : bidAmounts.length === 1 ? 'Low' : 'None'
          }
        }
      };
    });
  }, [projectData]); // Only recalculate when projectData changes

  return {
    project: projectData,
    categories: getCategoryAnalysis(),
    loading,
    error,
    refetch: fetchProjectDetailsWithId,
    hasCategories: projectData && projectData.categories && projectData.categories.length > 0,
    hasVendors: projectData && projectData.categories && 
                projectData.categories.some(cat => cat.vendors && cat.vendors.length > 0)
  };
};

/**
 * Hook for vendor catalog with stable function reference
 */
export const useVendors = () => {
  const { data, loading, error, refetch } = useApiData(fetchVendors, []);

  return {
    vendors: data || [],
    loading,
    error,
    refetchVendors: refetch
  };
};

/**
 * Hook for category-specific vendors with proper parameter handling
 * This demonstrates how to create stable functions that depend on parameters
 * without causing infinite loops
 */
export const useCategoryVendors = (categoryId) => {
  // Create a stable function that wraps the API call with the categoryId
  const fetchCategoryVendorsWithId = useCallback(async () => {
    if (!categoryId) return [];
    return fetchCategoryVendors(categoryId);
  }, [categoryId]); // Only recreate when categoryId changes

  const { data, loading, error, refetch } = useApiData(fetchCategoryVendorsWithId, []);

  return {
    vendors: data || [],
    loading,
    error,
    refetchCategoryVendors: refetch
  };
};