// frontend/src/hooks/useProjectCreation.js
import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const useProjectCreation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createProject = async (projectData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Creating project:', projectData);
      const response = await axios.post(`${API_BASE_URL}/api/projects`, projectData);
      
      return {
        success: true,
        data: response.data,
        project: response.data.project
      };
    } catch (err) {
      console.error('Project creation error:', err);
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to create project';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (projectId, updates) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put(`${API_BASE_URL}/api/projects/${projectId}`, updates);
      
      return {
        success: true,
        data: response.data
      };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to update project';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.delete(`${API_BASE_URL}/api/projects/${projectId}`);
      
      return {
        success: true,
        data: response.data
      };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to delete project';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const addCategoryToProject = async (projectId, categoryData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_BASE_URL}/api/projects/${projectId}/categories`, categoryData);
      
      return {
        success: true,
        data: response.data,
        category: response.data.category
      };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to add category';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const getProjectTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/api/project-templates`);
      
      return {
        success: true,
        data: response.data
      };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to get templates';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const createProjectFromTemplate = async (templateName, projectData, includeCategories = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_BASE_URL}/api/projects/from-template`, {
        templateName,
        projectData,
        includeCategories
      });
      
      return {
        success: true,
        data: response.data,
        project: response.data.project,
        categories: response.data.categories || []
      };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to create project from template';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const testCreateProject = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_BASE_URL}/api/test-create-project`);
      
      return {
        success: true,
        data: response.data,
        project: response.data.project
      };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Test project creation failed';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    loading,
    error,
    
    // Project operations
    createProject,
    updateProject,
    deleteProject,
    addCategoryToProject,
    getProjectTemplates,
    createProjectFromTemplate,
    
    // Testing
    testCreateProject
  };
};