/**
 * PropTypes for Dynamic Parameters Components
 */

import PropTypes from 'prop-types';

/**
 * PropTypes for Search Input Parameter
 */
export const searchInputParamPropTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  debounceMs: PropTypes.number,
  disabled: PropTypes.bool,
  style: PropTypes.object,
};

/**
 * PropTypes for Dynamic Params Configuration
 */
export const dynamicParamsConfigPropTypes = {
  value: PropTypes.shape({
    searchInput: PropTypes.shape({
      enabled: PropTypes.bool,
      queryParamName: PropTypes.string,
      placeholder: PropTypes.string,
      currentValue: PropTypes.string,
    }),
    // Future parameter types will be added here
    // dateRange: PropTypes.shape({ ... }),
    // tabSelector: PropTypes.shape({ ... }),
  }),
  onChange: PropTypes.func.isRequired,
};

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
  searchInputParamPropTypes,
  dynamicParamsConfigPropTypes,
  defaultDynamicParamsConfig,
};
