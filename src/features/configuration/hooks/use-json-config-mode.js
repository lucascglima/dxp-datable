/**
 * useJsonConfigMode Hook
 *
 * Manages JSON configuration mode state, validation, and synchronization.
 * Handles bidirectional sync between JSON editor and visual editor mode.
 */

import { useState, useCallback, useEffect } from 'react';
import {
  formatConfigurationAsJson,
  validateJsonConfiguration,
} from '../../../core/validators/json-config-validator';

/**
 * Configuration modes
 */
export const CONFIG_MODES = {
  VISUAL: 'visual',
  JSON: 'json',
};

/**
 * Custom hook for managing JSON configuration mode
 * @param {Object} currentConfig - Current configuration object from state
 * @returns {Object} JSON mode state and handlers
 */
export const useJsonConfigMode = (currentConfig) => {
  const [mode, setMode] = useState(CONFIG_MODES.VISUAL);
  const [jsonText, setJsonText] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [isValid, setIsValid] = useState(true);

  /**
   * Switches to JSON mode and loads current config as JSON
   */
  const switchToJsonMode = useCallback(() => {
    const formattedJson = formatConfigurationAsJson(currentConfig);
    setJsonText(formattedJson);
    setMode(CONFIG_MODES.JSON);
    setValidationErrors([]);
    setIsValid(true);
  }, [currentConfig]);

  /**
   * Switches to Visual Editor mode
   */
  const switchToVisualMode = useCallback(() => {
    setMode(CONFIG_MODES.VISUAL);
  }, []);

  /**
   * Toggles between modes
   */
  const toggleMode = useCallback(() => {
    if (mode === CONFIG_MODES.VISUAL) {
      switchToJsonMode();
    } else {
      switchToVisualMode();
    }
  }, [mode, switchToJsonMode, switchToVisualMode]);

  /**
   * Updates JSON text and validates it
   */
  const updateJsonText = useCallback((newText) => {
    setJsonText(newText);

    // Validate JSON
    const validation = validateJsonConfiguration(newText);
    setIsValid(validation.valid);
    setValidationErrors(validation.errors);
  }, []);

  /**
   * Gets parsed configuration from JSON text
   * @returns {Object|null} Parsed config or null if invalid
   */
  const getParsedConfig = useCallback(() => {
    const validation = validateJsonConfiguration(jsonText);
    return validation.valid ? validation.config : null;
  }, [jsonText]);

  /**
   * Reloads JSON from current config (useful when config changes externally)
   */
  const reloadJsonFromConfig = useCallback(() => {
    const formattedJson = formatConfigurationAsJson(currentConfig);
    setJsonText(formattedJson);
    setValidationErrors([]);
    setIsValid(true);
  }, [currentConfig]);

  /**
   * Auto-reload JSON when switching to JSON mode
   */
  useEffect(() => {
    if (mode === CONFIG_MODES.JSON) {
      const formattedJson = formatConfigurationAsJson(currentConfig);
      setJsonText(formattedJson);
    }
  }, [mode, currentConfig]);

  return {
    // State
    mode,
    jsonText,
    validationErrors,
    isValid,
    isJsonMode: mode === CONFIG_MODES.JSON,
    isVisualMode: mode === CONFIG_MODES.VISUAL,

    // Actions
    switchToJsonMode,
    switchToVisualMode,
    toggleMode,
    updateJsonText,
    getParsedConfig,
    reloadJsonFromConfig,
  };
};
