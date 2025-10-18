/**
 * External API Service
 *
 * Handles generic API requests to external (non-Liferay) endpoints.
 * Supports authentication tokens, custom pagination parameters, and flexible response parsing.
 */

import axios from 'axios';

/**
 * Gets value from nested object using dot notation
 * Example: getNestedValue({data: {items: [1,2,3]}}, 'data.items') returns [1,2,3]
 */
const getNestedValue = (obj, path) => {
  if (!path) return obj;
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

/**
 * Creates an axios instance for external API calls
 */
const createExternalApiInstance = (token = '') => {
  const config = {
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  if (token && token.trim()) {
    const authToken = token.trim().startsWith('Bearer ')
      ? token.trim()
      : `Bearer ${token.trim()}`;
    config.headers.Authorization = authToken;
  }

  return axios.create(config);
};

/**
 * Fetches data from external API endpoint with customizable parameters
 *
 * @param {string} endpoint - Full API URL
 * @param {string} token - Optional authentication token
 * @param {Object} pagination - Pagination parameters
 * @param {Object} apiConfig - API configuration (param names, response paths, pagination config)
 * @param {Object} sortInfo - Sorting information (columnKey, order)
 * @returns {Promise<Object>} Response with data and pagination
 */
export const fetchData = async (endpoint, token = '', pagination = {}, apiConfig = {}, sortInfo = null) => {
  try {
    const api = createExternalApiInstance(token);
    const { page = 1, pageSize = 20, enablePagination = true } = pagination;

    // Get custom parameter names or use defaults
    const paramNames = apiConfig.apiParamNames || {
      page: '_page',
      pageSize: '_limit',
      sort: 'sort',
    };

    // Build query parameters
    const params = {};

    // Only add pagination parameters if pagination is enabled
    if (enablePagination) {
      params[paramNames.page] = page;
      params[paramNames.pageSize] = pageSize;
    }

    // Add sorting parameters if provided and mode is server-side
    if (sortInfo && sortInfo.columnKey && apiConfig.sortingConfig?.mode === 'server') {
      const { columnParam, orderParam, orderValues } = apiConfig.sortingConfig.serverConfig;

      params[columnParam] = sortInfo.columnKey;
      params[orderParam] = orderValues[sortInfo.order] || orderValues.ascend;
    }

    const response = await api.get(endpoint, { params });

    // Get response data path configuration
    const responsePaths = apiConfig.responseDataPath || {
      dataKey: '',
      totalKey: 'x-total-count',
      totalSource: 'header',
    };

    // Extract data using configured path
    let data = responsePaths.dataKey
      ? getNestedValue(response.data, responsePaths.dataKey)
      : response.data;

    // Ensure data is an array
    if (!Array.isArray(data)) {
      data = [data];
    }

    // Extract total count based on configuration
    let total = data.length; // Default fallback

    if (responsePaths.totalSource === 'header') {
      // Get from response headers
      const headerValue = response.headers[responsePaths.totalKey.toLowerCase()];
      total = headerValue ? parseInt(headerValue, 10) : data.length;
    } else {
      // Get from response body
      const bodyValue = getNestedValue(response.data, responsePaths.totalKey);
      total = bodyValue !== undefined ? parseInt(bodyValue, 10) : data.length;
    }

    return {
      data,
      pagination: {
        current: page,
        pageSize,
        total,
      },
      success: true,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw {
      message: error.response?.data?.message || error.message || 'Failed to fetch data',
      status: error.response?.status,
      error,
    };
  }
};

/**
 * Tests connection to API endpoint
 */
export const testConnection = async (endpoint, token = '', apiConfig = {}) => {
  try {
    const api = createExternalApiInstance(token);

    // Use configured param names for test
    const paramNames = apiConfig?.apiParamNames || {
      page: '_page',
      pageSize: '_limit',
    };

    const response = await api.get(endpoint, {
      params: {
        [paramNames.pageSize]: 1,
        [paramNames.page]: 1,
      },
    });

    // Try to extract data using configuration
    const responsePaths = apiConfig?.responseDataPath || { dataKey: '' };
    let data = responsePaths.dataKey
      ? getNestedValue(response.data, responsePaths.dataKey)
      : response.data;

    // Normalize to single item for preview
    if (Array.isArray(data)) {
      data = data[0] || data;
    }

    return {
      success: true,
      status: response.status,
      sampleData: data,
      message: 'Connection successful',
      fullResponse: response.data, // Include full response for debugging
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status || 0,
      message: error.response?.data?.message || error.message || 'Connection failed',
      error: {
        code: error.code,
        message: error.message,
      },
    };
  }
};

/**
 * Parses API response structure and identifies available fields
 * Enhanced to work with configured data paths
 */
export const parseResponseStructure = (data, dataPath = '') => {
  try {
    // Extract data from nested path if provided
    let targetData = dataPath ? getNestedValue(data, dataPath) : data;

    // Get first item if array
    const sample = Array.isArray(targetData) ? targetData[0] : targetData;

    if (!sample || typeof sample !== 'object') {
      return {
        fields: [],
        sampleData: sample,
        isValid: false,
      };
    }

    // Extract field names and types
    const fields = Object.keys(sample).map((key) => {
      const value = sample[key];
      const type = Array.isArray(value)
        ? 'array'
        : value === null
        ? 'null'
        : typeof value;

      return {
        name: key,
        type,
        sampleValue: value,
        suggestAsColumn: ['string', 'number', 'boolean'].includes(type),
      };
    });

    // Generate suggested columns with IDs
    const suggestedColumns = fields
      .filter((f) => f.suggestAsColumn)
      .map((f, index) => ({
        id: `col_${Date.now()}_${index}`,
        key: f.name,
        title: f.name.charAt(0).toUpperCase() + f.name.slice(1).replace(/_/g, ' '),
        dataIndex: f.name,
        sortable: true,
        clickable: false,
      }));

    return {
      fields,
      sampleData: sample,
      isValid: true,
      suggestedColumns,
    };
  } catch (error) {
    console.error('Error parsing response structure:', error);
    return {
      fields: [],
      sampleData: null,
      isValid: false,
      error: error.message,
    };
  }
};

/**
 * Auto-generates columns from data if no columns configured
 * Uses first row to determine column structure
 */
export const autoGenerateColumns = (data) => {
  if (!data || data.length === 0) {
    return [];
  }

  const firstRow = data[0];
  const columns = [];

  Object.keys(firstRow).forEach((key, index) => {
    const value = firstRow[key];
    const isObject = typeof value === 'object' && value !== null;
    const isArray = Array.isArray(value);

    // Only create columns for primitive values
    if (!isObject && !isArray) {
      columns.push({
        id: `col_auto_${Date.now()}_${index}`,
        key,
        title: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
        dataIndex: key,
        sortable: false,
        clickable: false,
      });
    }
  });

  return columns;
};

export default {
  fetchData,
  testConnection,
  parseResponseStructure,
  autoGenerateColumns,
  getNestedValue,
};
