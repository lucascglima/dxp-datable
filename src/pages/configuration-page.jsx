/**
 * Configuration Page
 *
 * Visual no-code interface for configuring the DxpTable component.
 * Allows users to set up API endpoints, columns, and pagination without code.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Steps,
  Button,
  Space,
  message,
  Typography,
  Divider,
  Modal,
} from 'antd';
import {
  ApiOutlined,
  TableOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  EyeOutlined,
  SaveOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import ApiConfigSection from '../components/configuration-form/api-config-section';
import ColumnsConfigSection from '../components/configuration-form/columns-config-section';
import PaginationConfigSection from '../components/configuration-form/pagination-config-section';
import EventsConfigSection from '../components/configuration-form/events-config.section';
import PreviewSection from '../components/configuration-form/preview-section';
import {
  saveConfiguration,
  loadConfiguration,
  clearConfiguration,
  getExampleConfiguration,
} from '../services/config-storage';
import { validateUrl } from '../utils/api-validator';

const { Title, Paragraph } = Typography;

const ConfigurationPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState({
    apiEndpoint: '',
    authToken: '',
    urlParams: [], // URL path variables like :version, :userId
    defaultQueryParams: [], // Default query params with enabled flag
    testQueryParams: [], // Test query params (saved for convenience)
    columns: [],
    pagination: {
      pageSize: 20,
      showPagination: true,
    },
    responseDataPath: null, // Optional response mapping configuration
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
  });

  /**
   * Load existing configuration on mount
   */
  useEffect(() => {
    const existing = loadConfiguration();
    if (existing) {
      // Ensure events property exists (backward compatibility)
      const configWithEvents = {
        ...existing,
        events: existing.events || {
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
      };

      // Ensure sorting exists in events (backward compatibility)
      if (configWithEvents.events && !configWithEvents.events.sorting) {
        configWithEvents.events.sorting = {
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
      }

      setConfig(configWithEvents);
      message.info('Loaded existing configuration');
    }
  }, []);

  /**
   * Handles API configuration change
   */
  const handleApiConfigChange = (apiConfig) => {
    setConfig({
      ...config,
      apiEndpoint: apiConfig.apiEndpoint,
      authToken: apiConfig.authToken,
      urlParams: apiConfig.urlParams || [],
      defaultQueryParams: apiConfig.defaultQueryParams || [],
    });
  };

  /**
   * Handles test query params change
   */
  const handleTestQueryParamsChange = (testQueryParams) => {
    setConfig({
      ...config,
      testQueryParams,
    });
  };

  /**
   * Handles columns configuration change
   */
  const handleColumnsChange = (columns) => {
    setConfig({
      ...config,
      columns,
    });
  };

  /**
   * Handles pagination configuration change
   */
  const handlePaginationChange = (pagination) => {
    setConfig({
      ...config,
      pagination,
    });
  };

  /**
   * Handles events configuration change
   */
  const handleEventsChange = (events) => {
    setConfig({
      ...config,
      events,
    });
  };

  /**
   * Handles response mapping configuration change
   */
  const handleResponseMappingChange = (responseDataPath) => {
    setConfig({
      ...config,
      responseDataPath,
    });
  };

  /**
   * Applies suggested columns from preview
   */
  const handleSuggestColumns = (suggestedColumns) => {
    setConfig({
      ...config,
      columns: suggestedColumns,
    });
    message.success(`Applied ${suggestedColumns.length} suggested columns`);
    setCurrentStep(2); // Move to columns step
  };

  /**
   * Validates current configuration
   */
  const validateConfiguration = () => {
    const errors = [];

    // Validate API endpoint
    const urlValidation = validateUrl(config.apiEndpoint);
    if (!urlValidation.valid) {
      errors.push('Valid API endpoint is required');
    }

    // Validate columns
    if (config.columns.length === 0) {
      errors.push('At least one column must be configured');
    }

    config.columns.forEach((col, index) => {
      if (!col.title || !col.title.trim()) {
        errors.push(`Column ${index + 1}: Title is required`);
      }
      if (!col.dataIndex || !col.dataIndex.trim()) {
        errors.push(`Column ${index + 1}: Data field is required`);
      }
    });

    return errors;
  };

  /**
   * Saves configuration and navigates to datatable
   */
  const handleSaveConfiguration = () => {
    const errors = validateConfiguration();

    if (errors.length > 0) {
      Modal.error({
        title: 'Configuration Incomplete',
        content: (
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        ),
      });
      return;
    }

    const success = saveConfiguration(config);

    if (success) {
      message.success('✅ Configuration saved successfully! Redirecting...', 2);
      setTimeout(() => {
        navigate('/datatable');
      }, 1000);
    } else {
      message.error('Failed to save configuration');
    }
  };

  /**
   * Clears all configuration
   */
  const handleClearAll = () => {
    Modal.confirm({
      title: 'Clear All Configuration?',
      content: 'This will remove all your current settings. This action cannot be undone.',
      okText: 'Yes, Clear All',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        clearConfiguration();
        setConfig({
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
        });
        setCurrentStep(0);
        message.success('Configuration cleared');
      },
    });
  };

  /**
   * Loads example configuration
   */
  const handleLoadExample = () => {
    const example = getExampleConfiguration();
    setConfig(example);
    message.success('Example configuration loaded');
  };

  const steps = [
    {
      title: 'API Setup',
      icon: <ApiOutlined />,
      content: (
        <ApiConfigSection
          value={{
            apiEndpoint: config.apiEndpoint,
            authToken: config.authToken,
            urlParams: config.urlParams,
            defaultQueryParams: config.defaultQueryParams,
          }}
          onChange={handleApiConfigChange}
        />
      ),
    },
    {
      title: 'Preview & Test',
      icon: <EyeOutlined />,
      content: (
        <PreviewSection
          apiEndpoint={config.apiEndpoint}
          authToken={config.authToken}
          urlParams={config.urlParams}
          defaultQueryParams={config.defaultQueryParams}
          testQueryParams={config.testQueryParams}
          onTestQueryParamsChange={handleTestQueryParamsChange}
          onSuggestColumns={handleSuggestColumns}
          onResponseMappingChange={handleResponseMappingChange}
        />
      ),
    },
    {
      title: 'Columns',
      icon: <TableOutlined />,
      content: (
        <ColumnsConfigSection
          value={config.columns}
          onChange={handleColumnsChange}
        />
      ),
    },
    {
      title: 'Pagination',
      icon: <SettingOutlined />,
      content: (
        <PaginationConfigSection
          value={config.pagination}
          onChange={handlePaginationChange}
        />
      ),
    },
    {
      title: 'Events',
      icon: <ThunderboltOutlined />,
      content: (
        <EventsConfigSection
          value={config.events}
          onChange={handleEventsChange}
        />
      ),
    },
    
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <div>
            <Title level={2}>Configure Your DataTable</Title>
            <Paragraph type="secondary">
              Set up your data table in 5 easy steps. No coding required!
            </Paragraph>
          </div>

          {/* Steps Navigation */}
          <Steps
            current={currentStep}
            onChange={setCurrentStep}
            items={steps.map((step) => ({
              title: step.title,
              icon: step.icon,
            }))}
          />

          <Divider />

          {/* Current Step Content */}
          <div style={{ minHeight: '400px' }}>{steps[currentStep].content}</div>

          <Divider />

          {/* Navigation & Actions */}
          <Space
            direction="horizontal"
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            <Space>
              <Button onClick={handleLoadExample}>Load Example</Button>
              <Button danger icon={<ClearOutlined />} onClick={handleClearAll}>
                Clear All
              </Button>
            </Space>

            <Space>
              {currentStep > 0 && (
                <Button onClick={() => setCurrentStep(currentStep - 1)}>
                  Previous
                </Button>
              )}
              {currentStep < steps.length - 1 && (
                <Button type="primary" onClick={() => setCurrentStep(currentStep + 1)}>
                  Next
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSaveConfiguration}
                  size="large"
                >
                  Save Configuration & View Table
                </Button>
              )}
            </Space>
          </Space>
        </Space>
      </Card>
    </div>
  );
};

export default ConfigurationPage;
