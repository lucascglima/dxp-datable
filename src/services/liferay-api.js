/**
 * Liferay API Service
 *
 * Configures axios instance with Liferay authentication and provides
 * generic functions for API requests.
 */

import axios from 'axios';
import { getAuthToken, getApiBaseURL } from '../config/liferay-config';

/**
 * Creates an axios instance configured for Liferay API calls
 */
const createApiInstance = () => {
  const instance = axios.create({
    baseURL: getApiBaseURL(),
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // Request interceptor - Add authentication token
  instance.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle errors globally
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;

        switch (status) {
          case 401:
            console.error('Unauthorized: Invalid or expired token');
            break;
          case 403:
            console.error('Forbidden: Insufficient permissions');
            break;
          case 404:
            console.error('Not found:', error.config.url);
            break;
          case 500:
            console.error('Server error:', data);
            break;
          default:
            console.error('API error:', status, data);
        }
      } else if (error.request) {
        // Request made but no response received
        console.error('No response from server:', error.request);
      } else {
        // Error in request configuration
        console.error('Request configuration error:', error.message);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Create the default API instance
const apiClient = createApiInstance();

/**
 * Generic function for GET requests with table parameters
 *
 * @param {string} endpoint - API endpoint (e.g., '/o/headless-delivery/v1.0/users')
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (1-based)
 * @param {number} params.pageSize - Number of items per page
 * @param {string} params.sort - Sort field and direction (e.g., 'name:asc', 'dateCreated:desc')
 * @param {Object} params.filters - Additional filter parameters
 * @returns {Promise<Object>} Response with data and pagination info
 */
export const getTableData = async (endpoint, params = {}) => {
  try {
    const { page = 1, pageSize = 10, sort = '', filters = {} } = params;

    // Build query parameters
    const queryParams = {
      page,
      pageSize,
      ...filters,
    };

    // Add sort if provided
    if (sort) {
      queryParams.sort = sort;
    }

    const response = await apiClient.get(endpoint, {
      params: queryParams,
    });

    // Extract data and pagination from response
    // Liferay headless APIs typically return data in this format
    const {
      items = [],
      totalCount = 0,
      page: currentPage = 1,
      pageSize: size = 10,
    } = response.data;

    return {
      data: items,
      pagination: {
        current: currentPage,
        pageSize: size,
        total: totalCount,
      },
    };
  } catch (error) {
    console.error('Error fetching table data:', error);
    throw error;
  }
};

/**
 * Generic POST request
 *
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise<Object>} Response data
 */
export const postData = async (endpoint, data) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

/**
 * Generic PUT request
 *
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise<Object>} Response data
 */
export const putData = async (endpoint, data) => {
  try {
    const response = await apiClient.put(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
};

/**
 * Generic DELETE request
 *
 * @param {string} endpoint - API endpoint
 * @returns {Promise<void>}
 */
export const deleteData = async (endpoint) => {
  try {
    await apiClient.delete(endpoint);
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
};

/**
 * Gets a single item by ID
 *
 * @param {string} endpoint - API endpoint
 * @param {string|number} id - Item ID
 * @returns {Promise<Object>} Item data
 */
export const getById = async (endpoint, id) => {
  try {
    const response = await apiClient.get(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching item:', error);
    throw error;
  }
};

export default {
  getTableData,
  postData,
  putData,
  deleteData,
  getById,
  apiClient,
};
