/**
 * URL Params Replacer Utility
 *
 * Provides functions to replace path variables in URLs
 * Example: https://api.example.com/:version/users/:userId
 *          → https://api.example.com/2.3/users/47
 */

/**
 * Replaces URL path variables with their values
 *
 * @param {string} url - URL with path variables (e.g., "https://api.com/:version/users")
 * @param {Array} urlParams - Array of { key, value } objects
 * @returns {Object} { url: string, missing: string[], unused: string[] }
 */
export const replaceUrlParams = (url, urlParams = []) => {
  if (!url || typeof url !== 'string') {
    return {
      url: url || '',
      missing: [],
      unused: [],
      errors: ['Invalid URL'],
    };
  }

  if (!urlParams || !Array.isArray(urlParams)) {
    urlParams = [];
  }

  let replacedUrl = url;
  const missing = [];
  const usedParams = new Set();

  // Find all :variable patterns in the URL
  const variablePattern = /:([a-zA-Z_][a-zA-Z0-9_]*)/g;
  const matches = [...url.matchAll(variablePattern)];

  // Replace each variable
  matches.forEach(match => {
    const variableName = match[1]; // Get the variable name without ':'
    const fullMatch = match[0]; // Get the full match including ':'

    // Find the parameter value
    const param = urlParams.find(p => p.key === variableName);

    if (param && param.value !== undefined && param.value !== null && param.value !== '') {
      // Replace the variable with its value
      replacedUrl = replacedUrl.replace(fullMatch, encodeURIComponent(param.value));
      usedParams.add(variableName);
    } else {
      // Variable not found or empty value
      missing.push(variableName);
    }
  });

  // Find unused parameters
  const unused = urlParams
    .filter(p => p.key && !usedParams.has(p.key))
    .map(p => p.key);

  return {
    url: replacedUrl,
    missing,
    unused,
    errors: missing.length > 0
      ? [`Missing values for URL parameters: ${missing.join(', ')}`]
      : [],
  };
};

/**
 * Extracts variable names from URL
 *
 * @param {string} url - URL with path variables
 * @returns {Array} Array of variable names (without ':')
 */
export const extractUrlVariables = (url) => {
  if (!url || typeof url !== 'string') {
    return [];
  }

  const variablePattern = /:([a-zA-Z_][a-zA-Z0-9_]*)/g;
  const matches = [...url.matchAll(variablePattern)];

  return matches.map(match => match[1]);
};

/**
 * Validates URL params against URL
 *
 * @param {string} url - URL with path variables
 * @param {Array} urlParams - Array of { key, value } objects
 * @returns {Object} { valid: boolean, errors: string[], warnings: string[] }
 */
export const validateUrlParams = (url, urlParams = []) => {
  const variables = extractUrlVariables(url);
  const errors = [];
  const warnings = [];

  // Check for missing values
  variables.forEach(varName => {
    const param = urlParams.find(p => p.key === varName);
    if (!param || !param.value || param.value.trim() === '') {
      errors.push(`Missing value for URL parameter: :${varName}`);
    }
  });

  // Check for unused parameters
  urlParams.forEach(param => {
    if (param.key && !variables.includes(param.key)) {
      warnings.push(`URL parameter "${param.key}" is defined but not used in the URL`);
    }
  });

  // Check for empty keys
  urlParams.forEach((param, index) => {
    if (!param.key || param.key.trim() === '') {
      warnings.push(`URL parameter at index ${index} has empty key`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Auto-suggests URL params based on URL variables
 *
 * @param {string} url - URL with path variables
 * @param {Array} existingParams - Existing URL params
 * @returns {Array} Suggested params array
 */
export const suggestUrlParams = (url, existingParams = []) => {
  const variables = extractUrlVariables(url);
  const suggested = [];

  variables.forEach(varName => {
    // Check if param already exists
    const existing = existingParams.find(p => p.key === varName);

    if (existing) {
      // Keep existing param
      suggested.push(existing);
    } else {
      // Create new param with empty value
      suggested.push({
        key: varName,
        value: '',
      });
    }
  });

  return suggested;
};

/**
 * Checks if URL has path variables
 *
 * @param {string} url - URL to check
 * @returns {boolean} True if URL contains path variables
 */
export const hasUrlVariables = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  return /:([a-zA-Z_][a-zA-Z0-9_]*)/.test(url);
};

export default {
  replaceUrlParams,
  extractUrlVariables,
  validateUrlParams,
  suggestUrlParams,
  hasUrlVariables,
};
