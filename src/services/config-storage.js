/**
 * Configuration Storage Service
 *
 * Manages table configuration persistence in localStorage.
 * Provides simple interface for save/load/clear operations.
 */

const CONFIG_KEY = 'dxp-table-configuration';

/**
 * Saves table configuration to localStorage
 *
 * @param {Object} config - Configuration object
 * @returns {boolean} Success status
 */
export const saveConfiguration = (config) => {
  try {
    const configWithTimestamp = {
      ...config,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(CONFIG_KEY, JSON.stringify(configWithTimestamp));
    return true;
  } catch (error) {
    console.error('Error saving configuration:', error);
    return false;
  }
};

/**
 * Loads table configuration from localStorage
 *
 * @returns {Object|null} Configuration object or null if not found
 */
export const loadConfiguration = () => {
  try {
    const stored = localStorage.getItem(CONFIG_KEY);
    if (!stored) {
      return null;
    }

    const config = JSON.parse(stored);
    return config;
  } catch (error) {
    console.error('Error loading configuration:', error);
    return null;
  }
};

/**
 * Clears table configuration from localStorage
 *
 * @returns {boolean} Success status
 */
export const clearConfiguration = () => {
  try {
    localStorage.removeItem(CONFIG_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing configuration:', error);
    return false;
  }
};

/**
 * Checks if a configuration exists in localStorage
 *
 * @returns {boolean} True if configuration exists
 */
export const hasConfiguration = () => {
  try {
    const stored = localStorage.getItem(CONFIG_KEY);
    return stored !== null && stored !== undefined;
  } catch (error) {
    console.error('Error checking configuration:', error);
    return false;
  }
};

/**
 * Updates only specific fields in the configuration
 *
 * @param {Object} updates - Partial configuration to update
 * @returns {boolean} Success status
 */
export const updateConfiguration = (updates) => {
  try {
    const current = loadConfiguration();
    if (!current) {
      return saveConfiguration(updates);
    }

    const updated = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return saveConfiguration(updated);
  } catch (error) {
    console.error('Error updating configuration:', error);
    return false;
  }
};

/**
 * Gets an example configuration for demonstration
 *
 * @returns {Object} Example configuration
 */
export const getExampleConfiguration = () => {
  return {
    apiEndpoint: 'https://jsonplaceholder.typicode.com/users',
    authToken: '',
    urlParams: [], // No URL params in this example (no :variables in URL)
    defaultQueryParams: [], // No default query params for this simple example
    testQueryParams: [ // Pre-filled test params for convenience
      { key: '_page', value: '1' },
      { key: '_limit', value: '10' }
    ],
    columns: [
      {
        key: 'id',
        title: 'ID',
        dataIndex: 'id',
        sortable: true,
        clickable: false,
        width: 80,
      },
      {
        key: 'name',
        title: 'Name',
        dataIndex: 'name',
        sortable: true,
        clickable: true,
      },
      {
        key: 'email',
        title: 'Email',
        dataIndex: 'email',
        sortable: true,
        clickable: true,
      },
      {
        key: 'phone',
        title: 'Phone',
        dataIndex: 'phone',
        sortable: false,
        clickable: false,
      },
    ],
    pagination: {
      pageSize: 20,
      showPagination: true,
      mode: 'api', // 'api' = server-side pagination | 'client' = client-side pagination
      apiParamNames: {
        page: '_page',
        pageSize: '_page_size',
      },
    },
    responseDataPath: null, // null = direct array response, or { dataKey: 'data.items', totalKey: 'data.total', totalSource: 'body' }
    events: {
      onRowClick: {
        enabled: true,
        code: `// Example: Show user details in alert
alert('User Details:\\n\\nName: ' + record.name + '\\nEmail: ' + record.email + '\\nPhone: ' + record.phone);

// Also log to console
console.log('User clicked:', record);`,
      },
      sorting: {
        mode: 'server', // 'server' | 'client' | 'disabled'
        serverConfig: {
          columnParam: '_columnSort',
          orderParam: '_sort',
          orderFormat: 'numeric',
          orderValues: {
            ascend: '1',
            descend: '-1',
          },
        },
      },
    },
  };
};

export default {
  saveConfiguration,
  loadConfiguration,
  clearConfiguration,
  hasConfiguration,
  updateConfiguration,
  getExampleConfiguration,
};
