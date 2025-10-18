/**
 * Liferay Configuration Module
 *
 * Reads properties sent by Liferay via window object or data attributes.
 * Provides configuration for API integration and user context.
 */

/**
 * Extracts Liferay configuration from the custom element
 *
 * @returns {Object} Configuration object with Liferay properties
 */
export const getLiferayConfig = () => {
  // Try to get configuration from window.Liferay object (production)
  if (typeof window !== 'undefined' && window.Liferay) {
    const { Liferay } = window;

    return {
      oAuthToken: Liferay.authToken || '',
      apiBaseURL: Liferay.ThemeDisplay?.getPortalURL() || '',
      locale: Liferay.ThemeDisplay?.getLanguageId() || 'en_US',
      userId: Liferay.ThemeDisplay?.getUserId() || '',
      userName: Liferay.ThemeDisplay?.getUserName() || '',
      companyId: Liferay.ThemeDisplay?.getCompanyId() || '',
      groupId: Liferay.ThemeDisplay?.getScopeGroupId() || '',
      siteId: Liferay.ThemeDisplay?.getSiteGroupId() || '',
      pathThemeImages: Liferay.ThemeDisplay?.getPathThemeImages() || '',
      isSignedIn: Liferay.ThemeDisplay?.isSignedIn() || false,
    };
  }

  // Try to get configuration from custom element data attributes (alternative method)
  const customElement = document.querySelector('[data-liferay-config]');
  if (customElement) {
    try {
      const config = JSON.parse(customElement.dataset.liferayConfig);
      return {
        oAuthToken: config.oAuthToken || '',
        apiBaseURL: config.apiBaseURL || '',
        locale: config.locale || 'en_US',
        userId: config.userId || '',
        userName: config.userName || '',
        companyId: config.companyId || '',
        groupId: config.groupId || '',
        siteId: config.siteId || '',
        pathThemeImages: config.pathThemeImages || '',
        isSignedIn: config.isSignedIn || false,
      };
    } catch (error) {
      console.error('Error parsing Liferay config from data attributes:', error);
    }
  }

  // Return default configuration for development environment
  console.warn('Liferay context not found. Using development defaults.');
  return {
    oAuthToken: process.env.VITE_LIFERAY_TOKEN || '',
    apiBaseURL: process.env.VITE_LIFERAY_API_URL || 'http://localhost:8080',
    locale: 'en_US',
    userId: 'dev-user',
    userName: 'Developer User',
    companyId: '1',
    groupId: '1',
    siteId: '1',
    pathThemeImages: '',
    isSignedIn: true,
  };
};

/**
 * Gets the OAuth token for API authentication
 *
 * @returns {string} OAuth token
 */
export const getAuthToken = () => {
  const config = getLiferayConfig();
  return config.oAuthToken;
};

/**
 * Gets the base URL for Liferay API calls
 *
 * @returns {string} API base URL
 */
export const getApiBaseURL = () => {
  const config = getLiferayConfig();
  return config.apiBaseURL;
};

/**
 * Gets the current user's locale
 *
 * @returns {string} Locale (e.g., 'en_US', 'pt_BR')
 */
export const getLocale = () => {
  const config = getLiferayConfig();
  return config.locale;
};

/**
 * Checks if the user is signed in
 *
 * @returns {boolean} True if user is signed in
 */
export const isUserSignedIn = () => {
  const config = getLiferayConfig();
  return config.isSignedIn;
};

export default {
  getLiferayConfig,
  getAuthToken,
  getApiBaseURL,
  getLocale,
  isUserSignedIn,
};
