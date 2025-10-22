/**
 * Column Renderers - Feature Layer
 *
 * This file imports all renderer implementations and registers them
 * with the core registry. It also re-exports the core API for convenience.
 *
 * This is the initialization point for the renderer system.
 */

import { registerRenderer, RENDERER_TYPES } from '../../../core/column-renderers';
import defaultRenderer from './default';
import booleanRenderer from './boolean';
import dateRenderer from './date';

// Register all renderers with the core registry
// This happens once when the module is imported
registerRenderer(RENDERER_TYPES.DEFAULT, defaultRenderer);
registerRenderer(RENDERER_TYPES.BOOLEAN, booleanRenderer);
registerRenderer(RENDERER_TYPES.DATE, dateRenderer);

// Re-export the core API for convenience
// This allows consumers to import from features/columns/renderers
// instead of going directly to core
export * from '../../../core/column-renderers';

// Also export individual renderer implementations if needed
export { default as defaultRenderer } from './default';
export { default as booleanRenderer } from './boolean';
export { default as dateRenderer } from './date';

// Export render functions directly for convenience
export { renderDefault } from './default';
export { renderBoolean } from './boolean';
export { renderDate } from './date';
