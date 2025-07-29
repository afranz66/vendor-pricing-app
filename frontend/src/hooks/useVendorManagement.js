// frontend/src/hooks/useVendorManagement.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useVendorManagement = (categoryId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVendorData = async () => {
    if (!categoryId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `http://localhost:8000/api/categories/${categoryId}/vendor-management`
        );
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load vendor data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, [categoryId]);

  return {
    category: data?.category || null,
    vendors: data?.vendors || [],
    statistics: data?.statistics || {},
    loading,
    error,
    refetch: fetchVendorData
  };
};