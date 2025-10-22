/**
 * Boolean Renderer - Configuration
 *
 * Configuration fields and metadata for the boolean renderer.
 */

/**
 * Metadata for boolean renderer
 */
export const BOOLEAN_RENDERER_META = {
  label: 'Booleano',
  description: 'Converte true/false em textos customizados',
};

/**
 * Default configuration for boolean renderer
 */
export const defaultBooleanConfig = {
  trueText: 'Sim',
  falseText: 'Não',
  showAsTag: true,
  trueColor: 'green',
  falseColor: 'red',
};

/**
 * Configuration fields for boolean renderer
 * Used by the configuration UI to display appropriate inputs
 */
export const booleanRendererFields = [
  {
    name: 'trueText',
    label: 'Texto para Verdadeiro *',
    type: 'text',
    placeholder: 'Sim',
    defaultValue: 'Sim',
  },
  {
    name: 'falseText',
    label: 'Texto para Falso *',
    type: 'text',
    placeholder: 'Não',
    defaultValue: 'Não',
  },
  {
    name: 'showAsTag',
    label: 'Exibir como Tag colorida',
    type: 'checkbox',
    defaultValue: true,
  },
  {
    name: 'trueColor',
    label: 'Cor para Verdadeiro',
    type: 'select',
    defaultValue: 'green',
    options: [
      { value: 'green', label: 'Verde' },
      { value: 'blue', label: 'Azul' },
      { value: 'cyan', label: 'Ciano' },
      { value: 'lime', label: 'Lima' },
    ],
    showWhen: (config) => config.showAsTag,
  },
  {
    name: 'falseColor',
    label: 'Cor para Falso',
    type: 'select',
    defaultValue: 'red',
    options: [
      { value: 'red', label: 'Vermelho' },
      { value: 'volcano', label: 'Laranja' },
      { value: 'orange', label: 'Laranja Claro' },
      { value: 'gold', label: 'Dourado' },
    ],
    showWhen: (config) => config.showAsTag,
  },
];
