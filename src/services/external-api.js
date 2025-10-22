/**
 * External API Service
 *
 * Handles generic API requests to external (non-Liferay) endpoints.
 * Supports authentication tokens, custom pagination parameters, URL path variables,
 * default query params, and flexible response parsing.
 */

import axios from 'axios';
import { replaceUrlParams } from '../utils/url-params-replacer';
import { toObject } from '../utils/query-string-parser';

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
 * @param {string} endpoint - Full API URL (may contain path variables like :version)
 * @param {string} token - Optional authentication token
 * @param {Object} pagination - Pagination parameters
 * @param {Object} apiConfig - API configuration (param names, response paths, pagination config, urlParams, defaultQueryParams, dynamicParams)
 * @param {Object} sortInfo - Sorting information (columnKey, order)
 * @returns {Promise<Object>} Response with data and pagination
 */
export const fetchData = async (endpoint, token = '', pagination = {}, apiConfig = {}, sortInfo = null) => {
  try {
    const api = createExternalApiInstance(token);
    const { page = 1, pageSize = 20, enablePagination = true } = pagination;

    // Replace URL path variables with their values
    let finalEndpoint = endpoint;
    if (apiConfig.urlParams && apiConfig.urlParams.length > 0) {
      const urlResult = replaceUrlParams(endpoint, apiConfig.urlParams);
      if (urlResult.errors.length > 0) {
        throw new Error(`URL parameter error: ${urlResult.errors.join(', ')}`);
      }
      finalEndpoint = urlResult.url;
    }

    // Get custom parameter names or use defaults
    const paramNames = apiConfig.apiParamNames || {
      page: '_page',
      pageSize: '_limit',
      sort: 'sort',
    };

    // Start with default query params (enabled ones only)
    const params = {};
    if (apiConfig.defaultQueryParams && Array.isArray(apiConfig.defaultQueryParams)) {
      const defaultParams = toObject(
        apiConfig.defaultQueryParams.filter(p => p.enabled !== false)
      );
      Object.assign(params, defaultParams);
    }

    // Add pagination parameters if enabled (these override default params if there's a conflict)
    if (enablePagination) {
      params[paramNames.page] = page;
      params[paramNames.pageSize] = pageSize;
    }

    // Add sorting parameters if provided and mode is server-side
    if (sortInfo && sortInfo.columnKey && apiConfig.sortingConfig?.mode === 'server') {
      const { columnParam, orderParam, orderValues } = apiConfig.sortingConfig.serverConfig;

      // Use sortField if available, otherwise fallback to columnKey
      const sortFieldToUse = sortInfo.sortField || sortInfo.columnKey;
      params[columnParam] = sortFieldToUse;
      params[orderParam] = orderValues[sortInfo.order] || orderValues.ascend;
    }

    // Add dynamic parameters (search input, date range, etc.)
    if (apiConfig.dynamicParams) {
      // Add search input parameter if enabled and has value
      if (apiConfig.dynamicParams.searchInput?.enabled && apiConfig.dynamicParams.searchInput?.currentValue) {
        const { queryParamName, currentValue } = apiConfig.dynamicParams.searchInput;
        if (queryParamName && currentValue.trim()) {
          params[queryParamName] = currentValue.trim();
        }
      }

      // Future: Add other dynamic parameters here (date range, tabs, etc.)
      // if (apiConfig.dynamicParams.dateRange?.enabled) { ... }
    }

    const response = await api.get(finalEndpoint, { params });

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
 * @param {string} endpoint - API endpoint URL (may contain path variables)
 * @param {string} token - Optional auth token
 * @param {Object} apiConfig - API configuration including response mapping, urlParams
 * @param {Object} testParams - Custom query parameters for testing (optional)
 */
export const testConnection = async (endpoint, token = '', apiConfig = {}, testParams = {}) => {
  try {
    const api = createExternalApiInstance(token);

    // Replace URL path variables with their values
    let finalEndpoint = endpoint;
    if (apiConfig.urlParams && apiConfig.urlParams.length > 0) {
      const urlResult = replaceUrlParams(endpoint, apiConfig.urlParams);
      if (urlResult.errors.length > 0) {
        return {
          success: false,
          status: 0,
          message: `Erro no parâmetro URL: ${urlResult.errors.join(', ')}`,
          error: {
            code: 'URL_PARAM_ERROR',
            message: urlResult.errors.join(', '),
          },
        };
      }
      finalEndpoint = urlResult.url;
    }

    // Use custom test parameters provided by user
    // testParams should already include merged default params from preview-section
    const params = { ...testParams };

    const response = await api.get(finalEndpoint, { params });

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
      message: 'A requisição foi concluída corretamente. Confira abaixo a sugestão de configuração das colunas.',
      fullResponse: response.data, // Include full response for debugging
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status || 0,
      message: error.response?.data?.message || error.message || 'Conexão falhou',
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
      .map((f, index) => {
        const column = {
          id: `col_${Date.now()}_${index}`,
          key: f.name,
          title: f.name.charAt(0).toUpperCase() + f.name.slice(1).replace(/_/g, ' '),
          dataIndex: f.name,
          sortable: false,
          clickable: false,
        };

        // Apply boolean render config automatically for boolean fields
        if (f.type === 'boolean') {
          column.render = {
            type: 'boolean',
            config: {
              trueText: 'Sim',
              falseText: 'Não',
              showAsTag: false,
              trueColor: 'green',
              falseColor: 'red',
            },
          };
        }

        return column;
      });

    return {
      fields,
      sampleData: sample,
      isValid: true,
      suggestedColumns,
    };
  } catch (error) {
    console.error('Erro ao analisar estrutura da resposta:', error);
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
