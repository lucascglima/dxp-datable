/**
 * Column Validator
 *
 * Validation logic for column configuration.
 */

/**
 * Validates a single column configuration
 * @param {Object} column - Column configuration to validate
 * @param {number} index - Column index (for error messages)
 * @returns {Array<string>} Array of validation error messages
 */
export const validateColumn = (column, index = 0) => {
  const errors = [];
  const columnLabel = `Coluna ${index + 1}`;

  if (!column.title || !column.title.trim()) {
    errors.push(`${columnLabel}: O Título é obrigatório`);
  }

  if (!column.dataIndex || !column.dataIndex.trim()) {
    errors.push(`${columnLabel}: O Campo de dados é obrigatório`);
  }

  // Validate width if provided
  if (column.width !== undefined && column.width !== null) {
    const width = Number(column.width);
    if (isNaN(width) || width < 50 || width > 1000) {
      errors.push(`${columnLabel}: A largura deve estar entre 50 e 1000 pixels`);
    }
  }

  // Validate render configuration
  if (column.render) {
    const renderErrors = validateRenderConfig(column.render, columnLabel);
    errors.push(...renderErrors);
  }

  return errors;
};

/**
 * Validates render configuration
 * @param {Object} renderConfig - Render configuration to validate
 * @param {string} columnLabel - Column label for error messages
 * @returns {Array<string>} Array of validation error messages
 */
const validateRenderConfig = (renderConfig, columnLabel) => {
  const errors = [];

  if (!renderConfig.type) {
    errors.push(`${columnLabel}: Tipo de renderização é obrigatório`);
  }

  // Validate type-specific configurations
  switch (renderConfig.type) {
    case 'date':
      if (renderConfig.config?.format && typeof renderConfig.config.format !== 'string') {
        errors.push(`${columnLabel}: Formato de data inválido`);
      }
      break;
    case 'boolean':
      // Boolean renderer validation could be added here
      break;
    default:
      // Default renderer doesn't require special validation
      break;
  }

  return errors;
};

/**
 * Validates an array of columns
 * @param {Array<Object>} columns - Array of column configurations
 * @returns {Object} Validation result with valid flag and errors array
 */
export const validateColumns = (columns = []) => {
  const errors = [];

  if (!Array.isArray(columns)) {
    return {
      valid: false,
      errors: ['A configuração de colunas deve ser um array'],
    };
  }

  if (columns.length === 0) {
    errors.push('Pelo menos uma coluna deve ser configurada');
  }

  // Validate each column
  columns.forEach((column, index) => {
    const columnErrors = validateColumn(column, index);
    errors.push(...columnErrors);
  });

  // Check for duplicate dataIndex values
  const dataIndexes = columns.map((col) => col.dataIndex).filter(Boolean);
  const duplicates = dataIndexes.filter((item, index) => dataIndexes.indexOf(item) !== index);

  if (duplicates.length > 0) {
    const uniqueDuplicates = [...new Set(duplicates)];
    errors.push(`Campos de dados duplicados encontrados: ${uniqueDuplicates.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validates JSON string for column import
 * @param {string} jsonText - JSON string to validate
 * @returns {Object} Validation result with valid flag, data, and errors
 */
export const validateColumnsJson = (jsonText) => {
  try {
    const parsed = JSON.parse(jsonText);

    if (!Array.isArray(parsed)) {
      return {
        valid: false,
        errors: ['O JSON deve ser um array de colunas'],
        data: null,
      };
    }

    // Validate each column in the JSON
    const errors = [];
    parsed.forEach((col, index) => {
      if (!col.title) {
        errors.push(`Coluna ${index + 1}: o campo "title" é obrigatório`);
      }
      if (!col.dataIndex) {
        errors.push(`Coluna ${index + 1}: o campo "dataIndex" é obrigatório`);
      }
    });

    if (errors.length > 0) {
      return {
        valid: false,
        errors,
        data: null,
      };
    }

    return {
      valid: true,
      errors: [],
      data: parsed,
    };
  } catch (error) {
    return {
      valid: false,
      errors: [`JSON inválido: ${error.message}`],
      data: null,
    };
  }
};
