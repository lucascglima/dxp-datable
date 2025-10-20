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
  SearchOutlined,
} from '@ant-design/icons';
import ApiConfigSection from '../components/configuration-form/api-config-section';
import ColumnsConfigSection from '../components/configuration-form/columns-config-section';
import PaginationConfigSection from '../components/configuration-form/pagination-config-section';
import EventsConfigSection from '../components/configuration-form/events-config.section';
import DynamicParamsConfigSection from '../components/configuration-form/dynamic-params-config-section';
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
    dynamicParams: {
      searchInput: {
        enabled: false,
        queryParamName: 'search',
        placeholder: 'Search...',
        currentValue: '',
      },
    },
  });

  const [isInitialLoad, setIsInitialLoad] = useState(true);

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
        dynamicParams: existing.dynamicParams || {
          searchInput: {
            enabled: false,
            queryParamName: 'search',
            placeholder: 'Search...',
            currentValue: '',
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
      message.info('Configuração existente carregada');
    }
    setIsInitialLoad(false);
  }, []);

  /**
   * Auto-save configuration to localStorage when it changes
   * (except on initial load to avoid overwriting with defaults)
   */
  useEffect(() => {
    if (!isInitialLoad && config.apiEndpoint) {
      // Save to localStorage automatically
      saveConfiguration(config);
    }
  }, [config, isInitialLoad]);

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
   * Handles dynamic parameters configuration change
   */
  const handleDynamicParamsChange = (dynamicParams) => {
    setConfig({
      ...config,
      dynamicParams,
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
    message.success(`Aplicadas ${suggestedColumns.length} colunas sugeridas`);
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
      errors.push('O endpoint de API válido é obrigatório');
    }

    // Validate columns
    if (config.columns.length === 0) {
      errors.push('Pelo menos uma coluna deve ser configurada');
    }

    config.columns.forEach((col, index) => {
      if (!col.title || !col.title.trim()) {
        errors.push(`Coluna ${index + 1}: O Título é obrigatório`);
      }
      if (!col.dataIndex || !col.dataIndex.trim()) {
        errors.push(`Coluna ${index + 1}: O Campo de dados é obrigatório`);
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
        title: 'Configuração Incompleta',
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
      message.success('✅ Configuração salva com sucesso! Redirecionando...', 2);
      setTimeout(() => {
        navigate('/datatable');
      }, 1000);
    } else {
      message.error('Falha ao salvar a configuração');
    }
  };

  /**
   * Clears all configuration
   */
  const handleClearAll = () => {
    Modal.confirm({
      title: 'Limpar Toda a Configuração?',
      content: 'Isso removerá todas as suas configurações atuais. Esta ação não pode ser desfeita.',
      okText: 'Sim, Limpar Tudo',
      okType: 'danger',
      cancelText: 'Cancelar',
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
          dynamicParams: {
            searchInput: {
              enabled: false,
              queryParamName: 'search',
              placeholder: 'Search...',
              currentValue: '',
            },
          },
        });
        setCurrentStep(0);
        message.success('Configuração limpa');
      },
    });
  };

  /**
   * Loads example configuration
   */
  const handleLoadExample = () => {
    const example = getExampleConfiguration();
    setConfig(example);
    message.success('Configuração de exemplo carregada');
  };

  const steps = [
    {
      title: 'API',
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
      title: 'Preview e Teste',
      icon: <EyeOutlined />,
      content: (
        <PreviewSection
          apiEndpoint={config.apiEndpoint}
          authToken={config.authToken}
          urlParams={config.urlParams}
          defaultQueryParams={config.defaultQueryParams}
          testQueryParams={config.testQueryParams}
          responseDataPath={config.responseDataPath}
          onTestQueryParamsChange={handleTestQueryParamsChange}
          onSuggestColumns={handleSuggestColumns}
          onResponseMappingChange={handleResponseMappingChange}
        />
      ),
    },
    {
      title: 'Colunas',
      icon: <TableOutlined />,
      content: (
        <ColumnsConfigSection
          value={config.columns}
          onChange={handleColumnsChange}
        />
      ),
    },
    {
      title: 'Paginação',
      icon: <SettingOutlined />,
      content: (
        <PaginationConfigSection
          value={config.pagination}
          onChange={handlePaginationChange}
        />
      ),
    },
    {
      title: 'Eventos',
      icon: <ThunderboltOutlined />,
      content: (
        <EventsConfigSection
          value={config.events}
          onChange={handleEventsChange}
        />
      ),
    },
    {
      title: 'Inputs dinâmicos',
      icon: <SearchOutlined />,
      content: (
        <DynamicParamsConfigSection
          value={config.dynamicParams}
          onChange={handleDynamicParamsChange}
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
            <Title level={2}>Configure sua Tabela</Title>
            <Paragraph type="secondary">
              Configure sua tabela em 5 passos simples. Não é necessário codificar!
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
              <Button onClick={handleLoadExample}>Carregar Exemplo</Button>
              <Button danger icon={<ClearOutlined />} onClick={handleClearAll}>
                Limpar Tudo
              </Button>
            </Space>

            <Space>
              {currentStep > 0 && (
                <Button onClick={() => setCurrentStep(currentStep - 1)}>
                  Anterior
                </Button>
              )}
              {currentStep < steps.length - 1 && (
                <Button type="primary" onClick={() => setCurrentStep(currentStep + 1)}>
                  Próximo
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSaveConfiguration}
                  size="large"
                >
                  Salvar Configuração e Visualizar Tabela
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