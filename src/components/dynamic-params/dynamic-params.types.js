/**
 * PropTypes for Dynamic Parameters Components
 */

/**
 * Default configuration for dynamic parameters
 */
export const defaultDynamicParamsConfig = {
  searchInput: {
    enabled: false,
    queryParamName: 'search',
    placeholder: 'Search...',
    currentValue: '',
  },
  // Future parameter types with defaults
  // dateRange: {
  //   enabled: false,
  //   startParamName: 'startDate',
  //   endParamName: 'endDate',
  //   currentValue: { start: null, end: null },
  // },
};

export default {
  defaultDynamicParamsConfig,
};
