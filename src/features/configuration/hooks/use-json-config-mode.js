/**
 * useJsonConfigMode Hook
 *
 * Manages JSON configuration mode state, validation, and synchronization.
 * Handles bidirectional sync between JSON editor and visual editor mode.
 * Integrates with URL navigation to persist mode in URL query params.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  formatConfigurationAsJson,
  validateJsonConfiguration,
} from '../../../core/validators/json-config-validator';
import { JSON_STEP_KEY } from './use-configuration-wizard';

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
 * @param {Object} urlNavigation - URL navigation hook (from useUrlNavigation)
 * @returns {Object} JSON mode state and handlers
 */
export const useJsonConfigMode = (currentConfig, urlNavigation) => {
  const [mode, setMode] = useState(CONFIG_MODES.VISUAL);
  const [jsonText, setJsonText] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [isValid, setIsValid] = useState(true);
  const previousStepRef = useRef(null); // Store previous step for restoration

  /**
   * Switches to JSON mode and loads current config as JSON
   * Also updates URL to reflect JSON mode
   */
  const switchToJsonMode = useCallback(() => {
    // Store current step before switching
    if (urlNavigation && urlNavigation.step !== JSON_STEP_KEY) {
      previousStepRef.current = urlNavigation.step || 'api';
    }

    const formattedJson = formatConfigurationAsJson(currentConfig);
    setJsonText(formattedJson);
    setMode(CONFIG_MODES.JSON);
    setValidationErrors([]);
    setIsValid(true);

    // Update URL to json step
    if (urlNavigation) {
      urlNavigation.setStep(JSON_STEP_KEY);
    }
  }, [currentConfig, urlNavigation]);

  /**
   * Switches to Visual Editor mode
   * Restores previous step in URL
   */
  const switchToVisualMode = useCallback(() => {
    setMode(CONFIG_MODES.VISUAL);

    // Restore previous step in URL
    if (urlNavigation) {
      const stepToRestore = previousStepRef.current || 'api';
      urlNavigation.setStep(stepToRestore);
    }
  }, [urlNavigation]);

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
   * Sync mode with URL step parameter
   */
  useEffect(() => {
    if (!urlNavigation) return;

    // If URL says 'json' but we're in visual mode, switch to JSON
    if (urlNavigation.step === JSON_STEP_KEY && mode === CONFIG_MODES.VISUAL) {
      const formattedJson = formatConfigurationAsJson(currentConfig);
      setJsonText(formattedJson);
      setMode(CONFIG_MODES.JSON);
      setValidationErrors([]);
      setIsValid(true);
    }

    // If URL is NOT 'json' but we're in JSON mode, switch to Visual
    if (urlNavigation.step !== JSON_STEP_KEY && mode === CONFIG_MODES.JSON) {
      setMode(CONFIG_MODES.VISUAL);
    }
  }, [urlNavigation?.step, mode, currentConfig, urlNavigation]);

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
