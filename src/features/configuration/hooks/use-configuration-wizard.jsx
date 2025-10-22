/**
 * useConfigurationWizard Hook
 *
 * Manages wizard step navigation and step definitions.
 * Extracted from configuration-page.jsx to follow clean architecture.
 */

import { useState } from 'react';
import {
  ApiOutlined,
  TableOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  EyeOutlined,
  SearchOutlined,
} from '@ant-design/icons';

/**
 * Custom hook for managing configuration wizard
 * @returns {Object} Wizard state and navigation functions
 */
export const useConfigurationWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);

  /**
   * Step definitions with metadata
   */
  const stepDefinitions = [
    {
      key: 'api',
      title: 'API',
      icon: <ApiOutlined />,
    },
    {
      key: 'preview',
      title: 'Preview e Teste',
      icon: <EyeOutlined />,
    },
    {
      key: 'columns',
      title: 'Colunas',
      icon: <TableOutlined />,
    },
    {
      key: 'pagination',
      title: 'Paginação',
      icon: <SettingOutlined />,
    },
    {
      key: 'events',
      title: 'Eventos',
      icon: <ThunderboltOutlined />,
    },
    {
      key: 'dynamicParams',
      title: 'Inputs dinâmicos',
      icon: <SearchOutlined />,
    },
  ];

  /**
   * Navigates to next step
   */
  const nextStep = () => {
    if (currentStep < stepDefinitions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  /**
   * Navigates to previous step
   */
  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  /**
   * Navigates to specific step
   */
  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < stepDefinitions.length) {
      setCurrentStep(stepIndex);
    }
  };

  /**
   * Resets wizard to first step
   */
  const resetWizard = () => {
    setCurrentStep(0);
  };

  /**
   * Checks if current step is the first
   */
  const isFirstStep = currentStep === 0;

  /**
   * Checks if current step is the last
   */
  const isLastStep = currentStep === stepDefinitions.length - 1;

  /**
   * Gets current step definition
   */
  const getCurrentStep = () => stepDefinitions[currentStep];

  return {
    currentStep,
    stepDefinitions,
    nextStep,
    previousStep,
    goToStep,
    resetWizard,
    isFirstStep,
    isLastStep,
    getCurrentStep,
    totalSteps: stepDefinitions.length,
  };
};
