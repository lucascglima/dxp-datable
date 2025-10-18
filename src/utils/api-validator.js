/**
 * API Validator Utility
 *
 * Validates URLs and provides suggestions for common mistakes.
 * Helps ensure API endpoints are properly formatted.
 */

/**
 * Checks if a string is a valid URL
 *
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
export const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const urlObject = new URL(url);
    // Check if protocol is http or https
    return urlObject.protocol === 'http:' || urlObject.protocol === 'https:';
  } catch (error) {
    return false;
  }
};

/**
 * Checks if URL uses HTTPS protocol
 *
 * @param {string} url - URL to check
 * @returns {boolean} True if HTTPS
 */
export const isSecureUrl = (url) => {
  if (!isValidUrl(url)) {
    return false;
  }

  try {
    const urlObject = new URL(url);
    return urlObject.protocol === 'https:';
  } catch (error) {
    return false;
  }
};

/**
 * Suggests URL fix for common mistakes
 *
 * @param {string} url - URL to analyze
 * @returns {Object} Validation result with suggestions
 */
export const suggestUrlFix = (url) => {
  if (!url || typeof url !== 'string') {
    return {
      isValid: false,
      suggestions: ['Please enter a URL'],
      fixedUrl: null,
    };
  }

  const trimmed = url.trim();
  const suggestions = [];
  let fixedUrl = trimmed;

  // Check if missing protocol
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    fixedUrl = 'https://' + trimmed;
    suggestions.push('URL should start with http:// or https://');
  }

  // Check if using HTTP instead of HTTPS
  if (trimmed.startsWith('http://') && !trimmed.startsWith('http://localhost')) {
    suggestions.push('Consider using HTTPS for better security');
    fixedUrl = trimmed.replace('http://', 'https://');
  }

  // Check for spaces
  if (trimmed.includes(' ')) {
    suggestions.push('URL should not contain spaces');
    fixedUrl = fixedUrl.replace(/\s/g, '');
  }

  // Check for common typos
  const typos = [
    { wrong: 'htps://', correct: 'https://' },
    { wrong: 'http:/', correct: 'http://' },
    { wrong: 'https:/', correct: 'https://' },
    { wrong: 'htp://', correct: 'http://' },
  ];

  typos.forEach(({ wrong, correct }) => {
    if (fixedUrl.includes(wrong)) {
      suggestions.push(`Did you mean "${correct}"?`);
      fixedUrl = fixedUrl.replace(wrong, correct);
    }
  });

  // Validate final URL
  const isValid = isValidUrl(fixedUrl);

  if (!isValid && suggestions.length === 0) {
    suggestions.push('Please enter a valid URL (e.g., https://api.example.com/data)');
  }

  return {
    isValid: isValidUrl(fixedUrl),
    original: url,
    fixedUrl: fixedUrl !== url ? fixedUrl : null,
    suggestions,
    isSecure: isSecureUrl(fixedUrl),
  };
};

/**
 * Validates URL and provides user-friendly error messages
 *
 * @param {string} url - URL to validate
 * @returns {Object} Validation result with error messages
 */
export const validateUrl = (url) => {
  if (!url || !url.trim()) {
    return {
      valid: false,
      error: 'URL is required',
      severity: 'error',
    };
  }

  const validation = suggestUrlFix(url);

  if (!validation.isValid) {
    return {
      valid: false,
      error: validation.suggestions[0] || 'Invalid URL format',
      suggestions: validation.suggestions,
      fixedUrl: validation.fixedUrl,
      severity: 'error',
    };
  }

  if (!validation.isSecure) {
    return {
      valid: true,
      warning: 'URL is not secure (HTTPS recommended)',
      severity: 'warning',
    };
  }

  return {
    valid: true,
    severity: 'success',
  };
};

/**
 * Extracts domain from URL for display
 *
 * @param {string} url - URL to parse
 * @returns {string} Domain name or empty string
 */
export const extractDomain = (url) => {
  try {
    const urlObject = new URL(url);
    return urlObject.hostname;
  } catch (error) {
    return '';
  }
};

/**
 * Checks if URL is localhost or local IP
 *
 * @param {string} url - URL to check
 * @returns {boolean} True if localhost
 */
export const isLocalhost = (url) => {
  try {
    const urlObject = new URL(url);
    const hostname = urlObject.hostname.toLowerCase();
    return (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.')
    );
  } catch (error) {
    return false;
  }
};

export default {
  isValidUrl,
  isSecureUrl,
  suggestUrlFix,
  validateUrl,
  extractDomain,
  isLocalhost,
};
