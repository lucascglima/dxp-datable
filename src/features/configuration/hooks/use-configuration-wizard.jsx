/**
 * useConfigurationWizard Hook
 *
 * Manages wizard step navigation and step definitions.
 * Extracted from configuration-page.jsx to follow clean architecture.
 *
 * ENHANCED: Now syncs with URL query parameters (?view=configuration&step=api).
 */

import { useCallback, useMemo, useEffect } from 'react';
import {
  ApiOutlined,
  TableOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  EyeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useUrlNavigation } from '../../../hooks/use-url-navigation';

/**
 * Step definitions with metadata
 */
const STEP_DEFINITIONS = [
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
    title: 'Filtros',
    icon: <SearchOutlined />,
  },
];

/**
 * Custom hook for managing configuration wizard
 * @returns {Object} Wizard state and navigation functions
 */
export const useConfigurationWizard = () => {
  const urlNav = useUrlNavigation({ defaultView: 'configuration', defaultStep: 'api' });

  /**
   * Get current step index from URL step key
   */
  const currentStep = useMemo(() => {
    const stepKey = urlNav.step;
    if (!stepKey) return 0; // Default to first step
    const index = STEP_DEFINITIONS.findIndex((step) => step.key === stepKey);
    return index >= 0 ? index : 0;
  }, [urlNav.step]);

  /**
   * Set default step on mount if not present in URL
   */
  useEffect(() => {
    if (!urlNav.step && urlNav.view === 'configuration') {
      urlNav.setStep(STEP_DEFINITIONS[0].key);
    }
  }, [urlNav]);

  /**
   * Navigates to next step
   */
  const nextStep = useCallback(() => {
    if (currentStep < STEP_DEFINITIONS.length - 1) {
      const nextStepKey = STEP_DEFINITIONS[currentStep + 1].key;
      urlNav.setStep(nextStepKey);
    }
  }, [currentStep, urlNav]);

  /**
   * Navigates to previous step
   */
  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      const prevStepKey = STEP_DEFINITIONS[currentStep - 1].key;
      urlNav.setStep(prevStepKey);
    }
  }, [currentStep, urlNav]);

  /**
   * Navigates to specific step by index
   */
  const goToStep = useCallback(
    (stepIndex) => {
      if (stepIndex >= 0 && stepIndex < STEP_DEFINITIONS.length) {
        const stepKey = STEP_DEFINITIONS[stepIndex].key;
        urlNav.setStep(stepKey);
      }
    },
    [urlNav]
  );

  /**
   * Navigates to specific step by key
   */
  const goToStepByKey = useCallback(
    (stepKey) => {
      const index = STEP_DEFINITIONS.findIndex((step) => step.key === stepKey);
      if (index >= 0) {
        urlNav.setStep(stepKey);
      }
    },
    [urlNav]
  );

  /**
   * Resets wizard to first step
   */
  const resetWizard = useCallback(() => {
    urlNav.setStep(STEP_DEFINITIONS[0].key);
  }, [urlNav]);

  /**
   * Checks if current step is the first
   */
  const isFirstStep = currentStep === 0;

  /**
   * Checks if current step is the last
   */
  const isLastStep = currentStep === STEP_DEFINITIONS.length - 1;

  /**
   * Gets current step definition
   */
  const getCurrentStep = useCallback(() => {
    return STEP_DEFINITIONS[currentStep];
  }, [currentStep]);

  return {
    currentStep,
    stepDefinitions: STEP_DEFINITIONS,
    nextStep,
    previousStep,
    goToStep,
    goToStepByKey,
    resetWizard,
    isFirstStep,
    isLastStep,
    getCurrentStep,
    totalSteps: STEP_DEFINITIONS.length,
  };
};
