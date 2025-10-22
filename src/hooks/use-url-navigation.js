/**
 * useUrlNavigation Hook
 *
 * Manages URL query parameters for application navigation.
 * Syncs view and step state with browser URL without React Router.
 *
 * Query params format:
 * - ?view=configuration&step=api
 * - ?view=datatable (no step param)
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Gets current URL search params
 * @returns {URLSearchParams}
 */
const getSearchParams = () => {
  return new URLSearchParams(window.location.search);
};

/**
 * Updates URL without page reload
 * @param {URLSearchParams} params
 */
const updateUrl = (params) => {
  const newUrl = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;

  window.history.pushState({}, '', newUrl);
};

/**
 * Custom hook for managing URL-based navigation
 * @param {Object} options - Configuration options
 * @param {string} options.defaultView - Default view if none in URL
 * @param {string} options.defaultStep - Default step if none in URL
 * @returns {Object} Navigation state and functions
 */
export const useUrlNavigation = ({ defaultView = 'configuration', defaultStep = null } = {}) => {
  // Initialize state from URL
  const [view, setViewState] = useState(() => {
    const params = getSearchParams();
    return params.get('view') || defaultView;
  });

  const [step, setStepState] = useState(() => {
    const params = getSearchParams();
    return params.get('step') || defaultStep;
  });

  /**
   * Listen to browser back/forward navigation
   */
  useEffect(() => {
    const handlePopState = () => {
      const params = getSearchParams();
      setViewState(params.get('view') || defaultView);
      setStepState(params.get('step') || defaultStep);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [defaultView, defaultStep]);

  /**
   * Sets the view parameter in URL
   * @param {string} newView - View name (e.g., 'configuration', 'datatable')
   */
  const setView = useCallback((newView) => {
    const params = getSearchParams();
    params.set('view', newView);
    updateUrl(params);
    setViewState(newView);
  }, []);

  /**
   * Sets the step parameter in URL
   * @param {string} newStep - Step name (e.g., 'api', 'preview', 'columns')
   */
  const setStep = useCallback((newStep) => {
    const params = getSearchParams();
    if (newStep) {
      params.set('step', newStep);
    } else {
      params.delete('step');
    }
    updateUrl(params);
    setStepState(newStep);
  }, []);

  /**
   * Removes the step parameter from URL
   */
  const clearStep = useCallback(() => {
    const params = getSearchParams();
    params.delete('step');
    updateUrl(params);
    setStepState(null);
  }, []);

  /**
   * Sets view and optionally step in one call
   * @param {string} newView - View name
   * @param {string|null} newStep - Step name or null
   */
  const navigate = useCallback((newView, newStep = null) => {
    const params = new URLSearchParams();
    params.set('view', newView);

    if (newStep) {
      params.set('step', newStep);
    }

    updateUrl(params);
    setViewState(newView);
    setStepState(newStep);
  }, []);

  /**
   * Gets current params as object
   * @returns {Object}
   */
  const getParams = useCallback(() => {
    return { view, step };
  }, [view, step]);

  return {
    view,
    step,
    setView,
    setStep,
    clearStep,
    navigate,
    getParams,
  };
};
