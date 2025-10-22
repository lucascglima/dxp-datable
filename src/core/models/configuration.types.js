/**
 * Configuration Types and Constants
 *
 * Centralized type definitions and default values for the configuration system.
 */

/**
 * Default configuration structure
 */
export const DEFAULT_CONFIGURATION = {
  apiEndpoint: '',
  authToken: '',
  urlParams: [],
  defaultQueryParams: [],
  testQueryParams: [],
  columns: [],
  pagination: {
    pageSize: 20,
    showPagination: true,
  },
  responseDataPath: null,
  events: {
    onRowClick: {
      enabled: false,
      code: "console.log('Row clicked:', record);",
    },
    sorting: {
      mode: 'server',
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
  dynamicParams: {
    searchInput: {
      enabled: false,
      queryParamName: 'search',
      placeholder: 'Search...',
      currentValue: '',
    },
  },
};

/**
 * Default column structure
 */
export const DEFAULT_COLUMN = {
  id: '',
  key: '',
  title: '',
  dataIndex: '',
  sortable: false,
  sortField: undefined,
  clickable: false,
  width: undefined,
  icon: undefined,
  iconClickable: false,
  render: {
    type: 'default',
    config: {},
  },
};

/**
 * Default sorting configuration
 */
export const DEFAULT_SORTING_CONFIG = {
  mode: 'server',
  serverConfig: {
    columnParam: '_columnSort',
    orderParam: '_sort',
    orderFormat: 'numeric',
    orderValues: {
      ascend: '1',
      descend: '-1',
    },
  },
};

/**
 * Default row click event configuration
 */
export const DEFAULT_ROW_CLICK_EVENT = {
  enabled: false,
  code: "console.log('Row clicked:', record);",
};

/**
 * Default dynamic search input configuration
 */
export const DEFAULT_SEARCH_INPUT = {
  enabled: false,
  queryParamName: 'search',
  placeholder: 'Search...',
  currentValue: '',
};

/**
 * Sorting modes
 */
export const SORTING_MODES = {
  SERVER: 'server',
  CLIENT: 'client',
  DISABLED: 'disabled',
};

/**
 * Order formats for server-side sorting
 */
export const ORDER_FORMATS = {
  NUMERIC: 'numeric',
  ASC_DESC: 'asc-desc',
};

/**
 * Renderer types
 */
export const RENDERER_TYPES = {
  DEFAULT: 'default',
  BOOLEAN: 'boolean',
  DATE: 'date',
  CUSTOM: 'custom',
};

/**
 * Configuration validation error types
 */
export const VALIDATION_ERROR_TYPES = {
  MISSING_FIELD: 'MISSING_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  DUPLICATE_KEY: 'DUPLICATE_KEY',
  INVALID_VALUE: 'INVALID_VALUE',
};

/**
 * Creates a new column with default values
 * @param {Object} overrides - Properties to override defaults
 * @returns {Object} New column object
 */
export const createNewColumn = (overrides = {}) => {
  const timestamp = Date.now();
  return {
    ...DEFAULT_COLUMN,
    id: `col_${timestamp}`,
    key: `column_${timestamp}`,
    ...overrides,
  };
};

/**
 * Creates default configuration with backward compatibility support
 * @param {Object} existing - Existing configuration to merge
 * @returns {Object} Complete configuration with defaults
 */
export const createConfiguration = (existing = {}) => {
  return {
    ...DEFAULT_CONFIGURATION,
    ...existing,
    events: {
      ...DEFAULT_CONFIGURATION.events,
      ...(existing.events || {}),
      sorting: {
        ...DEFAULT_CONFIGURATION.events.sorting,
        ...(existing.events?.sorting || {}),
      },
    },
    dynamicParams: {
      ...DEFAULT_CONFIGURATION.dynamicParams,
      ...(existing.dynamicParams || {}),
    },
    pagination: {
      ...DEFAULT_CONFIGURATION.pagination,
      ...(existing.pagination || {}),
    },
  };
};
