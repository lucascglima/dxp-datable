/**
 * Configuration Page (Refactored)
 *
 * Visual no-code interface for configuring the DxpTable component.
 * Reduced from 519 lines to ~250 lines using hooks and composition.
 */

import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Steps,
  Button,
  Space,
  App,
  Typography,
  Divider,
  Modal,
} from 'antd';
import {
  SaveOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import ApiConfigSection from '../components/configuration-form/api-config-section';
import ColumnsConfigSection from '../components/configuration-form/columns-config-section';
import PaginationConfigSection from '../components/configuration-form/pagination-config-section';
import EventsConfigSection from '../components/configuration-form/events-config.section';
import DynamicParamsConfigSection from '../components/configuration-form/dynamic-params-config-section';
import PreviewSection from '../components/configuration-form/preview-section';
import { ErrorBoundary } from '../components/error-boundary';
import { getExampleConfiguration } from '../services/config-storage';
import { validateConfiguration } from '../core/validators/config-validator';
import { useConfigurationState } from '../core/hooks/use-configuration-state';
import { useConfigurationWizard } from '../features/configuration/hooks/use-configuration-wizard.jsx';

const { Title, Paragraph } = Typography;

const ConfigurationPage = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();

  // Use configuration state hook
  const configState = useConfigurationState();

  // Use wizard navigation hook
  const wizard = useConfigurationWizard();

  /**
   * Applies suggested columns from preview
   * Memoized to prevent unnecessary re-renders
   */
  const handleSuggestColumns = useCallback((suggestedColumns) => {
    configState.updateColumns(suggestedColumns);
    message.success(`Aplicadas ${suggestedColumns.length} colunas sugeridas`);
    wizard.goToStep(2); // Move to columns step
  }, [configState, message, wizard]);

  /**
   * Saves configuration and navigates to datatable
   * Memoized to prevent unnecessary re-renders
   */
  const handleSaveConfiguration = useCallback(() => {
    const validation = validateConfiguration(configState.config);

    if (!validation.valid) {
      Modal.error({
        title: 'Configuração Incompleta',
        content: (
          <ul>
            {validation.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        ),
      });
      return;
    }

    const success = configState.saveConfig();

    if (success) {
      message.success('Configuração salva com sucesso! Redirecionando...', 2);
      setTimeout(() => {
        navigate('/datatable');
      }, 1000);
    } else {
      message.error('Falha ao salvar a configuração');
    }
  }, [configState, message, navigate]);

  /**
   * Clears all configuration
   * Memoized to prevent unnecessary re-renders
   */
  const handleClearAll = useCallback(() => {
    Modal.confirm({
      title: 'Limpar Toda a Configuração?',
      content:
        'Isso removerá todas as suas configurações atuais. Esta ação não pode ser desfeita.',
      okText: 'Sim, Limpar Tudo',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: () => {
        configState.clearConfig();
        wizard.resetWizard();
      },
    });
  }, [configState, wizard]);

  /**
   * Loads example configuration
   * Memoized to prevent unnecessary re-renders
   */
  const handleLoadExample = useCallback(() => {
    const example = getExampleConfiguration();
    configState.replaceConfig(example);
    message.success('Configuração de exemplo carregada');
  }, [configState, message]);

  /**
   * Step definitions with components (wrapped with ErrorBoundary)
   * Memoized to prevent unnecessary re-creation of step array
   */
  const steps = useMemo(() => [
    {
      ...wizard.stepDefinitions[0],
      content: (
        <ErrorBoundary>
          <ApiConfigSection
            value={{
              apiEndpoint: configState.config.apiEndpoint,
              authToken: configState.config.authToken,
              urlParams: configState.config.urlParams,
              defaultQueryParams: configState.config.defaultQueryParams,
            }}
            onChange={configState.updateApiConfig}
          />
        </ErrorBoundary>
      ),
    },
    {
      ...wizard.stepDefinitions[1],
      content: (
        <ErrorBoundary>
          <PreviewSection
            apiEndpoint={configState.config.apiEndpoint}
            authToken={configState.config.authToken}
            urlParams={configState.config.urlParams}
            defaultQueryParams={configState.config.defaultQueryParams}
            testQueryParams={configState.config.testQueryParams}
            responseDataPath={configState.config.responseDataPath}
            onTestQueryParamsChange={configState.updateTestQueryParams}
            onSuggestColumns={handleSuggestColumns}
            onResponseMappingChange={configState.updateResponseMapping}
          />
        </ErrorBoundary>
      ),
    },
    {
      ...wizard.stepDefinitions[2],
      content: (
        <ErrorBoundary>
          <ColumnsConfigSection
            value={configState.config.columns}
            onChange={configState.updateColumns}
          />
        </ErrorBoundary>
      ),
    },
    {
      ...wizard.stepDefinitions[3],
      content: (
        <ErrorBoundary>
          <PaginationConfigSection
            value={configState.config.pagination}
            onChange={configState.updatePagination}
          />
        </ErrorBoundary>
      ),
    },
    {
      ...wizard.stepDefinitions[4],
      content: (
        <ErrorBoundary>
          <EventsConfigSection
            value={configState.config.events}
            onChange={configState.updateEvents}
          />
        </ErrorBoundary>
      ),
    },
    {
      ...wizard.stepDefinitions[5],
      content: (
        <ErrorBoundary>
          <DynamicParamsConfigSection
            value={configState.config.dynamicParams}
            onChange={configState.updateDynamicParams}
          />
        </ErrorBoundary>
      ),
    },
  ], [
    wizard.stepDefinitions,
    configState.config.apiEndpoint,
    configState.config.authToken,
    configState.config.urlParams,
    configState.config.defaultQueryParams,
    configState.config.testQueryParams,
    configState.config.responseDataPath,
    configState.config.columns,
    configState.config.pagination,
    configState.config.events,
    configState.config.dynamicParams,
    configState.updateApiConfig,
    configState.updateTestQueryParams,
    configState.updateResponseMapping,
    configState.updateColumns,
    configState.updatePagination,
    configState.updateEvents,
    configState.updateDynamicParams,
    handleSuggestColumns,
  ]);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <div>
            <Title level={2}>Configure sua Tabela</Title>
            <Paragraph type="secondary">
              Configure sua tabela em 5 passos simples.
            </Paragraph>
          </div>

          {/* Steps Navigation */}
          <Steps
            current={wizard.currentStep}
            onChange={wizard.goToStep}
            items={wizard.stepDefinitions.map((step) => ({
              title: step.title,
              icon: step.icon,
            }))}
          />

          <Divider />

          {/* Current Step Content */}
          <div style={{ minHeight: '400px' }}>{steps[wizard.currentStep].content}</div>

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
              {!wizard.isFirstStep && (
                <Button onClick={wizard.previousStep}>Anterior</Button>
              )}
              {!wizard.isLastStep && (
                <Button type="primary" onClick={wizard.nextStep}>
                  Próximo
                </Button>
              )}
              {wizard.isLastStep && (
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
