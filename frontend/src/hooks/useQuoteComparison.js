// frontend/src/hooks/useQuoteComparison.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useQuoteComparison = (categoryId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuoteData = async () => {
    if (!categoryId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `http://localhost:8000/api/categories/${categoryId}/quotes`
        );
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load quote data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuoteData();
  }, [categoryId]);

  return {
    category: data?.category || null,
    vendors: data?.vendors || [],
    analytics: data?.analytics || {},
    loading,
    error,
    refetch: fetchQuoteData
  };
};