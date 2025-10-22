/**
 * Default Renderer
 *
 * Returns the value as-is without any transformation.
 * Used when no custom renderer is selected.
 */

/**
 * Renders a value without any transformation
 *
 * @param {any} value - Value to render
 * @param {Object} config - Renderer configuration (not used)
 * @param {Object} record - Full data record (optional, for advanced use)
 * @returns {any} Original value
 */
export const renderDefault = (value, config = {}, record = null) => {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return '';
  }

  // Handle objects and arrays (convert to JSON string)
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (error) {
      return '[Object]';
    }
  }

  // Return value as-is
  return value;
};
