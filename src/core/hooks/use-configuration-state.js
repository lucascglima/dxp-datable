/**
 * useConfigurationState Hook
 *
 * Manages the main configuration state with auto-save to localStorage.
 * Extracted from configuration-page.jsx to follow clean architecture.
 */

import { useState, useEffect } from 'react';
import { App } from 'antd';
import {
  saveConfiguration,
  loadConfiguration,
  clearConfiguration,
} from '../../services/config-storage';
import { createConfiguration } from '../models/configuration.types';

/**
 * Custom hook for managing configuration state
 * @returns {Object} Configuration state and handlers
 */
export const useConfigurationState = () => {
  const { message } = App.useApp();
  const [config, setConfig] = useState(createConfiguration());
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  /**
   * Load existing configuration on mount
   */
  useEffect(() => {
    const existing = loadConfiguration();
    if (existing) {
      const configWithDefaults = createConfiguration(existing);
      setConfig(configWithDefaults);
      message.info('Configuração existente carregada');
    }
    setIsInitialLoad(false);
  }, []);

  /**
   * Auto-save configuration to localStorage when it changes
   * (except on initial load to avoid overwriting with defaults)
   */
  useEffect(() => {
    if (!isInitialLoad && config.apiEndpoint) {
      saveConfiguration(config);
    }
  }, [config, isInitialLoad]);

  /**
   * Updates API configuration
   */
  const updateApiConfig = (apiConfig) => {
    setConfig((prev) => ({
      ...prev,
      apiEndpoint: apiConfig.apiEndpoint,
      authToken: apiConfig.authToken,
      urlParams: apiConfig.urlParams || [],
      defaultQueryParams: apiConfig.defaultQueryParams || [],
    }));
  };

  /**
   * Updates test query parameters
   */
  const updateTestQueryParams = (testQueryParams) => {
    setConfig((prev) => ({
      ...prev,
      testQueryParams,
    }));
  };

  /**
   * Updates columns configuration
   */
  const updateColumns = (columns) => {
    setConfig((prev) => ({
      ...prev,
      columns,
    }));
  };

  /**
   * Updates pagination configuration
   */
  const updatePagination = (pagination) => {
    setConfig((prev) => ({
      ...prev,
      pagination,
    }));
  };

  /**
   * Updates events configuration
   */
  const updateEvents = (events) => {
    setConfig((prev) => ({
      ...prev,
      events,
    }));
  };

  /**
   * Updates dynamic parameters configuration
   */
  const updateDynamicParams = (dynamicParams) => {
    setConfig((prev) => ({
      ...prev,
      dynamicParams,
    }));
  };

  /**
   * Updates response mapping configuration
   */
  const updateResponseMapping = (responseDataPath) => {
    setConfig((prev) => ({
      ...prev,
      responseDataPath,
    }));
  };

  /**
   * Replaces entire configuration (used for loading examples or imports)
   */
  const replaceConfig = (newConfig) => {
    const configWithDefaults = createConfiguration(newConfig);
    setConfig(configWithDefaults);
  };

  /**
   * Clears all configuration and resets to defaults
   */
  const clearConfig = () => {
    clearConfiguration();
    setConfig(createConfiguration());
    message.success('Configuração limpa');
  };

  /**
   * Saves configuration to localStorage (manual save)
   */
  const saveConfig = () => {
    const success = saveConfiguration(config);
    return success;
  };

  return {
    config,
    setConfig,
    updateApiConfig,
    updateTestQueryParams,
    updateColumns,
    updatePagination,
    updateEvents,
    updateDynamicParams,
    updateResponseMapping,
    replaceConfig,
    clearConfig,
    saveConfig,
  };
};
