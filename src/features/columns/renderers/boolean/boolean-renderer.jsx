/**
 * Boolean Renderer - Render Logic
 *
 * Converts boolean values to custom text strings.
 * Example: true -> "Sim", false -> "Não"
 */

import React from 'react';
import { Tag } from 'antd';
import { defaultBooleanConfig } from './boolean-config';

/**
 * Renders a boolean value as custom text
 *
 * @param {boolean|string|number} value - Value to render (accepts truthy/falsy values)
 * @param {Object} config - Renderer configuration
 * @param {string} config.trueText - Text to show when value is true
 * @param {string} config.falseText - Text to show when value is false
 * @param {boolean} config.showAsTag - Whether to render as Ant Design Tag
 * @param {string} config.trueColor - Color for true tag
 * @param {string} config.falseColor - Color for false tag
 * @param {Object} record - Full data record (optional, for advanced use)
 * @returns {React.Element|string} Rendered value
 */
export const renderBoolean = (value, config = {}, record = null) => {
  // Merge with default config
  const finalConfig = { ...defaultBooleanConfig, ...config };

  // Determine boolean value (handle various types)
  let boolValue;
  if (typeof value === 'boolean') {
    boolValue = value;
  } else if (typeof value === 'string') {
    // Handle string representations of boolean
    boolValue = value.toLowerCase() === 'true' || value === '1';
  } else if (typeof value === 'number') {
    boolValue = value !== 0;
  } else {
    // Handle null, undefined, etc as false
    boolValue = false;
  }

  // Get text to display
  const text = boolValue ? finalConfig.trueText : finalConfig.falseText;

  // Render as tag or plain text
  if (finalConfig.showAsTag) {
    const color = boolValue ? finalConfig.trueColor : finalConfig.falseColor;
    return <Tag color={color}>{text}</Tag>;
  }

  return text;
};
