/**
 * Events Configuration Section
 *
 * Form section for configuring table events like row clicks.
 * Provides a code editor for custom JavaScript event handlers.
 */

import { useState } from 'react';
import { Form, Switch, Alert, Space, Typography, Input, Card, Radio, Select } from 'antd';
import { ThunderboltOutlined, CodeOutlined, SortAscendingOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

const EventsConfigSection = ({ value = {}, onChange }) => {
  const [codeError, setCodeError] = useState(null);

  // Default event configuration
  const defaultEvents = {
    onRowClick: {
      enabled: false,
      code: "console.log('Row clicked:', record);",
    },
    sorting: {
      mode: 'server', // 'server' | 'client' | 'disabled'
      serverConfig: {
        columnParam: '_columnSort',
        orderParam: '_sort',
        orderFormat: 'numeric', // 'numeric' | 'text' | 'antd'
        orderValues: {
          ascend: '1',
          descend: '-1',
        },
      },
    },
  };

  const currentEvents = value || defaultEvents;
  const sortingConfig = currentEvents.sorting || defaultEvents.sorting;

  /**
   * Handles enable/disable toggle for row click event
   */
  const handleRowClickToggle = (enabled) => {
    onChange({
      ...currentEvents,
      onRowClick: {
        ...currentEvents.onRowClick,
        enabled,
      },
    });
  };

  /**
   * Handles code change for row click event
   */
  const handleCodeChange = (e) => {
    const code = e.target.value;
    setCodeError(null);

    // Basic syntax validation
    try {
      // Test if code can be compiled as a function
      new Function('record', code);
    } catch (error) {
      setCodeError(error.message);
    }

    onChange({
      ...currentEvents,
      onRowClick: {
        ...currentEvents.onRowClick,
        code,
      },
    });
  };

  /**
   * Loads example code
   */
  const handleLoadExample = () => {
    const exampleCode = `// Access row data
console.log('User clicked:', record);

// Show alert with row data
alert('Name: ' + record.name + '\\nEmail: ' + record.email);

// You can use any JavaScript here!`;

    onChange({
      ...currentEvents,
      onRowClick: {
        ...currentEvents.onRowClick,
        code: exampleCode,
      },
    });
  };

  /**
   * Handles sorting mode change
   */
  const handleSortingModeChange = (e) => {
    const mode = e.target.value;
    onChange({
      ...currentEvents,
      sorting: {
        ...sortingConfig,
        mode,
      },
    });
  };

  /**
   * Handles server config changes
   */
  const handleServerConfigChange = (field, value) => {
    onChange({
      ...currentEvents,
      sorting: {
        ...sortingConfig,
        serverConfig: {
          ...sortingConfig.serverConfig,
          [field]: value,
        },
      },
    });
  };

  /**
   * Handles order format change
   */
  const handleOrderFormatChange = (format) => {
    let orderValues = { ascend: '1', descend: '-1' };

    if (format === 'text') {
      orderValues = { ascend: 'asc', descend: 'desc' };
    } else if (format === 'antd') {
      orderValues = { ascend: 'ascend', descend: 'descend' };
    }

    onChange({
      ...currentEvents,
      sorting: {
        ...sortingConfig,
        serverConfig: {
          ...sortingConfig.serverConfig,
          orderFormat: format,
          orderValues,
        },
      },
    });
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="Events Configuration"
        description="Configure custom event handlers for your table. Use JavaScript to define what happens when users interact with your data."
        type="info"
        showIcon
        icon={<ThunderboltOutlined />}
      />

      {/* Row Click Event Section */}
      <Card
        title={
          <Space>
            <CodeOutlined />
            <Text strong>Row Click Event</Text>
          </Space>
        }
        extra={
          <Switch
            checked={currentEvents.onRowClick?.enabled || false}
            onChange={handleRowClickToggle}
            checkedChildren="Enabled"
            unCheckedChildren="Disabled"
          />
        }
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            Define what happens when a user clicks on a table row. The row data is available
            as the <code>record</code> variable.
          </Paragraph>

          {currentEvents.onRowClick?.enabled && (
            <>
              <Form.Item
                label="JavaScript Code"
                validateStatus={codeError ? 'error' : undefined}
                help={codeError || 'Write JavaScript code to execute on row click. Variable "record" contains the row data.'}
              >
                <TextArea
                  value={currentEvents.onRowClick?.code || ''}
                  onChange={handleCodeChange}
                  placeholder="console.log('Row clicked:', record);"
                  rows={10}
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '13px',
                  }}
                />
              </Form.Item>

              <Alert
                message="Available Variables"
                description={
                  <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                    <li>
                      <code>record</code> - Object containing all data from the clicked row
                    </li>
                    <li>
                      <code>console</code> - Use console.log() to debug
                    </li>
                    <li>
                      <code>alert()</code> - Show alert dialogs
                    </li>
                  </ul>
                }
                type="info"
                showIcon
              />

              <div style={{ display: 'flex', gap: '8px' }}>
                <a onClick={handleLoadExample} style={{ fontSize: '13px' }}>
                  Load Example Code
                </a>
              </div>
            </>
          )}

          {!currentEvents.onRowClick?.enabled && (
            <Alert
              message="Row click event is disabled"
              description="Enable the switch above to configure custom row click behavior."
              type="warning"
              showIcon
            />
          )}
        </Space>
      </Card>

      {/* Sorting Configuration Section */}
      <Card
        title={
          <Space>
            <SortAscendingOutlined />
            <Text strong>Column Sorting</Text>
          </Space>
        }
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            Choose how table columns should be sorted when users click on column headers.
          </Paragraph>

          <Form.Item label="Sorting Mode">
            <Radio.Group
              value={sortingConfig.mode}
              onChange={handleSortingModeChange}
              buttonStyle="solid"
            >
              <Radio.Button value="server">Server-Side (API)</Radio.Button>
              <Radio.Button value="client">Client-Side (Browser)</Radio.Button>
              <Radio.Button value="disabled">Disabled</Radio.Button>
            </Radio.Group>
          </Form.Item>

          {sortingConfig.mode === 'server' && (
            <>
              <Alert
                message="Server-Side Sorting"
                description="Sorting parameters will be sent to your API as query parameters. Your backend must handle these parameters and return sorted data."
                type="info"
                showIcon
              />

              <Form.Item
                label="Column Parameter Name"
                help="The query parameter name for the column to sort by (e.g., 'sortBy', '_columnSort')"
              >
                <Input
                  value={sortingConfig.serverConfig.columnParam}
                  onChange={(e) => handleServerConfigChange('columnParam', e.target.value)}
                  placeholder="_columnSort"
                />
              </Form.Item>

              <Form.Item
                label="Order Parameter Name"
                help="The query parameter name for the sort order (e.g., 'order', '_sort')"
              >
                <Input
                  value={sortingConfig.serverConfig.orderParam}
                  onChange={(e) => handleServerConfigChange('orderParam', e.target.value)}
                  placeholder="_sort"
                />
              </Form.Item>

              <Form.Item
                label="Order Value Format"
                help="How the sort direction should be represented in the query"
              >
                <Select
                  value={sortingConfig.serverConfig.orderFormat}
                  onChange={handleOrderFormatChange}
                  style={{ width: '100%' }}
                >
                  <Select.Option value="numeric">
                    Numeric (1 = ascending, -1 = descending)
                  </Select.Option>
                  <Select.Option value="text">
                    Text (asc = ascending, desc = descending)
                  </Select.Option>
                  <Select.Option value="antd">
                    Ant Design (ascend = ascending, descend = descending)
                  </Select.Option>
                </Select>
              </Form.Item>

              <Alert
                message="Example Query"
                description={
                  <div>
                    <Text code>
                      ?{sortingConfig.serverConfig.columnParam}=name&
                      {sortingConfig.serverConfig.orderParam}={sortingConfig.serverConfig.orderValues.ascend}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Parameters are only added when a column is sorted. They are removed when sorting is cleared.
                    </Text>
                  </div>
                }
                type="success"
                showIcon
                style={{ marginTop: '8px' }}
              />
            </>
          )}

          {sortingConfig.mode === 'client' && (
            <Alert
              message="Client-Side Sorting"
              description="Data will be sorted directly in the browser. This works well for small datasets but may be slow for large tables. No API calls are made when sorting."
              type="info"
              showIcon
            />
          )}

          {sortingConfig.mode === 'disabled' && (
            <Alert
              message="Sorting Disabled"
              description="Users will not be able to sort columns. Column headers will not be clickable for sorting."
              type="warning"
              showIcon
            />
          )}
        </Space>
      </Card>

      {/* Future Events Placeholder */}
      <Alert
        message="More Events Coming Soon"
        description="Future versions will support additional events like cell click, double-click, hover, and more!"
        type="info"
        showIcon
      />
    </Space>
  );
};

export default EventsConfigSection;
