/**
 * useResponseMapping Hook
 *
 * Manages response mapping configuration and validation.
 * Extracted from preview-section.jsx.
 */

import { useState, useEffect } from 'react';
import { validateMapping } from '../../../core/validators/mapping-validator';

/**
 * Custom hook for response mapping
 * @param {Object} initialMapping - Initial mapping configuration
 * @param {Function} onChange - Callback when mapping changes
 * @returns {Object} Mapping state and functions
 */
export const useResponseMapping = (initialMapping = null, onChange) => {
  const [enableMapping, setEnableMapping] = useState(false);
  const [dataPath, setDataPath] = useState('');
  const [totalPath, setTotalPath] = useState('');
  const [mappingValidation, setMappingValidation] = useState(null);

  /**
   * Load initial mapping values
   */
  useEffect(() => {
    if (initialMapping && initialMapping.dataKey) {
      setEnableMapping(true);
      setDataPath(initialMapping.dataKey || '');
      setTotalPath(initialMapping.totalKey || '');
    } else if (initialMapping === null) {
      setEnableMapping(false);
      setDataPath('');
      setTotalPath('');
    }
  }, [initialMapping]);

  /**
   * Notifies parent of mapping changes
   */
  const notifyChange = (enabled, currentDataPath, currentTotalPath) => {
    if (!onChange) return;

    if (!enabled) {
      onChange(null);
      return;
    }

    if (!currentDataPath.trim()) {
      onChange(null);
      return;
    }

    const mappingConfig = {
      dataKey: currentDataPath.trim(),
      totalKey: currentTotalPath.trim() || '',
      totalSource: 'body',
    };

    onChange(mappingConfig);
  };

  /**
   * Toggles mapping enabled/disabled
   */
  const toggleMapping = (enabled) => {
    setEnableMapping(enabled);

    if (!enabled) {
      setDataPath('');
      setTotalPath('');
      setMappingValidation(null);
      notifyChange(false, '', '');
    } else if (dataPath.trim()) {
      notifyChange(true, dataPath, totalPath);
    }
  };

  /**
   * Updates data path
   */
  const updateDataPath = (value) => {
    setDataPath(value);
    notifyChange(enableMapping, value, totalPath);
  };

  /**
   * Updates total path
   */
  const updateTotalPath = (value) => {
    setTotalPath(value);
    notifyChange(enableMapping, dataPath, value);
  };

  /**
   * Validates mapping against response data
   */
  const validateAgainstResponse = (responseData) => {
    if (!enableMapping || !dataPath.trim()) {
      setMappingValidation(null);
      return null;
    }

    const validation = validateMapping(responseData, dataPath.trim(), totalPath.trim());
    setMappingValidation(validation);
    return validation;
  };

  /**
   * Clears validation result
   */
  const clearValidation = () => {
    setMappingValidation(null);
  };

  /**
   * Gets current mapping configuration
   */
  const getMappingConfig = () => {
    if (!enableMapping || !dataPath.trim()) {
      return null;
    }

    return {
      dataKey: dataPath.trim(),
      totalKey: totalPath.trim() || '',
      totalSource: 'body',
    };
  };

  return {
    enableMapping,
    dataPath,
    totalPath,
    mappingValidation,
    toggleMapping,
    updateDataPath,
    updateTotalPath,
    validateAgainstResponse,
    clearValidation,
    getMappingConfig,
  };
};
