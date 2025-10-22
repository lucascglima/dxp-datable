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
  description: 'converte booleano para texto',
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
    label: 'Texto para verdadeiro*',
    type: 'text',
    placeholder: 'Sim',
    defaultValue: 'Sim',
  },
  {
    name: 'falseText',
    label: 'Texto para falso*',
    type: 'text',
    placeholder: 'Não',
    defaultValue: 'Não',
  },
  {
    name: 'showAsTag',
    label: 'Exibir com tag',
    type: 'checkbox',
    defaultValue: true,
  },
  {
    name: 'trueColor',
    label: 'Cor para verdadeiro',
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
    label: 'Cor para falso',
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
