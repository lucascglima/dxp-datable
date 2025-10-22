/**
 * Boolean Renderer - Public API
 *
 * Exports the complete boolean renderer implementation.
 */

import { renderBoolean } from './boolean-renderer';
import {
  BOOLEAN_RENDERER_META,
  booleanRendererFields,
  defaultBooleanConfig,
} from './boolean-config';

export default {
  ...BOOLEAN_RENDERER_META,
  render: renderBoolean,
  fields: booleanRendererFields,
  defaultConfig: defaultBooleanConfig,
};

// Named exports for direct access
export { renderBoolean } from './boolean-renderer';
export {
  BOOLEAN_RENDERER_META,
  booleanRendererFields,
  defaultBooleanConfig,
} from './boolean-config';
