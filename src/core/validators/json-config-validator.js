/**
 * JSON Configuration Validator
 *
 * Validates JSON configuration input and provides detailed error reporting.
 * Leverages existing validators for consistency.
 */

import { validateConfiguration } from './config-validator';

/**
 * Validates JSON string and returns parsed configuration
 * @param {string} jsonString - JSON string to validate
 * @returns {Object} Validation result with parsed config or errors
 */
export const validateJsonConfiguration = (jsonString) => {
  const errors = [];

  // Check if string is empty
  if (!jsonString || !jsonString.trim()) {
    return {
      valid: false,
      errors: ['O JSON não pode estar vazio'],
      config: null,
    };
  }

  // Try to parse JSON
  let parsedConfig;
  try {
    parsedConfig = JSON.parse(jsonString);
  } catch (parseError) {
    return {
      valid: false,
      errors: [
        `Erro de sintaxe JSON: ${parseError.message}`,
        'Verifique se o JSON está bem formatado (chaves, vírgulas, aspas)',
      ],
      config: null,
    };
  }

  // Check if parsed result is an object
  if (typeof parsedConfig !== 'object' || parsedConfig === null || Array.isArray(parsedConfig)) {
    return {
      valid: false,
      errors: ['A configuração deve ser um objeto JSON válido'],
      config: null,
    };
  }

  // Validate structure using existing validator
  const structureValidation = validateConfiguration(parsedConfig);

  if (!structureValidation.valid) {
    return {
      valid: false,
      errors: structureValidation.errors,
      config: parsedConfig,
    };
  }

  // All validations passed
  return {
    valid: true,
    errors: [],
    config: parsedConfig,
  };
};

/**
 * Formats configuration object as pretty JSON string
 * @param {Object} config - Configuration object
 * @returns {string} Formatted JSON string
 */
export const formatConfigurationAsJson = (config) => {
  try {
    // Remove timestamps for cleaner JSON
    const { createdAt, updatedAt, ...configWithoutTimestamps } = config;
    return JSON.stringify(configWithoutTimestamps, null, 2);
  } catch (error) {
    console.error('Erro ao formatar configuração como JSON:', error);
    return '{}';
  }
};

/**
 * Validates JSON syntax without full validation
 * @param {string} jsonString - JSON string to check
 * @returns {Object} Syntax validation result
 */
export const validateJsonSyntax = (jsonString) => {
  if (!jsonString || !jsonString.trim()) {
    return {
      valid: false,
      error: 'JSON vazio',
    };
  }

  try {
    JSON.parse(jsonString);
    return {
      valid: true,
      error: null,
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
    };
  }
};

export default {
  validateJsonConfiguration,
  formatConfigurationAsJson,
  validateJsonSyntax,
};
