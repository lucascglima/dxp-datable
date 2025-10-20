/**
 * Pagination Configuration Section
 *
 * Form section for configuring table pagination settings.
 * Supports multiple pagination modes: disabled, client-side (auto), and API-based.
 */

import { Form, Select, Checkbox, Alert, Space, Radio, Input, Divider } from 'antd';
import { SettingOutlined, ApiOutlined, ThunderboltOutlined } from '@ant-design/icons';

const { Option } = Select;

const PaginationConfigSection = ({ value = {}, onChange }) => {
  const defaultPagination = {
    pageSize: 20,
    showPagination: true,
    mode: 'api', // 'api' | 'client'
    apiParamNames: {
      page: '_page',
      pageSize: '_page_size',
    },
    ...value,
  };

  /**
   * Handles page size change
   */
  const handlePageSizeChange = (pageSize) => {
    onChange({
      ...defaultPagination,
      pageSize,
    });
  };

  /**
   * Handles show pagination toggle
   */
  const handleShowPaginationChange = (e) => {
    onChange({
      ...defaultPagination,
      showPagination: e.target.checked,
    });
  };

  /**
   * Handles pagination mode change
   */
  const handleModeChange = (e) => {
    onChange({
      ...defaultPagination,
      mode: e.target.value,
    });
  };

  /**
   * Handles API parameter name changes
   */
  const handleParamNameChange = (field, value) => {
    onChange({
      ...defaultPagination,
      apiParamNames: {
        ...defaultPagination.apiParamNames,
        [field]: value,
      },
    });
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="Pagination Settings"
        description="Configure pagination behavior: disable it, use client-side pagination, or send pagination parameters to your API."
        type="info"
        showIcon
        icon={<SettingOutlined />}
      />

      {/* Show Pagination Toggle */}
      <Form.Item help="Uncheck to hide pagination controls and show all items in a single page">
        <Checkbox
          checked={defaultPagination.showPagination}
          onChange={handleShowPaginationChange}
        >
          Show pagination controls
        </Checkbox>
      </Form.Item>

      {/* Show additional options only if pagination is enabled */}
      {defaultPagination.showPagination && (
        <>
          <Divider orientation="left">Pagination Mode</Divider>

          {/* Pagination Mode */}
          <Form.Item
            label="Pagination Mode"
            help="Choose how pagination is handled"
          >
            <Radio.Group
              value={defaultPagination.mode}
              onChange={handleModeChange}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Radio value="api">
                  <Space>
                    <ApiOutlined />
                    <strong>API Pagination</strong>
                    <span style={{ color: '#8c8c8c' }}>
                      - Send page parameters to API (server-side)
                    </span>
                  </Space>
                </Radio>
                <Radio value="client">
                  <Space>
                    <ThunderboltOutlined />
                    <strong>Auto Pagination (Client-side)</strong>
                    <span style={{ color: '#8c8c8c' }}>
                      - Load all data once, paginate in browser
                    </span>
                  </Space>
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          {/* Items per Page */}
          <Form.Item
            label="Items per Page"
            help="Number of rows to display on each page"
          >
            <Select
              value={defaultPagination.pageSize}
              onChange={handlePageSizeChange}
              size="large"
              style={{ width: '100%' }}
            >
              <Option value={10}>10 items</Option>
              <Option value={20}>20 items</Option>
              <Option value={50}>50 items</Option>
              <Option value={100}>100 items</Option>
            </Select>
          </Form.Item>

          {/* API Parameter Names - Only show if mode is 'api' */}
          {defaultPagination.mode === 'api' && (
            <>
              <Divider orientation="left">API Parameters</Divider>

              <Alert
                message="Custom API Parameter Names"
                description="Configure the query parameter names that will be sent to your API for pagination."
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Form.Item
                label="Page Parameter Name"
                help="Query parameter name for page number (e.g., ?_page=1)"
              >
                <Input
                  value={defaultPagination.apiParamNames?.page || '_page'}
                  onChange={(e) => handleParamNameChange('page', e.target.value)}
                  placeholder="_page"
                  size="large"
                  prefix={<ApiOutlined />}
                />
              </Form.Item>

              <Form.Item
                label="Page Size Parameter Name"
                help="Query parameter name for page size (e.g., ?_page_size=20)"
              >
                <Input
                  value={defaultPagination.apiParamNames?.pageSize || '_page_size'}
                  onChange={(e) => handleParamNameChange('pageSize', e.target.value)}
                  placeholder="_page_size"
                  size="large"
                  prefix={<ApiOutlined />}
                />
              </Form.Item>

              <Alert
                message={`Example API Call: ${defaultPagination.apiParamNames?.page || '_page'}=1&${defaultPagination.apiParamNames?.pageSize || '_page_size'}=${defaultPagination.pageSize}`}
                type="success"
                showIcon
              />
            </>
          )}

          {/* Client-side mode info */}
          {defaultPagination.mode === 'client' && (
            <Alert
              message="Client-side Pagination Active"
              description="All data will be loaded from the API once. Pagination will be handled in the browser for better performance."
              type="success"
              showIcon
            />
          )}
        </>
      )}

      {/* Warning when pagination is disabled */}
      {!defaultPagination.showPagination && (
        <Alert
          message="Pagination Disabled"
          description="All items will be displayed on a single page without pagination controls. The API will be called without pagination parameters to fetch all data."
          type="warning"
          showIcon
        />
      )}

      {/* Warning for large page sizes */}
      {defaultPagination.showPagination && defaultPagination.pageSize > 50 && (
        <Alert
          message="Large Page Size"
          description="Displaying many items per page may affect page performance."
          type="info"
          showIcon
        />
      )}
    </Space>
  );
};

export default PaginationConfigSection;