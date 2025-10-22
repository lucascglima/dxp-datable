/**
 * Default Renderer - Public API
 *
 * Exports the complete default renderer implementation.
 */

import { renderDefault } from './default-renderer';

export default {
  label: 'Padrão',
  description: 'texto simples sem formatação',
  render: renderDefault,
  fields: [], // No configuration fields needed
  defaultConfig: {}, // No default config needed
};

// Named exports for direct access
export { renderDefault } from './default-renderer';
