/**
 * Column Renderer Types
 *
 * Constants and type definitions for the column renderer system.
 * This file defines the contract that all renderers must follow.
 */

/**
 * Available renderer types
 * @enum {string}
 */
export const RENDERER_TYPES = {
  DEFAULT: 'default',
  BOOLEAN: 'boolean',
  DATE: 'date',
};

/**
 * Renderer field types
 * Used in renderer configuration UI
 * @enum {string}
 */
export const FIELD_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  SELECT: 'select',
  CHECKBOX: 'checkbox',
  COLOR: 'color',
};

/**
 * Type definition for a renderer field configuration
 * @typedef {Object} RendererField
 * @property {string} name - Field name (used as config key)
 * @property {string} label - Display label for UI
 * @property {FIELD_TYPES} type - Field input type
 * @property {any} [defaultValue] - Default value
 * @property {string} [placeholder] - Placeholder text
 * @property {string} [helpText] - Help text for user
 * @property {Array<{value: any, label: string}>} [options] - Options for select type
 * @property {boolean} [allowCustom] - Allow custom input for select
 * @property {Function} [showWhen] - Conditional display function
 */

/**
 * Type definition for a renderer implementation
 * @typedef {Object} RendererImplementation
 * @property {string} label - Display label for renderer
 * @property {string} [description] - Description of what the renderer does
 * @property {Function} render - Render function (value, config, record) => any
 * @property {Array<RendererField>} fields - Configuration fields
 * @property {Object} defaultConfig - Default configuration values
 */
