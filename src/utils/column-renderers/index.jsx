/**
 * Column Renderers
 *
 * Central registry for all column rendering customizations.
 * Provides helpers to apply renderers and get available options.
 */

import booleanRenderer from './boolean-renderer.jsx';
import dateRenderer from './date-renderer.jsx';
import defaultRenderer from './default-renderer.jsx';

/**
 * Registry of all available renderers
 */
export const RENDERERS = {
  default: defaultRenderer,
  boolean: booleanRenderer,
  date: dateRenderer,
};

/**
 * Get list of available renderer types for Select dropdown
 *
 * @returns {Array} Array of {value, label, description} objects
 */
export const getAvailableRenderers = () => {
  return [
    {
      value: 'default',
      label: 'Padrão',
      description: 'Exibe o valor sem customização',
    },
    {
      value: 'boolean',
      label: 'Booleano',
      description: 'Converte true/false em textos customizados',
    },
    {
      value: 'date',
      label: 'Data',
      description: 'Formata datas ISO 8601 para formato legível',
    },
  ];
};

/**
 * Get configuration fields for a specific renderer type
 *
 * @param {string} type - Renderer type (e.g., 'boolean', 'date')
 * @returns {Array} Array of field configuration objects
 */
export const getRendererFields = (type) => {
  const renderer = RENDERERS[type];
  return renderer ? renderer.fields : [];
};

/**
 * Get default configuration for a specific renderer type
 *
 * @param {string} type - Renderer type
 * @returns {Object} Default configuration object
 */
export const getRendererDefaultConfig = (type) => {
  const renderer = RENDERERS[type];
  return renderer ? renderer.defaultConfig : {};
};

/**
 * Apply renderer to a column value
 *
 * @param {any} value - Value to render
 * @param {Object} renderConfig - Render configuration from column
 * @param {string} renderConfig.type - Renderer type
 * @param {Object} renderConfig.config - Renderer-specific configuration
 * @param {Object} record - Full data record
 * @returns {any} Rendered value (can be React element or primitive)
 */
export const applyRenderer = (value, renderConfig, record = null) => {
  // If no render config, use default
  if (!renderConfig || !renderConfig.type) {
    return defaultRenderer.render(value, {}, record);
  }

  const { type, config = {} } = renderConfig;
  const renderer = RENDERERS[type];

  // If renderer not found, fall back to default
  if (!renderer) {
    console.warn(`Renderer type "${type}" not found, using default`);
    return defaultRenderer.render(value, {}, record);
  }

  // Apply the renderer
  try {
    return renderer.render(value, config, record);
  } catch (error) {
    console.error(`Error applying renderer "${type}":`, error);
    return defaultRenderer.render(value, {}, record);
  }
};

/**
 * Create a render function for Ant Design Table column
 * This is what gets passed to column.render
 *
 * @param {Object} renderConfig - Render configuration from column
 * @returns {Function} Ant Design render function (text, record, index) => rendered
 */
export const createColumnRenderer = (renderConfig) => {
  return (text, record, index) => {
    return applyRenderer(text, renderConfig, record);
  };
};

/**
 * Validate render configuration
 *
 * @param {Object} renderConfig - Render configuration to validate
 * @returns {Object} {valid: boolean, errors: string[]}
 */
export const validateRenderConfig = (renderConfig) => {
  const errors = [];

  if (!renderConfig) {
    return { valid: true, errors: [] }; // No config is valid (uses default)
  }

  if (!renderConfig.type) {
    errors.push('Tipo de renderização é obrigatório');
  } else if (!RENDERERS[renderConfig.type]) {
    errors.push(`Tipo de renderização "${renderConfig.type}" não existe`);
  }

  // Type-specific validation
  if (renderConfig.type === 'boolean') {
    const config = renderConfig.config || {};
    if (!config.trueText) {
      errors.push('Texto para "verdadeiro" é obrigatório');
    }
    if (!config.falseText) {
      errors.push('Texto para "falso" é obrigatório');
    }
  }

  if (renderConfig.type === 'date') {
    const config = renderConfig.config || {};
    if (!config.format) {
      errors.push('Formato de data é obrigatório');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Export individual renderers
export { booleanRenderer, dateRenderer, defaultRenderer };

// Export renderer functions directly
export { renderBoolean } from './boolean-renderer';
export { renderDate } from './date-renderer';
export { renderDefault } from './default-renderer';
