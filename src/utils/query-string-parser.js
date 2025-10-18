/**
 * Query String Parser Utility
 *
 * Provides functions to parse, convert, and validate query parameters
 * Supports bidirectional conversion between:
 * - Array format: [{ key, value }]
 * - Query string format: key1=value1&key2=value2
 * - JSON format: [{"key": "key1", "value": "value1"}]
 */

/**
 * Parse query string to parameters array
 * Handles special characters and URL encoding
 *
 * @param {string} queryString - Query string to parse
 * @returns {Array} Array of { key, value } objects
 */
export const parseQueryString = (queryString) => {
  try {
    // Remove leading '?' if present
    const cleanStr = queryString.trim().replace(/^\?/, '');

    if (!cleanStr) return [];

    const params = [];
    const pairs = cleanStr.split('&');

    pairs.forEach((pair) => {
      const [key, ...valueParts] = pair.split('=');
      const value = valueParts.join('='); // Handle '=' in value

      if (key) {
        params.push({
          key: decodeURIComponent(key.trim()),
          value: value ? decodeURIComponent(value.trim()) : '',
        });
      }
    });

    return params;
  } catch (error) {
    throw new Error(`Failed to parse query string: ${error.message}`);
  }
};

/**
 * Parse JSON array to parameters
 *
 * @param {string} jsonString - JSON string to parse
 * @returns {Array} Array of { key, value } objects
 */
export const parseJSON = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString);

    if (!Array.isArray(parsed)) {
      throw new Error('JSON must be an array');
    }

    return parsed.map((item, index) => {
      if (!item.key && !item.hasOwnProperty('key')) {
        throw new Error(`Item at index ${index} missing 'key' property`);
      }
      return {
        key: String(item.key || '').trim(),
        value: item.value !== undefined ? String(item.value).trim() : '',
      };
    });
  } catch (error) {
    if (error.message.includes('JSON')) {
      throw error;
    }
    throw new Error(`Invalid JSON: ${error.message}`);
  }
};

/**
 * Convert parameters array to query string
 * URL encodes values automatically
 *
 * @param {Array} params - Array of { key, value } objects
 * @returns {string} Query string
 */
export const toQueryString = (params) => {
  if (!params || !Array.isArray(params)) {
    return '';
  }

  return params
    .filter((p) => p.key && p.key.trim())
    .map((p) => {
      const key = encodeURIComponent(p.key.trim());
      const value = p.value !== undefined && p.value !== null
        ? encodeURIComponent(String(p.value).trim())
        : '';
      return value ? `${key}=${value}` : key;
    })
    .join('&');
};

/**
 * Convert parameters array to JSON string
 *
 * @param {Array} params - Array of { key, value } objects
 * @param {boolean} pretty - Whether to pretty-print JSON
 * @returns {string} JSON string
 */
export const toJSON = (params, pretty = true) => {
  if (!params || !Array.isArray(params)) {
    return '[]';
  }

  const filtered = params.filter((p) => p.key && p.key.trim());
  return JSON.stringify(filtered, null, pretty ? 2 : 0);
};

/**
 * Auto-detect input format
 *
 * @param {string} input - Input string
 * @returns {string} 'json' | 'queryString' | 'unknown'
 */
export const detectFormat = (input) => {
  const trimmed = input.trim();

  if (!trimmed) return 'unknown';

  // Try JSON first
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch {
      // Not valid JSON
    }
  }

  // Check for query string patterns
  // Pattern: key=value or key1=value1&key2=value2
  if (
    /^[^=&]+=/.test(trimmed) || // Has at least one key=value
    trimmed.includes('&') ||      // Has & separator
    /^[^=&]+$/.test(trimmed)      // Single key without value
  ) {
    return 'queryString';
  }

  return 'unknown';
};

/**
 * Validate parameters array
 *
 * @param {Array} params - Array of { key, value } objects
 * @returns {Object} { valid, errors }
 */
