/**
 * Date Renderer - Configuration
 *
 * Configuration fields and metadata for the date renderer.
 */

/**
 * Metadata for date renderer
 */
export const DATE_RENDERER_META = {
  label: 'Data',
  description: 'formata datas ISO 8601',
};

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
 * Configuration fields for date renderer
 * Used by the configuration UI to display appropriate inputs
 */
export const dateRendererFields = [
  {
    name: 'format',
    label: 'Formato da Data',
    type: 'select',
    placeholder: 'dd/MM/yyyy HH:mm',
    defaultValue: 'dd/MM/yyyy HH:mm',
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
