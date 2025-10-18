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
  const [allData, setAllData] = useState([]); // Store all data for client-side pagination
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
    showPagination: true,
    responsive: false,
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

    // Set pagination config from loaded configuration
    const paginationConfig = loadedConfig.pagination || {};
    setPagination((prev) => ({
      ...prev,
      pageSize: paginationConfig.pageSize || 20,
      showPagination: paginationConfig.showPagination !== false,
      responsive: paginationConfig.mode === 'client', // client mode = responsive pagination
    }));
  }, []);

  /**
   * Fetch data from API
   */
  const fetchTableData = async () => {
    if (!config) return;

    setLoading(true);
    setError(null);

    const paginationMode = config.pagination?.mode || 'api';
    const showPagination = config.pagination?.showPagination !== false;

    console.log('=== FETCHING DATA ===');
    console.log('Pagination Mode:', paginationMode);
    console.log('Show Pagination:', showPagination);
    console.log('Pagination:', { current: pagination.current, pageSize: pagination.pageSize });
    console.log('Sort Info:', sortInfo);

    try {
      // Prepare API config with sorting and pagination configuration
      const apiConfig = {
        sortingConfig: config.events?.sorting,
        // Use custom pagination parameter names from config if in API mode
        apiParamNames: paginationMode === 'api' ? config.pagination?.apiParamNames : undefined,
      };

      // Determine if we should send pagination params to API
      // API Mode: Send pagination params
      // Client Mode OR No Pagination: Don't send pagination params
      const enablePagination = paginationMode === 'api' && showPagination;

      const response = await fetchData(
        config.apiEndpoint,
        config.authToken,
        {
          page: pagination.current,
          pageSize: pagination.pageSize,
          enablePagination, // Controls whether to send pagination params to API
        },
        apiConfig,
        sortInfo
      );

      // Handle different pagination modes
      if (paginationMode === 'client' || !showPagination) {
        // Client-side pagination or no pagination: Store all data
        setAllData(response.data);

        if (!showPagination) {
          // No pagination: Show all data at once
          setData(response.data);
          setPagination((prev) => ({
            ...prev,
            total: response.data.length,
            current: 1,
          }));
        } else {
          // Client-side pagination: Paginate in frontend
          const startIndex = (pagination.current - 1) * pagination.pageSize;
          const endIndex = startIndex + pagination.pageSize;
          const paginatedData = response.data.slice(startIndex, endIndex);

          setData(paginatedData);
          setPagination((prev) => ({
            ...prev,
            total: response.data.length,
          }));
        }
      } else {
        // API mode: Use data from API response
        setData(response.data);
        setPagination((prev) => ({
          ...prev,
          total: response.pagination.total,
        }));
      }

      console.log('✅ Data loaded successfully');
      console.log('Total items:', response.pagination?.total || response.data.length);
      console.log('Items in current view:', response.data.length);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      message.error('❌ ' + (err.message || 'Failed to load data'));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch data when config or pagination changes
   * For client-side pagination, only refetch when sort changes or initial load
   */
  useEffect(() => {
    if (!config) return;

    const paginationMode = config.pagination?.mode || 'api';
    const showPagination = config.pagination?.showPagination !== false;

    if (paginationMode === 'client' && allData.length > 0) {
      // Client-side pagination: Just slice the existing data
      const startIndex = (pagination.current - 1) * pagination.pageSize;
      const endIndex = startIndex + pagination.pageSize;
      const paginatedData = allData.slice(startIndex, endIndex);
      setData(paginatedData);
    } else if (!showPagination && allData.length > 0) {
      // No pagination mode: Show all data (already loaded)
      return;
    } else {
      // API mode or initial load: Fetch from API
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
