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
import { SearchInputParam } from '../components/dynamic-params';
import { loadConfiguration, hasConfiguration, updateConfiguration } from '../services/config-storage';
import { fetchData } from '../services/external-api';
import { createColumnRenderer } from '../features/columns/renderers';

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
  const [searchValue, setSearchValue] = useState('');

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

    // Load search value from config if it exists
    if (loadedConfig.dynamicParams?.searchInput?.currentValue) {
      setSearchValue(loadedConfig.dynamicParams.searchInput.currentValue);
    }
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
      // Prepare API config with sorting, pagination, URL params, default query params, and dynamic params
      const apiConfig = {
        sortingConfig: config.events?.sorting,
        // Use custom pagination parameter names from config if in API mode
        apiParamNames: paginationMode === 'api' ? config.pagination?.apiParamNames : undefined,
        // Include response mapping configuration if available
        responseDataPath: config.responseDataPath || undefined,
        // Include URL path variables (e.g., :version, :userId)
        urlParams: config.urlParams || [],
        // Include default query params (with enabled flag)
        defaultQueryParams: config.defaultQueryParams || [],
        // Include dynamic parameters (search, filters, etc.)
        dynamicParams: config.dynamicParams || {},
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
      setError(err.message || 'Falha ao carregar dados');
      message.error('❌ ' + (err.message || 'Falha ao carregar dados'));
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
  }, [config, pagination.current, pagination.pageSize, sortInfo.columnKey, sortInfo.order, searchValue]);

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
      message.info('Ordenação aplicada - buscando dados ordenados no servidor');
    } else if (sortingMode === 'client') {
      // Client-side sorting: handled by Ant Design Table
      message.info('Ordenação aplicada no navegador');
    } else {
      // Sorting disabled
      message.warning('A ordenação está desabilitada na configuração');
    }
  };



  /**
   * Handles search input change
   */
  const handleSearchChange = (newValue) => {
    console.log('=== SEARCH VALUE CHANGED ===');
    console.log('New value:', newValue);

    // Update local state
    setSearchValue(newValue);

    // Update config with new search value
    const updatedConfig = {
      ...config,
      dynamicParams: {
        ...config.dynamicParams,
        searchInput: {
          ...config.dynamicParams?.searchInput,
          currentValue: newValue,
        },
      },
    };

    setConfig(updatedConfig);

    // Save to localStorage
    updateConfiguration(updatedConfig);

    // Reset to first page when search changes
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
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
        message: 'Erro no Manipulador de Clique da Linha',
        description: error.message,
        placement: 'topRight',
        duration: 4,
      });
    }
  };

  /**
   * Processes columns to add custom renderers and click handlers
   */
  const getProcessedColumns = () => {
    if (!config || !config.columns) return [];

    return config.columns.map((column) => {
      const processedColumn = { ...column };

      // Apply custom renderer if configured
      if (column.render && column.render.type) {
        const customRenderer = createColumnRenderer(column.render);

        // If column is also clickable, wrap the renderer with clickable styling
        if (column.clickable) {
          processedColumn.render = (text, record, index) => {
            const renderedContent = customRenderer(text, record, index);
            return (
              <span
                style={{
                  cursor: 'pointer',
                  color: '#1890ff',
                  textDecoration: 'underline',
                }}
              >
                {renderedContent}
              </span>
            );
          };
        } else {
          // Use custom renderer as-is
          processedColumn.render = customRenderer;
        }
      } else if (column.clickable) {
        // Only clickable (no custom renderer)
        processedColumn.render = (text) => (
          <span
            style={{
              cursor: 'pointer',
              color: '#1890ff',
              textDecoration: 'underline',
            }}
          >
            {text}
          </span>
        );
      }
      // If neither custom renderer nor clickable, return column as-is

      return processedColumn;
    });
  };

  /**
   * Handles refresh button click
   */
  const handleRefresh = () => {
    message.loading('Atualizando dados...', 0.5);
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
            <Title level={2}>Bem-vindo! 👋</Title>
            <Paragraph>
              Vamos configurar sua tabela de dados. Clique no botão abaixo para começar.
            </Paragraph>
            <Paragraph type="secondary">
              A configuração é rápida e fácil - não é necessário codificar!
            </Paragraph>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/configuration')}
            >
              Ir para Configuração
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
                Tabela Configurada
              </Title>
              <Text type="secondary">
                Dados de: <code>{config.apiEndpoint}</code>
              </Text>
            </div>

            <Space>
              <Button
                icon={<EditOutlined />}
                onClick={handleEditConfig}
              >
                Editar Configuração
              </Button>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={loading}
              >
                Recarregar
              </Button>
            </Space>
          </div>

          {/* Status Badge */}
          {!loading && !error && data.length > 0 && (
            <Alert
              message={`✅ ${pagination.total} registros carregados com sucesso`}
              type="success"
              showIcon
              closable
            />
          )}

          {/* Error Display */}
          {error && (
            <Alert
              message="Falha ao Carregar Dados"
              description={
                <Space direction="vertical">
                  <Text>{error}</Text>
                  <Space>
                    <Button size="small" onClick={handleRefresh}>
                      Tentar Novamente
                    </Button>
                    <Button size="small" onClick={handleEditConfig}>
                      Editar Configuração
                    </Button>
                  </Space>
                </Space>
              }
              type="error"
              showIcon
            />
          )}

          {/* Dynamic Parameters Section */}
          {config.dynamicParams?.searchInput?.enabled && (
            <div style={{ marginBottom: '16px' }}>
              <SearchInputParam
                value={searchValue}
                onChange={handleSearchChange}
                placeholder={config.dynamicParams.searchInput.placeholder || 'Pesquisar...'}
              />
            </div>
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