/**
 * Column Renderer Registry
 *
 * Central registry for all column renderers.
 * Provides a plugin-like architecture where renderers can be registered
 * and retrieved dynamically.
 */

import { RENDERER_TYPES } from './renderer.types';

/**
 * Internal registry storage
 * @type {Object<string, RendererImplementation>}
 */
const RENDERERS = {};

/**
 * Register a new renderer type
 *
 * @param {string} type - Renderer type identifier
 * @param {RendererImplementation} implementation - Renderer implementation
 * @throws {Error} If type is missing or implementation is invalid
 */
export const registerRenderer = (type, implementation) => {
  if (!type || typeof type !== 'string') {
    throw new Error('Renderer type must be a non-empty string');
  }

  if (!implementation || typeof implementation.render !== 'function') {
    throw new Error('Renderer implementation must have a render function');
  }

  if (RENDERERS[type]) {
    console.warn(`Renderer "${type}" is being overwritten`);
  }

  RENDERERS[type] = implementation;
};

/**
 * Get a renderer implementation by type
 * Falls back to default renderer if type not found
 *
 * @param {string} type - Renderer type
 * @returns {RendererImplementation} Renderer implementation
 */
export const getRenderer = (type) => {
  const renderer = RENDERERS[type];

  if (!renderer) {
    console.warn(`Renderer "${type}" not found, falling back to default`);
    return RENDERERS[RENDERER_TYPES.DEFAULT] || null;
  }

  return renderer;
};

/**
 * Get all available renderer types for UI selection
 *
 * @returns {Array<{value: string, label: string, description?: string}>}
 */
export const getAvailableRenderers = () => {
  return Object.keys(RENDERERS).map((type) => ({
    value: type,
    label: RENDERERS[type].label || type,
    description: RENDERERS[type].description,
  }));
};

/**
 * Get configuration fields for a specific renderer
 *
 * @param {string} type - Renderer type
 * @returns {Array<RendererField>} Configuration fields
 */
export const getRendererFields = (type) => {
  const renderer = getRenderer(type);
  return renderer?.fields || [];
};

/**
 * Get default configuration for a specific renderer
 *
 * @param {string} type - Renderer type
 * @returns {Object} Default configuration object
 */
export const getRendererDefaultConfig = (type) => {
  const renderer = getRenderer(type);
  return renderer?.defaultConfig || {};
};

/**
 * Apply a renderer to a value
 *
 * @param {any} value - Value to render
 * @param {Object} renderConfig - Render configuration
 * @param {string} renderConfig.type - Renderer type
 * @param {Object} renderConfig.config - Renderer-specific configuration
 * @param {Object} record - Full data record (optional)
 * @returns {any} Rendered value
 */
export const applyRenderer = (value, renderConfig, record = null) => {
  // Default to 'default' renderer if no config
  if (!renderConfig || !renderConfig.type) {
    const defaultRenderer = RENDERERS[RENDERER_TYPES.DEFAULT];
    return defaultRenderer?.render(value, {}, record) || value;
  }

  const { type, config = {} } = renderConfig;
  const renderer = getRenderer(type);

  if (!renderer) {
    console.error(`Renderer "${type}" not found`);
    return value;
  }

  // Apply renderer with error handling
  try {
    return renderer.render(value, config, record);
  } catch (error) {
    console.error(`Error applying renderer "${type}":`, error);
    // Fallback to default renderer
    const defaultRenderer = RENDERERS[RENDERER_TYPES.DEFAULT];
    return defaultRenderer?.render(value, {}, record) || value;
  }
};

/**
 * Create a column render function for Ant Design Table
 * This wraps applyRenderer for use in table column definitions
 *
 * @param {Object} renderConfig - Render configuration
 * @returns {Function} Render function (text, record, index) => rendered
 */
export const createColumnRenderer = (renderConfig) => {
  return (text, record, index) => {
    return applyRenderer(text, renderConfig, record);
  };
};

/**
 * Validate a render configuration
 *
 * @param {Object} renderConfig - Configuration to validate
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
  if (renderConfig.type === RENDERER_TYPES.BOOLEAN) {
    const config = renderConfig.config || {};
    if (!config.trueText) {
      errors.push('Texto para "verdadeiro" é obrigatório');
    }
    if (!config.falseText) {
      errors.push('Texto para "falso" é obrigatório');
    }
  }

  if (renderConfig.type === RENDERER_TYPES.DATE) {
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

/**
 * Check if a renderer type is registered
 *
 * @param {string} type - Renderer type to check
 * @returns {boolean} True if renderer is registered
 */
export const hasRenderer = (type) => {
  return !!RENDERERS[type];
};

/**
 * Get count of registered renderers
 *
 * @returns {number} Number of registered renderers
 */
export const getRendererCount = () => {
  return Object.keys(RENDERERS).length;
};
