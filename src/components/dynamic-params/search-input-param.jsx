/**
 * Search Input Parameter Component
 *
 * A search input with debounce functionality for filtering table data.
 * Waits 1 second after user stops typing before emitting the value change.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const { Search } = Input;

const SearchInputParam = ({
  value = '',
  onChange = () => {},
  placeholder = 'Search...',
  debounceMs = 1000,
  disabled = false,
  style = {},
}) => {
  const [localValue, setLocalValue] = useState(value);
  const debounceTimerRef = useRef(null);

  /**
   * Sync local value with prop value when it changes externally
   */
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  /**
   * Handles input change with debounce
   */
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer to emit change after debounce period
    debounceTimerRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounceMs);
  };

  /**
   * Handles search button click - emit immediately without debounce
   */
  const handleSearch = (searchValue) => {
    // Clear any pending debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    onChange(searchValue);
  };

  /**
   * Cleanup timer on unmount
   */
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <Search
      placeholder={placeholder}
      prefix={<SearchOutlined />}
      value={localValue}
      onChange={handleInputChange}
      onSearch={handleSearch}
      disabled={disabled}
      allowClear
      style={{
        width: '100%',
        maxWidth: '400px',
        ...style,
      }}
    />
  );
};

SearchInputParam.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  debounceMs: PropTypes.number,
  disabled: PropTypes.bool,
  style: PropTypes.object,
};

export default SearchInputParam;
