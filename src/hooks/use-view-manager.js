/**
 * useViewManager Hook
 *
 * Manages view navigation without React Router.
 * Created to replace react-router-dom for Liferay client extension compatibility.
 *
 * In Liferay client extensions, we cannot use BrowserRouter as it conflicts
 * with Liferay's own routing system.
 *
 * ENHANCED: Now syncs with URL query parameters for better UX and bookmarkability.
 */

import { useCallback, useMemo } from 'react';
import { useUrlNavigation } from './use-url-navigation';

/**
 * Available views in the application
 */
export const VIEWS = {
  CONFIGURATION: 'configuration',
  DATATABLE: 'datatable',
};

/**
 * Custom hook for managing application views
 * @param {string} initialView - Initial view to display (fallback if no URL param)
 * @returns {Object} View state and navigation functions
 */
export const useViewManager = (initialView = VIEWS.CONFIGURATION) => {
  const urlNav = useUrlNavigation({ defaultView: initialView });

  /**
   * Navigates to a specific view
   * Clears step param when navigating to datatable
   */
  const navigateTo = useCallback(
    (view) => {
      if (Object.values(VIEWS).includes(view)) {
        if (view === VIEWS.DATATABLE) {
          // When going to datatable, clear the step param
          urlNav.navigate(view, null);
        } else {
          // When going to configuration, keep current step if exists
          urlNav.setView(view);
        }
      } else {
        console.warn(`Invalid view: ${view}`);
      }
    },
    [urlNav]
  );

  /**
   * Navigates to configuration view
   */
  const goToConfiguration = useCallback(() => {
    navigateTo(VIEWS.CONFIGURATION);
  }, [navigateTo]);

  /**
   * Navigates to datatable view
   */
  const goToDatatable = useCallback(() => {
    navigateTo(VIEWS.DATATABLE);
  }, [navigateTo]);

  /**
   * Checks if currently on configuration view
   */
  const isConfiguration = useMemo(() => urlNav.view === VIEWS.CONFIGURATION, [urlNav.view]);

  /**
   * Checks if currently on datatable view
   */
  const isDatatable = useMemo(() => urlNav.view === VIEWS.DATATABLE, [urlNav.view]);

  return {
    currentView: urlNav.view,
    navigateTo,
    goToConfiguration,
    goToDatatable,
    isConfiguration,
    isDatatable,
    VIEWS,
  };
};
