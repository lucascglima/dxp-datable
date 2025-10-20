/**
 * Date Renderer
 *
 * Converts ISO 8601 date strings to formatted dates.
 * Default format: dd/MM/yyyy HH:mm
 */

import { format, parseISO, isValid } from 'date-fns';

/**
 * Default configuration for date renderer
 */
export const defaultDateConfig = {
  format: 'dd/MM/yyyy HH:mm',
  invalidText: '-',
  emptyText: '-',
};

/**
 * Common date format patterns
 */
export const commonDateFormats = [
  { value: 'dd/MM/yyyy HH:mm', label: '31/12/2023 23:59' },
  { value: 'dd/MM/yyyy', label: '31/12/2023' },
  { value: 'dd/MM/yy', label: '31/12/23' },
  { value: 'yyyy-MM-dd', label: '2023-12-31' },
  { value: 'MM/dd/yyyy', label: '12/31/2023' },
  { value: 'HH:mm:ss', label: '23:59:59' },
  { value: 'HH:mm', label: '23:59' },
  { value: "dd 'de' MMMM 'de' yyyy", label: '31 de dezembro de 2023' },
  { value: "EEEE, dd 'de' MMMM 'de' yyyy", label: 'domingo, 31 de dezembro de 2023' },
];

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

/**
 * Configuration fields needed for date renderer
 * Used by the configuration UI to display appropriate inputs
 */
export const dateRendererFields = [
  {
    name: 'format',
    label: 'Formato da Data',
    type: 'select',
    placeholder: 'dd/MM/yyyy HH:mm',
    defaultValue: 'dd/MM/yyyy HH:mm',
    required: true,
    options: commonDateFormats,
    allowCustom: true,
    helpText: 'Utilize os padrões de date-fns. Ex: dd/MM/yyyy HH:mm',
  },
  {
    name: 'invalidText',
    label: 'Texto para Datas Inválidas',
    type: 'text',
    placeholder: '-',
    defaultValue: '-',
  },
  {
    name: 'emptyText',
    label: 'Texto para Valores Vazios',
    type: 'text',
    placeholder: '-',
    defaultValue: '-',
  },
];

export default {
  render: renderDate,
  fields: dateRendererFields,
  defaultConfig: defaultDateConfig,
};
