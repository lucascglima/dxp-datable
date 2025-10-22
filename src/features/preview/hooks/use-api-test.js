/**
 * useApiTest Hook
 *
 * Manages API connection testing logic.
 * Extracted from preview-section.jsx.
 */

import { useState } from 'react';
import { testConnection } from '../../../services/external-api';
import { validateUrl } from '../../../utils/api-validator';
import { validateParamConflicts, toObject } from '../../../utils/query-string-parser';
import { validateMappingConfig } from '../../../core/validators/mapping-validator';

/**
 * Custom hook for API testing
 * @returns {Object} API test state and functions
 */
export const useApiTest = () => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  /**
   * Tests API connection
   * @param {Object} params - Test parameters
   * @returns {Object} Test result
   */
  const runTest = async ({
    apiEndpoint,
    authToken,
    urlParams = [],
    queryParams = [],
    defaultQueryParams = [],
    mappingConfig = null,
  }) => {
    // Validate URL
    const urlValidation = validateUrl(apiEndpoint);
    if (!urlValidation.valid) {
      const result = {
        success: false,
        message: urlValidation.error || 'Invalid URL',
      };
      setTestResult(result);
      return result;
    }

    // Validate mapping if enabled
    if (mappingConfig) {
      const mappingValidation = validateMappingConfig(mappingConfig);
      if (!mappingValidation.valid) {
        const result = {
          success: false,
          message: 'Configuração de mapeamento inválida',
          errors: mappingValidation.errors,
        };
        setTestResult(result);
        return result;
      }
    }

    // Validate for duplicate query parameters
    const paramValidation = validateParamConflicts({
      testParams: queryParams,
      defaultParams: defaultQueryParams,
      paginationParams: [],
      labels: {
        testParams: 'Test Query Params',
        defaultParams: 'Default Query Params',
        paginationParams: 'Pagination Params',
      },
    });

    if (!paramValidation.valid) {
      const result = {
        success: false,
        message: 'Parâmetros de consulta duplicados detectados',
        duplicateErrors: paramValidation.errors,
      };
      setTestResult(result);
      return result;
    }

    // Build query parameters
    const testParams = toObject(queryParams);
    const defaultParamsObj = toObject(defaultQueryParams.filter((p) => p.enabled !== false));
    const mergedParams = { ...defaultParamsObj, ...testParams };

    setTesting(true);
    setTestResult(null);

    try {
      // Prepare API config
      const apiConfig = {
        urlParams: urlParams || [],
        ...(mappingConfig ? { responseDataPath: mappingConfig } : {}),
      };

      const result = await testConnection(apiEndpoint, authToken, apiConfig, mergedParams);

      setTestResult(result);
      return result;
    } catch (error) {
      const result = {
        success: false,
        message: error.message || 'Connection test failed',
      };
      setTestResult(result);
      return result;
    } finally {
      setTesting(false);
    }
  };

  /**
   * Clears test result
   */
  const clearResult = () => {
    setTestResult(null);
  };

  return {
    testing,
    testResult,
    runTest,
    clearResult,
  };
};
