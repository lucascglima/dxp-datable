/**
 * Configuration Page (Refactored)
 *
 * Visual no-code interface for configuring the DxpTable component.
 * Supports both Visual mode (step-by-step wizard) and JSON mode (direct JSON editing).
 * Reduced from 519 lines to ~250 lines using hooks and composition.
 */

import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Card, Steps, Button, Space, App, Typography, Divider, Modal, Switch } from 'antd';
import { SaveOutlined, ClearOutlined } from '@ant-design/icons';
import ApiConfigSection from '../components/configuration-form/api-config-section';
import ColumnsConfigSection from '../components/configuration-form/columns-config-section';
import PaginationConfigSection from '../components/configuration-form/pagination-config-section';
import EventsConfigSection from '../components/configuration-form/events-config.section';
import DynamicParamsConfigSection from '../components/configuration-form/dynamic-params-config-section';
import PreviewSection from '../components/configuration-form/preview-section';
import JsonConfigEditor from '../features/configuration/components/json-config-editor';
import { ErrorBoundary } from '../components/error-boundary';
import { validateConfiguration } from '../core/validators/config-validator';
import { useConfigurationState } from '../core/hooks/use-configuration-state';
import { useConfigurationWizard } from '../features/configuration/hooks/use-configuration-wizard.jsx';
import { useJsonConfigMode } from '../features/configuration/hooks/use-json-config-mode';
import { useUrlNavigation } from '../hooks/use-url-navigation';
import { VIEWS } from '../hooks/use-view-manager';

const { Title, Paragraph, Text } = Typography;

const ConfigurationPage = ({ onNavigate }) => {
  const { message } = App.useApp();

  // Use URL navigation hook
  const urlNav = useUrlNavigation({ defaultView: 'configuration', defaultStep: 'api' });

  // Use configuration state hook
  const configState = useConfigurationState();

  // Use wizard navigation hook
  const wizard = useConfigurationWizard();

  // Use JSON configuration mode hook (pass urlNav for URL sync)
  const jsonMode = useJsonConfigMode(configState.config, urlNav);

  /**
   * Applies suggested columns from preview
   * Memoized to prevent unnecessary re-renders
   */
  const handleSuggestColumns = useCallback(
    (suggestedColumns) => {
      configState.updateColumns(suggestedColumns);
      message.success(`Aplicadas ${suggestedColumns.length} colunas sugeridas`);
      wizard.goToStep(2); // Move to columns step
    },
    [configState, message, wizard]
  );

  /**
   * Saves configuration and navigates to datatable
   * Memoized to prevent unnecessary re-renders
   * Step param will be automatically cleared by useViewManager when navigating to datatable
   */
  const handleSaveConfiguration = useCallback(() => {
    // If in JSON mode, apply the JSON config first
    if (jsonMode.isJsonMode) {
      if (!jsonMode.isValid) {
        Modal.error({
          title: 'JSON Inválido',
          content: (
            <ul>
              {jsonMode.validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          ),
        });
        return;
      }

      // Apply parsed JSON config
      const parsedConfig = jsonMode.getParsedConfig();
      if (parsedConfig) {
        configState.replaceConfig(parsedConfig);
      }
    }

    // Validate configuration
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
        // Navigate to datatable - step param will be automatically cleared
        onNavigate(VIEWS.DATATABLE);
      }, 1000);
    } else {
      message.error('Falha ao salvar a configuração');
    }
  }, [configState, jsonMode, message, onNavigate]);

  /**
   * Handles mode toggle between Visual and JSON
   */
  const handleModeToggle = useCallback(
    (checked) => {
      if (checked) {
        // Switching to JSON mode
        jsonMode.switchToJsonMode();
      } else {
        // Switching to Visual mode
        Modal.confirm({
          title: 'Voltar ao Editor Visual?',
          content: 'As alterações não salvas no JSON serão perdidas. Deseja continuar?',
          okText: 'Sair sem salvar',
          cancelText: 'Cancelar',
          onOk: () => {
            jsonMode.switchToVisualMode();
          },
        });
      }
    },
    [jsonMode]
  );

  /**
   * Clears all configuration
   * Memoized to prevent unnecessary re-renders
   */
  const handleClearAll = useCallback(() => {
    Modal.confirm({
      title: 'Limpar Toda a Configuração?',
      content: 'Isso removerá todas as suas configurações atuais. Esta ação não pode ser desfeita.',
      okText: 'Sim, Limpar Tudo',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: () => {
        configState.clearConfig();
        wizard.resetWizard();
        jsonMode.reloadJsonFromConfig();
      },
    });
  }, [configState, wizard, jsonMode]);

  /**
   * Step definitions with components (wrapped with ErrorBoundary)
   * Memoized to prevent unnecessary re-creation of step array
   */
  const steps = useMemo(
    () => [
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
    ],
    [
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
    ]
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header with Toggle */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <Title level={2} style={{ marginBottom: '8px' }}>
                Configure da Tabela
              </Title>
              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                {jsonMode.isJsonMode
                  ? 'Configure sua tabela editando o JSON diretamente.'
                  : 'Configure sua tabela em apenas 6 etapas.'}
              </Paragraph>
            </div>

            {/* Simple Mode Toggle */}
            <Space align="center">
              <Switch checked={jsonMode.isJsonMode} onChange={handleModeToggle} />
              <Text type="secondary">Editor JSON</Text>
            </Space>
          </div>

          {/* Content based on mode */}
          {jsonMode.isVisualMode ? (
            <>
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
            </>
          ) : (
            /* JSON Editor */
            <JsonConfigEditor
              value={jsonMode.jsonText}
              onChange={jsonMode.updateJsonText}
              isValid={jsonMode.isValid}
              errors={jsonMode.validationErrors}
              height={600}
            />
          )}

          <Divider />

          {/* Navigation & Actions */}
          <Space direction="horizontal" style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space>
              <Button icon={<ClearOutlined />} onClick={handleClearAll}>
                Limpar configuração
              </Button>
            </Space>

            <Space>
              {/* Visual mode navigation */}
              {jsonMode.isVisualMode && !wizard.isFirstStep && (
                <Button onClick={wizard.previousStep}>Anterior</Button>
              )}
              {jsonMode.isVisualMode && !wizard.isLastStep && (
                <Button type="primary" onClick={wizard.nextStep}>
                  Próximo
                </Button>
              )}

              {/* Save button (available in both modes) */}
              {(jsonMode.isJsonMode || wizard.isLastStep) && (
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSaveConfiguration}
                  disabled={jsonMode.isJsonMode && !jsonMode.isValid}
                >
                  Salvar configuração e ir para a Tabela
                </Button>
              )}
            </Space>
          </Space>
        </Space>
      </Card>
    </div>
  );
};

ConfigurationPage.propTypes = {
  onNavigate: PropTypes.func.isRequired,
};

export default ConfigurationPage;