export const validateParams = (params) => {
  const errors = [];

  if (!params || !Array.isArray(params)) {
    return {
      valid: false,
      errors: ['Parameters must be an array'],
    };
  }

  params.forEach((param, index) => {
    if (!param.key || typeof param.key !== 'string') {
      errors.push(`Parameter ${index + 1}: key is required and must be a string`);
    }

    if (param.key && param.key.trim() === '') {
      errors.push(`Parameter ${index + 1}: key cannot be empty`);
    }

    if (param.value !== undefined && typeof param.value !== 'string') {
      errors.push(
        `Parameter ${index + 1}: value must be a string (got ${typeof param.value})`
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * URL encode a parameter value
 *
 * @param {string} value - Value to encode
 * @returns {string} Encoded value
 */
export const encodeParam = (value) => {
  if (value === undefined || value === null) return '';
  return encodeURIComponent(String(value));
};

/**
 * URL decode a parameter value
 *
 * @param {string} value - Value to decode
 * @returns {string} Decoded value
 */
export const decodeParam = (value) => {
  if (value === undefined || value === null) return '';
  try {
    return decodeURIComponent(String(value));
  } catch {
    // If decoding fails, return original value
    return String(value);
  }
};

/**
 * Parse any format (auto-detect and parse)
 *
 * @param {string} input - Input string
 * @returns {Object} { params, format, errors }
 */
export const parseAny = (input) => {
  const format = detectFormat(input);

  try {
    let params = [];

    if (format === 'json') {
      params = parseJSON(input);
    } else if (format === 'queryString') {
      params = parseQueryString(input);
    } else {
      return {
        params: [],
        format: 'unknown',
        errors: ['Could not detect input format. Use query string (key=value&...) or JSON array format.'],
      };
    }

    const validation = validateParams(params);

    return {
      params,
      format,
      errors: validation.errors,
    };
  } catch (error) {
    return {
      params: [],
      format,
      errors: [error.message],
    };
  }
};

/**
 * Convert parameters to object for API calls
 *
 * @param {Array} params - Array of { key, value } objects
 * @returns {Object} Object with key-value pairs
 */
export const toObject = (params) => {
  if (!params || !Array.isArray(params)) {
    return {};
  }

  const obj = {};
  params.forEach((param) => {
    if (param.key && param.key.trim()) {
      obj[param.key.trim()] = param.value || '';
    }
  });

  return obj;
};

/**
 * Finds duplicate keys across multiple parameter arrays
 *
 * @param {...Array} paramArrays - Multiple arrays of { key, value } objects
 * @returns {Object} { hasDuplicates: boolean, duplicates: Array, details: Object }
 */
export const findDuplicateKeys = (...paramArrays) => {
  const keyCount = new Map();
  const keyLocations = new Map();

  // Count occurrences of each key across all arrays
  paramArrays.forEach((params, arrayIndex) => {
    if (!params || !Array.isArray(params)) return;

    params.forEach((param) => {
      // Skip params with empty keys or disabled params
      if (!param.key || param.key.trim() === '') return;

      // For default query params, skip if enabled=false
      if (param.hasOwnProperty('enabled') && !param.enabled) return;

      const key = param.key.trim();

      // Count occurrences
      keyCount.set(key, (keyCount.get(key) || 0) + 1);

      // Track locations
      if (!keyLocations.has(key)) {
        keyLocations.set(key, []);
      }
      keyLocations.get(key).push({
        arrayIndex,
        value: param.value,
      });
    });
  });

  // Find duplicates
  const duplicates = [];
  const details = {};

  keyCount.forEach((count, key) => {
    if (count > 1) {
      duplicates.push(key);
      details[key] = {
        count,
        locations: keyLocations.get(key),
      };
    }
  });

  return {
    hasDuplicates: duplicates.length > 0,
    duplicates,
    details,
  };
};

/**
 * Validates multiple parameter arrays for conflicts
 *
 * @param {Object} options - { testParams, defaultParams, paginationParams, labels }
 * @returns {Object} { valid: boolean, errors: Array, warnings: Array }
 */
export const validateParamConflicts = (options = {}) => {
  const {
    testParams = [],
    defaultParams = [],
    paginationParams = [],
    labels = {
      testParams: 'Test Query Params',
      defaultParams: 'Default Query Params',
      paginationParams: 'Pagination Params',
    },
  } = options;

  const errors = [];
  const warnings = [];

  // Find duplicates across all param arrays
  const result = findDuplicateKeys(testParams, defaultParams, paginationParams);

  if (result.hasDuplicates) {
    result.duplicates.forEach((key) => {
      const detail = result.details[key];
      const locations = detail.locations.map((loc) => {
        const labelMap = [labels.testParams, labels.defaultParams, labels.paginationParams];
        return `${labelMap[loc.arrayIndex]} (value: "${loc.value}")`;
      });

      errors.push(
        `Duplicate parameter "${key}" found in: ${locations.join(', ')}`
      );
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    duplicates: result.duplicates,
  };
};

/**
 * Merges multiple parameter arrays, giving priority to earlier arrays
 *
 * @param {...Array} paramArrays - Multiple arrays of { key, value } objects
 * @returns {Array} Merged array with unique keys (first occurrence wins)
 */
export const mergeParams = (...paramArrays) => {
  const merged = new Map();

  // Process arrays in order (first has priority)
  paramArrays.forEach((params) => {
    if (!params || !Array.isArray(params)) return;

    params.forEach((param) => {
      if (!param.key || param.key.trim() === '') return;

      // For default query params, skip if enabled=false
      if (param.hasOwnProperty('enabled') && !param.enabled) return;

      const key = param.key.trim();

      // Only add if not already present (first occurrence wins)
      if (!merged.has(key)) {
        merged.set(key, param.value || '');
      }
    });
  });

  // Convert Map to array format
  return Array.from(merged.entries()).map(([key, value]) => ({
    key,
    value,
  }));
};

export default {
  parseQueryString,
  parseJSON,
  toQueryString,
  toJSON,
  detectFormat,
  validateParams,
  encodeParam,
  decodeParam,
  parseAny,
  toObject,
  findDuplicateKeys,
  validateParamConflicts,
  mergeParams,
};
