// frontend/src/hooks/useGroups.js
// Custom hook for fetching groups data from the API

import { useState, useEffect } from 'react';

export const useGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8000/api/groups');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch groups: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setGroups(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching groups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const refetchGroups = () => {
    fetchGroups();
  };

  return {
    groups,
    loading,
    error,
    refetchGroups
  };
};