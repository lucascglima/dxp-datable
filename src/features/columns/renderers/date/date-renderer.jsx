/**
 * Date Renderer - Render Logic
 *
 * Converts ISO 8601 date strings to formatted dates.
 * Default format: dd/MM/yyyy HH:mm
 */

import { format, parseISO, isValid } from 'date-fns';
import { defaultDateConfig } from './date-config';

/**
 * Renders an ISO 8601 date string as formatted date
 *
 * @param {string|Date|number} value - Date value (ISO string, Date object, or timestamp)
 * @param {Object} config - Renderer configuration
 * @param {string} config.format - date-fns format pattern
 * @param {string} config.invalidText - Text to show for invalid dates
 * @param {string} config.emptyText - Text to show for null/undefined values
 * @param {Object} record - Full data record (optional, for advanced use)
 * @returns {string} Formatted date string
 */
export const renderDate = (value, config = {}, record = null) => {
  // Merge with default config
  const finalConfig = { ...defaultDateConfig, ...config };

  // Handle empty values
  if (value === null || value === undefined || value === '') {
    return finalConfig.emptyText;
  }

  try {
    let dateObject;

    // Parse value based on type
    if (value instanceof Date) {
      dateObject = value;
    } else if (typeof value === 'string') {
      // Try to parse ISO 8601 string
      dateObject = parseISO(value);
    } else if (typeof value === 'number') {
      // Handle timestamp (milliseconds)
      dateObject = new Date(value);
    } else {
      // Unknown type
      return finalConfig.invalidText;
    }

    // Validate date
    if (!isValid(dateObject)) {
      return finalConfig.invalidText;
    }

    // Format the date
    return format(dateObject, finalConfig.format);
  } catch (error) {
    console.error('Error formatting date:', error, 'Value:', value);
    return finalConfig.invalidText;
  }
};
