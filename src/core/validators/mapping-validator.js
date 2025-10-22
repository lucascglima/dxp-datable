/**
 * Mapping Validator
 *
 * Validation logic for response mapping configuration.
 */

/**
 * Gets nested value from object using dot notation
 * @param {Object} obj - Object to traverse
 * @param {string} path - Dot notation path
 * @returns {*} Value at path or undefined
 */
const getNestedValue = (obj, path) => {
  if (!path) return obj;
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

/**
 * Validates response mapping paths against actual response data
 * @param {Object} responseData - Response data to validate against
 * @param {string} itemsPath - Path to items array
 * @param {string} totalPath - Path to total count (optional)
 * @returns {Object} Validation result with detailed information
 */
export const validateMapping = (responseData, itemsPath, totalPath = '') => {
  const validation = {
    itemsFound: false,
    itemsCount: 0,
    itemsIsArray: false,
    totalFound: false,
    totalValue: null,
    errors: [],
    warnings: [],
  };

  if (!responseData) {
    validation.errors.push('Dados de resposta não disponíveis para validação');
    return validation;
  }

  try {
    // Validate items path
    if (itemsPath) {
      const items = getNestedValue(responseData, itemsPath);

      if (items === undefined || items === null) {
        validation.errors.push(`Caminho "${itemsPath}" não encontrado na resposta`);
      } else if (!Array.isArray(items)) {
        validation.errors.push(
          `Caminho "${itemsPath}" existe mas não é um array (tipo: ${typeof items})`
        );
      } else {
        validation.itemsFound = true;
        validation.itemsIsArray = true;
        validation.itemsCount = items.length;

        if (items.length === 0) {
          validation.warnings.push(
            `Array de itens em "${itemsPath}" está vazio - não é possível gerar sugestões de colunas`
          );
        }
      }
    } else {
      validation.errors.push('Caminho da lista de itens é obrigatório');
    }

    // Validate total path (optional)
    if (totalPath && totalPath.trim()) {
      const total = getNestedValue(responseData, totalPath);

      if (total === undefined || total === null) {
        validation.warnings.push(`Caminho "${totalPath}" não encontrado - usando tamanho do array`);
      } else {
        const totalNum = parseInt(total, 10);
        if (isNaN(totalNum)) {
          validation.warnings.push(
            `Valor em "${totalPath}" não é um número válido (valor: ${total})`
          );
        } else {
          validation.totalFound = true;
          validation.totalValue = totalNum;
        }
      }
    }
  } catch (error) {
    validation.errors.push(`Erro de validação de mapeamento: ${error.message}`);
  }

  return validation;
};

/**
 * Validates mapping configuration before API test
 * @param {Object} mappingConfig - Mapping configuration to validate
 * @returns {Object} Validation result with valid flag and errors
 */
export const validateMappingConfig = (mappingConfig) => {
  const errors = [];

  if (!mappingConfig) {
    // No mapping is valid (direct array mode)
    return { valid: true, errors: [] };
  }

  if (!mappingConfig.dataKey || !mappingConfig.dataKey.trim()) {
    errors.push('Caminho da lista de itens é obrigatório quando o mapeamento está habilitado');
  }

  // Validate dot notation format (basic check)
  if (mappingConfig.dataKey) {
    const invalidChars = /[^a-zA-Z0-9._]/;
    if (invalidChars.test(mappingConfig.dataKey)) {
      errors.push(
        'Caminho da lista de itens contém caracteres inválidos (use apenas letras, números, pontos e underscores)'
      );
    }
  }

  if (mappingConfig.totalKey) {
    const invalidChars = /[^a-zA-Z0-9._]/;
    if (invalidChars.test(mappingConfig.totalKey)) {
      errors.push(
        'Caminho da contagem total contém caracteres inválidos (use apenas letras, números, pontos e underscores)'
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Extracts items array from response using mapping configuration
 * @param {Object} responseData - Response data
 * @param {Object} mappingConfig - Mapping configuration
 * @returns {Array|null} Extracted items array or null if not found
 */
export const extractItemsFromResponse = (responseData, mappingConfig) => {
  if (!mappingConfig || !mappingConfig.dataKey) {
    // No mapping - assume responseData is the array
    return Array.isArray(responseData) ? responseData : null;
  }

  const items = getNestedValue(responseData, mappingConfig.dataKey);
  return Array.isArray(items) ? items : null;
};

/**
 * Extracts total count from response using mapping configuration
 * @param {Object} responseData - Response data
 * @param {Object} mappingConfig - Mapping configuration
 * @param {number} fallbackCount - Fallback count if total not found
 * @returns {number} Total count
 */
export const extractTotalFromResponse = (responseData, mappingConfig, fallbackCount = 0) => {
  if (!mappingConfig || !mappingConfig.totalKey) {
    return fallbackCount;
  }

  const total = getNestedValue(responseData, mappingConfig.totalKey);
  const totalNum = parseInt(total, 10);

  return isNaN(totalNum) ? fallbackCount : totalNum;
};
