/**
 * Dynamic Parameters Configuration Section
 *
 * Form section for configuring dynamic search and filter parameters.
 * Provides UI for enabling/disabling search input and other dynamic filters.
 */

import React from 'react';
import { Form, Switch, Alert, Space, Typography, Input, Card, Divider } from 'antd';
import { SearchOutlined, FilterOutlined, CalendarOutlined } from '@ant-design/icons';
import { SearchInputParam } from '../dynamic-params';
import { defaultDynamicParamsConfig } from '../dynamic-params/dynamic-params.types';

const { Text, Paragraph } = Typography;

const DynamicParamsConfigSection = ({ value = {}, onChange }) => {
  // Merge with default config to ensure all fields exist
  const currentConfig = {
    ...defaultDynamicParamsConfig,
    ...value,
    searchInput: {
      ...defaultDynamicParamsConfig.searchInput,
      ...(value?.searchInput || {}),
    },
  };

  /**
   * Handles search input enable/disable toggle
   */
  const handleSearchInputToggle = (enabled) => {
    onChange({
      ...currentConfig,
      searchInput: {
        ...currentConfig.searchInput,
        enabled,
      },
    });
  };

  /**
   * Handles query param name change
   */
  const handleQueryParamNameChange = (e) => {
    const queryParamName = e.target.value;
    onChange({
      ...currentConfig,
      searchInput: {
        ...currentConfig.searchInput,
        queryParamName,
      },
    });
  };

  /**
   * Handles placeholder change
   */
  const handlePlaceholderChange = (e) => {
    const placeholder = e.target.value;
    onChange({
      ...currentConfig,
      searchInput: {
        ...currentConfig.searchInput,
        placeholder,
      },
    });
  };

  /**
   * Loads example configuration
   */
  const handleLoadExample = () => {
    onChange({
      ...currentConfig,
      searchInput: {
        enabled: true,
        queryParamName: 'search',
        placeholder: 'Search by name, email or phone...',
        currentValue: '',
      },
    });
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="Dynamic Parameters Configuration"
        description="Configure dynamic search and filter parameters that appear above your table. These parameters allow users to filter data in real-time."
        type="info"
        showIcon
        icon={<FilterOutlined />}
      />

      {/* Search Input Parameter Section */}
      <Card
        title={
          <Space>
            <SearchOutlined />
            <Text strong>Search Input</Text>
          </Space>
        }
        extra={
          <Switch
            checked={currentConfig.searchInput?.enabled || false}
            onChange={handleSearchInputToggle}
            checkedChildren="Enabled"
            unCheckedChildren="Disabled"
          />
        }
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            Add a search input above the table. The search value will be sent to your API as a query parameter after the user stops typing (1 second delay).
          </Paragraph>

          {currentConfig.searchInput?.enabled && (
            <>
              <Form.Item
                label="Query Parameter Name"
                help="The name of the query parameter that will be sent to your API (e.g., 'search', 'q', 'filter')"
                required
              >
                <Input
                  value={currentConfig.searchInput?.queryParamName || ''}
                  onChange={handleQueryParamNameChange}
                  placeholder="search"
                  
                />
              </Form.Item>

              <Form.Item
                label="Placeholder Text"
                help="The placeholder text shown in the search input"
              >
                <Input
                  value={currentConfig.searchInput?.placeholder || ''}
                  onChange={handlePlaceholderChange}
                  placeholder="Search..."
                />
              </Form.Item>

              <Divider orientation="left">
                <Text type="secondary" style={{ fontSize: '13px' }}>
                  Preview
                </Text>
              </Divider>

              <SearchInputParam
                placeholder={currentConfig.searchInput?.placeholder || 'Search...'}
                disabled
                style={{ width: '100%' }}
              />

              <Alert
                message="How it works"
                description={
                  <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                    <li>
                      User types in the search input above the table
                    </li>
                    <li>
                      After 1 second of no typing, the search value is sent to your API
                    </li>
                    <li>
                      API receives: <code>?{currentConfig.searchInput?.queryParamName}=search_value</code>
                    </li>
                    <li>
                      The search value is saved in localStorage and restored on page reload
                    </li>
                  </ul>
                }
                type="info"
                showIcon
              />

              <div style={{ display: 'flex', gap: '8px' }}>
                <a onClick={handleLoadExample} style={{ fontSize: '13px' }}>
                  Load Example Configuration
                </a>
              </div>
            </>
          )}

          {!currentConfig.searchInput?.enabled && (
            <Alert
              message="Search input is disabled"
              description="Enable the switch above to configure a search input that will appear above your table."
              type="warning"
              showIcon
            />
          )}
        </Space>
      </Card>

      {/* Future Parameters Placeholder */}
      <Card
        title={
          <Space>
            <CalendarOutlined />
            <Text strong>More Parameters Coming Soon</Text>
          </Space>
        }
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            Future versions will support additional dynamic parameters:
          </Paragraph>
          <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
            <li>
              <Text disabled>Date Range Picker - Filter by date ranges</Text>
            </li>
            <li>
              <Text disabled>Tab Selector - Filter by category tabs</Text>
            </li>
            <li>
              <Text disabled>Dropdown Filters - Single or multiple select dropdowns</Text>
            </li>
            <li>
              <Text disabled>Custom Parameters - Define your own parameter types</Text>
            </li>
          </ul>
        </Space>
      </Card>
    </Space>
  );
};

export default DynamicParamsConfigSection;
