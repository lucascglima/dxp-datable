/**
 * Date Renderer - Public API
 *
 * Exports the complete date renderer implementation.
 */

import { renderDate } from './date-renderer';
import {
  DATE_RENDERER_META,
  dateRendererFields,
  defaultDateConfig,
  commonDateFormats,
} from './date-config';

export default {
  ...DATE_RENDERER_META,
  render: renderDate,
  fields: dateRendererFields,
  defaultConfig: defaultDateConfig,
};

// Named exports for direct access
export { renderDate } from './date-renderer';
export {
  DATE_RENDERER_META,
  dateRendererFields,
  defaultDateConfig,
  commonDateFormats,
} from './date-config';
