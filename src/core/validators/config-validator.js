/**
 * Configuration Validator
 *
 * Main validation logic for overall configuration.
 */

import { validateUrl } from '../../utils/api-validator';
import { validateColumns } from './column-validator';

/**
 * Validates the complete configuration
 * @param {Object} config - Configuration object to validate
 * @returns {Object} Validation result with valid flag and errors array
 */
export const validateConfiguration = (config) => {
  const errors = [];

  // Validate API endpoint
  if (!config.apiEndpoint || !config.apiEndpoint.trim()) {
    errors.push('O endpoint de API é obrigatório');
  } else {
    const urlValidation = validateUrl(config.apiEndpoint);
    if (!urlValidation.valid) {
      errors.push(urlValidation.error || 'O endpoint de API válido é obrigatório');
    }
  }

  // Validate columns
  const columnValidation = validateColumns(config.columns);
  if (!columnValidation.valid) {
    errors.push(...columnValidation.errors);
  }

  // Validate pagination
  if (config.pagination) {
    const paginationErrors = validatePagination(config.pagination);
    errors.push(...paginationErrors);
  }

  // Validate events configuration
  if (config.events) {
    const eventsErrors = validateEvents(config.events);
    errors.push(...eventsErrors);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validates pagination configuration
 * @param {Object} pagination - Pagination configuration
 * @returns {Array<string>} Array of error messages
 */
const validatePagination = (pagination) => {
  const errors = [];

  if (pagination.pageSize !== undefined) {
    const pageSize = Number(pagination.pageSize);
    if (isNaN(pageSize) || pageSize < 1 || pageSize > 1000) {
      errors.push('O tamanho da página deve estar entre 1 e 1000');
    }
  }

  return errors;
};

/**
 * Validates events configuration
 * @param {Object} events - Events configuration
 * @returns {Array<string>} Array of error messages
 */
const validateEvents = (events) => {
  const errors = [];

  // Validate row click event
  if (events.onRowClick?.enabled && !events.onRowClick?.code) {
    errors.push('O código do evento de clique na linha é obrigatório quando habilitado');
  }

  // Validate sorting configuration
  if (events.sorting) {
    const sortingErrors = validateSorting(events.sorting);
    errors.push(...sortingErrors);
  }

  return errors;
};

/**
 * Validates sorting configuration
 * @param {Object} sorting - Sorting configuration
 * @returns {Array<string>} Array of error messages
 */
const validateSorting = (sorting) => {
  const errors = [];

  const validModes = ['server', 'client', 'disabled'];
  if (sorting.mode && !validModes.includes(sorting.mode)) {
    errors.push(`Modo de ordenação inválido: ${sorting.mode}`);
  }

  // Validate server-side sorting config
  if (sorting.mode === 'server' && sorting.serverConfig) {
    const { columnParam, orderParam, orderFormat, orderValues } = sorting.serverConfig;

    if (!columnParam || !columnParam.trim()) {
      errors.push('Parâmetro de coluna é obrigatório para ordenação server-side');
    }

    if (!orderParam || !orderParam.trim()) {
      errors.push('Parâmetro de ordem é obrigatório para ordenação server-side');
    }

    const validFormats = ['numeric', 'asc-desc', 'ascend-descend'];
    if (orderFormat && !validFormats.includes(orderFormat)) {
      errors.push(`Formato de ordem inválido: ${orderFormat}`);
    }

    if (orderValues) {
      if (!orderValues.ascend) {
        errors.push('Valor de ordenação ascendente é obrigatório');
      }
      if (!orderValues.descend) {
        errors.push('Valor de ordenação descendente é obrigatório');
      }
    }
  }

  return errors;
};

/**
 * Validates URL parameters configuration
 * @param {Array} urlParams - URL parameters array
 * @returns {Object} Validation result
 */
export const validateUrlParams = (urlParams = []) => {
  const errors = [];

  if (!Array.isArray(urlParams)) {
    return {
      valid: false,
      errors: ['Parâmetros de URL devem ser um array'],
    };
  }

  urlParams.forEach((param, index) => {
    if (!param.name || !param.name.trim()) {
      errors.push(`Parâmetro de URL ${index + 1}: Nome é obrigatório`);
    }

    // Check for duplicate names
    const duplicates = urlParams.filter((p) => p.name === param.name);
    if (duplicates.length > 1) {
      errors.push(`Parâmetro de URL duplicado: ${param.name}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validates query parameters configuration
 * @param {Array} queryParams - Query parameters array
 * @returns {Object} Validation result
 */
export const validateQueryParams = (queryParams = []) => {
  const errors = [];

  if (!Array.isArray(queryParams)) {
    return {
      valid: false,
      errors: ['Parâmetros de consulta devem ser um array'],
    };
  }

  queryParams.forEach((param, index) => {
    if (!param.key || !param.key.trim()) {
      errors.push(`Parâmetro de consulta ${index + 1}: Chave é obrigatória`);
    }
  });

  // Check for duplicate keys
  const keys = queryParams.map((p) => p.key).filter(Boolean);
  const duplicates = keys.filter((item, index) => keys.indexOf(item) !== index);

  if (duplicates.length > 0) {
    const uniqueDuplicates = [...new Set(duplicates)];
    errors.push(`Chaves de parâmetro duplicadas: ${uniqueDuplicates.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
