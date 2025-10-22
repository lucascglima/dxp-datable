/**
 * Column Renderers - Core API
 *
 * Public API for the column renderer system.
 * This is the main entry point for consuming the renderer functionality.
 */

// Export types and constants
export { RENDERER_TYPES, FIELD_TYPES } from './renderer.types';

// Export registry functions
export {
  registerRenderer,
  getRenderer,
  getAvailableRenderers,
  getRendererFields,
  getRendererDefaultConfig,
  applyRenderer,
  createColumnRenderer,
  validateRenderConfig,
  hasRenderer,
  getRendererCount,
} from './renderer-registry';
