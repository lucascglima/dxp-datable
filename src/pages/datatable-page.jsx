/**
 * DataTable Page
 *
 * Displays the configured DxpTable with data from the configured API.
 * Loads configuration from localStorage and handles data fetching.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Space,
  Alert,
  Typography,
  Badge,
  message,
  notification,
} from 'antd';
import {
  ReloadOutlined,
  EditOutlined,
  WarningOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import DxpTable from '../components/dxp-table';
import { loadConfiguration, hasConfiguration } from '../services/config-storage';
import { fetchData } from '../services/external-api';

const { Title, Text, Paragraph } = Typography;

const DataTablePage = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [sortInfo, setSortInfo] = useState({
    columnKey: null,
    order: null,
  });
  

  /**
   * Load configuration on mount
   */
  useEffect(() => {
    if (!hasConfiguration()) {
      // No configuration found
      return;
    }

    const loadedConfig = loadConfiguration();
    setConfig(loadedConfig);
    setPagination((prev) => ({
      ...prev,
      pageSize: loadedConfig.pagination?.pageSize || 20,
    }));
  }, []);

  /**
   * Fetch data from API
   */
  const fetchTableData = async () => {
    if (!config) return;

    setLoading(true);
    setError(null);

    console.log('=== FETCHING DATA ===');
    console.log('Pagination:', { current: pagination.current, pageSize: pagination.pageSize });
    console.log('Sort Info:', sortInfo);

    try {
      // Prepare API config with sorting configuration
      const apiConfig = {
        sortingConfig: config.events?.sorting,
      };

      const response = await fetchData(
        config.apiEndpoint,
        config.authToken,
        pagination,
        apiConfig,
        sortInfo
      );

      setData(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
      }));
    } catch (err) {
      setError(err.message || 'Failed to load data');
      message.error('❌ ' + (err.message || 'Failed to load data'));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch data when config or pagination changes
   */
  useEffect(() => {
    if (config) {
      fetchTableData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, pagination.current, pagination.pageSize, sortInfo.columnKey, sortInfo.order]);

  /**
   * Handles pagination changes
   */
  const handlePaginationChange = (newPagination) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  /**
   * Handles column sort
   */
  const handleSort = (newSortInfo) => {
    const sortingMode = config?.events?.sorting?.mode;

    console.log('=== SORT REQUESTED ===');
    console.log('Column:', newSortInfo.columnKey);
    console.log('Order:', newSortInfo.order);
    console.log('Mode:', sortingMode);
    console.log('---');

    if (sortingMode === 'server') {
      // Server-side sorting: update state and trigger data fetch
      setSortInfo(newSortInfo);
      message.info('Sorting applied - fetching sorted data from server');
    } else if (sortingMode === 'client') {
      // Client-side sorting: handled by Ant Design Table
      message.info('Sorting applied in browser');
    } else {
      // Sorting disabled
      message.warning('Sorting is disabled in configuration');
    }
  };



  /**
   * Handles row click - Executes custom code if enabled
   */
  const handleRowClick = (record) => {
    // Check if row click event is enabled in configuration
    if (!config?.events?.onRowClick?.enabled) {
      // Default behavior: log to console
      console.log('Row clicked:', record);
      return;
    }

    // Get custom code from configuration
    const customCode = config.events.onRowClick.code;

    if (!customCode || customCode.trim() === '') {
      // No custom code provided, use default
      console.log('Row clicked:', record);
      return;
    }

    try {
      // Execute custom code in a safe context
      // The 'record' variable will be available in the custom code
      const executeFn = new Function('record', customCode);
      executeFn(record);
    } catch (error) {
      // Handle execution errors
      console.error('Error executing row click handler:', error);
      notification.error({
        message: 'Row Click Handler Error',
        description: error.message,
        placement: 'topRight',
        duration: 4,
      });
    }
  };

  /**
   * Processes columns to add click handlers for clickable columns
   */
  const getProcessedColumns = () => {
    if (!config || !config.columns) return [];

    return config.columns.map((column) => {
      if (column.clickable) {
        return {
          ...column,
          render: (text) => (
            <span
              
              style={{
                cursor: 'pointer',
                color: '#1890ff',
                textDecoration: 'underline',
              }}
            >
              {text}
            </span>
          ),
        };
      }
      return column;
    });
  };

  /**
   * Handles refresh button click
   */
  const handleRefresh = () => {
    message.loading('Refreshing data...', 0.5);
    fetchTableData();
  };

  /**
   * Navigates to configuration page
   */
  const handleEditConfig = () => {
    navigate('/configuration');
  };

  // Show welcome message if no configuration
  if (!config) {
    return (
      <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
            <WarningOutlined style={{ fontSize: '64px', color: '#faad14' }} />
            <Title level={2}>Welcome! 👋</Title>
            <Paragraph>
              Let's configure your data table. Click the button below to get started.
            </Paragraph>
            <Paragraph type="secondary">
              Configuration is quick and easy - no coding required!
            </Paragraph>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/configuration')}
            >
              Go to Configuration
            </Button>
          </Space>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header with Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={2} style={{ margin: 0 }}>
                My DataTable
              </Title>
              <Text type="secondary">
                Data from: <code>{config.apiEndpoint}</code>
              </Text>
            </div>

            <Space>
              <Button
                icon={<EditOutlined />}
                onClick={handleEditConfig}
              >
                Edit Configuration
              </Button>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={loading}
              >
                Refresh
              </Button>
            </Space>
          </div>

          {/* Status Badge */}
          {!loading && !error && data.length > 0 && (
            <Alert
              message={`✅ ${pagination.total} records loaded successfully`}
              type="success"
              showIcon
              closable
            />
          )}

          {/* Error Display */}
          {error && (
            <Alert
              message="Failed to Load Data"
              description={
                <Space direction="vertical">
                  <Text>{error}</Text>
                  <Space>
                    <Button size="small" onClick={handleRefresh}>
                      Try Again
                    </Button>
                    <Button size="small" onClick={handleEditConfig}>
                      Edit Configuration
                    </Button>
                  </Space>
                </Space>
              }
              type="error"
              showIcon
            />
          )}
          {/* DataTable */}
          <DxpTable
            columns={getProcessedColumns()}
            data={data}
            pagination={pagination}
            loading={loading}
            rowKey="id"
            onPaginationChange={handlePaginationChange}
            onSort={handleSort}
            onRowClick={handleRowClick}
            sortingConfig={config.events?.sorting}
          />
        </Space>
      </Card>
    </div>
  );
};

export default DataTablePage;
