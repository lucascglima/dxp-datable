/**
 * useTableData Hook
 *
 * Custom hook that manages table state and data fetching.
 * Automatically fetches data when pagination or sorting changes.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getTableData } from '../services/liferay-api';

/**
 * Debounce utility function
 *
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Custom hook for managing table data with Liferay API integration
 *
 * @param {string} endpoint - API endpoint to fetch data from
 * @param {Object} options - Configuration options
 * @param {number} options.initialPageSize - Initial page size (default: 10)
 * @param {number} options.debounceDelay - Debounce delay in ms (default: 300)
 * @param {Object} options.initialFilters - Initial filter values
 * @param {boolean} options.autoFetch - Auto-fetch data on mount (default: true)
 * @returns {Object} Table state and handlers
 */
export const useTableData = (endpoint, options = {}) => {
  const {
    initialPageSize = 10,
    debounceDelay = 300,
    initialFilters = {},
    autoFetch = true,
  } = options;

  // State management
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: initialPageSize,
    total: 0,
  });
  const [sorting, setSorting] = useState({
    columnKey: null,
    order: null,
  });
  const [filters, setFilters] = useState(initialFilters);

  // Ref to track if component is mounted
  const isMounted = useRef(true);

  /**
   * Fetches data from the API
   */
  const fetchData = useCallback(async () => {
    if (!endpoint) {
      console.warn('No endpoint provided to useTableData');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Build sort string for API (e.g., 'name:asc', 'dateCreated:desc')
      let sortParam = '';
      if (sorting.columnKey && sorting.order) {
        const direction = sorting.order === 'ascend' ? 'asc' : 'desc';
        sortParam = `${sorting.columnKey}:${direction}`;
      }

      // Fetch data with current pagination, sorting, and filters
      const response = await getTableData(endpoint, {
        page: pagination.current,
        pageSize: pagination.pageSize,
        sort: sortParam,
        filters,
      });

      if (isMounted.current) {
        setData(response.data);
        setPagination((prev) => ({
          ...prev,
          total: response.pagination.total,
        }));
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err);
        console.error('Error fetching table data:', err);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [endpoint, pagination.current, pagination.pageSize, sorting, filters]);

  // Debounced version of fetchData
  const debouncedFetchData = useCallback(debounce(fetchData, debounceDelay), [
    fetchData,
    debounceDelay,
  ]);

  /**
   * Handles pagination changes
   */
  const handlePaginationChange = useCallback((newPagination) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  }, []);

  /**
   * Handles sorting changes
   */
  const handleSort = useCallback((sortInfo) => {
    setSorting({
      columnKey: sortInfo.columnKey,
      order: sortInfo.order,
    });
    // Reset to first page when sorting changes
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
  }, []);

  /**
   * Handles filter changes
   */
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    // Reset to first page when filters change
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
  }, []);

  /**
   * Manually triggers a data refetch
   */
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Resets table state to initial values
   */
  const reset = useCallback(() => {
    setPagination({
      current: 1,
      pageSize: initialPageSize,
      total: 0,
    });
    setSorting({
      columnKey: null,
      order: null,
    });
    setFilters(initialFilters);
    setError(null);
  }, [initialPageSize, initialFilters]);

  // Effect to fetch data when dependencies change
  useEffect(() => {
    if (autoFetch) {
      debouncedFetchData();
    }
  }, [autoFetch, debouncedFetchData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
    pagination,
    sorting,
    filters,
    handlePaginationChange,
    handleSort,
    handleFilterChange,
    refetch,
    reset,
  };
};

export default useTableData;
