/**
 * Render Config Form Component
 *
 * Dynamic form for renderer-specific configuration.
 * Extracted from columns-config-section.jsx.
 */

import { Form, Input, Checkbox, Select } from 'antd';

const { Option } = Select;

const RenderConfigForm = ({ renderType, config, fields, onConfigChange }) => {
  /**
   * Renders configuration field based on type
   */
  const renderField = (field) => {
    // Check if field should be shown (conditional rendering)
    if (field.showWhen && !field.showWhen(config)) {
      return null;
    }

    // Render based on field type
    switch (field.type) {
      case 'text':
        return (
          <Form.Item key={field.name} label={field.label} help={field.helpText}>
            <Input
              value={config[field.name] ?? field.defaultValue}
              onChange={(e) => onConfigChange(field.name, e.target.value)}
              placeholder={field.placeholder}
            />
          </Form.Item>
        );

      case 'checkbox':
        return (
          <Form.Item key={field.name} help={field.helpText}>
            <Checkbox
              checked={config[field.name] ?? field.defaultValue}
              onChange={(e) => onConfigChange(field.name, e.target.checked)}
            >
              {field.label}
            </Checkbox>
          </Form.Item>
        );

      case 'select':
        return (
          <Form.Item key={field.name} label={field.label} help={field.helpText}>
            <Select
              value={config[field.name] ?? field.defaultValue}
              onChange={(value) => onConfigChange(field.name, value)}
              placeholder={field.placeholder}
            >
              {field.options?.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );

      default:
        return null;
    }
  };

  if (!fields || fields.length === 0) {
    return null;
  }

  return <>{fields.map((field) => renderField(field))}</>;
};

export default RenderConfigForm;
