/**
 * Preview Section
 *
 * Tests API connection and displays response structure.
 * Helps users understand their data and suggests column configurations.
 * Supports customizable query parameters and optional response mapping.
 */

import { useState, useEffect } from 'react';
import {
  Button,
  Alert,
  Space,
  Collapse,
  Tag,
  Typography,
  Card,
  Input,
  Checkbox,
  Divider,
} from 'antd';
import {
  ApiOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { testConnection, parseResponseStructure } from '../../services/external-api';
import { validateUrl } from '../../utils/api-validator';
import QueryParamsEditor from './query-params-editor';
import { toObject, validateParamConflicts } from '../../utils/query-string-parser';

const { Text, Paragraph } = Typography;

const PreviewSection = ({
  apiEndpoint,
  authToken,
  onSuggestColumns,
  onResponseMappingChange,
  testQueryParams = [],
  onTestQueryParamsChange,
  defaultQueryParams = [],
  urlParams = [],
  responseDataPath = null,
}) => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [parsedStructure, setParsedStructure] = useState(null);

  // Query parameters for testing (saved to config via onTestQueryParamsChange)
  const [queryParams, setQueryParams] = useState(
    testQueryParams.length > 0 ? testQueryParams : [
      { key: 'page', value: '1' },
      { key: 'pageSize', value: '20' }
    ]
  );

  // Response mapping configuration (saved to config)
  const [enableMapping, setEnableMapping] = useState(false);
  const [dataPath, setDataPath] = useState('');
  const [totalPath, setTotalPath] = useState('');
  const [mappingValidation, setMappingValidation] = useState(null);

  /**
   * Load responseDataPath values when component mounts or when prop changes
   */
  useEffect(() => {
    if (responseDataPath && responseDataPath.dataKey) {
      setEnableMapping(true);
      setDataPath(responseDataPath.dataKey || '');
      setTotalPath(responseDataPath.totalKey || '');
    }
  }, [responseDataPath]);

  /**
   * Handles query params change from editor
   */
  const handleQueryParamsChange = (newParams) => {
    setQueryParams(newParams);
    // Save to config so they persist
    if (onTestQueryParamsChange) {
      onTestQueryParamsChange(newParams);
    }
  };

  /**
   * Handles mapping checkbox change
   */
  const handleMappingToggle = (e) => {
    const enabled = e.target.checked;
    setEnableMapping(enabled);

    // Notify parent and clear validation
    if (!enabled) {
      setDataPath('');
      setTotalPath('');
      setMappingValidation(null);
      if (onResponseMappingChange) {
        onResponseMappingChange(null);
      }
    }
  };

  /**
   * Updates response mapping configuration
   */
  const handleMappingChange = () => {
    if (!enableMapping) {
      if (onResponseMappingChange) {
        onResponseMappingChange(null);
      }
      return;
    }

    const mappingConfig = {
      dataKey: dataPath.trim(),
      totalKey: totalPath.trim() || '',
      totalSource: 'body'
    };

    if (onResponseMappingChange) {
      onResponseMappingChange(mappingConfig);
    }
  };

  /**
   * Tests API connection and parses response
   */
  const handleTestConnection = async () => {
    // Validate URL first
    const urlValidation = validateUrl(apiEndpoint);
    if (!urlValidation.valid) {
      setTestResult({
        success: false,
        message: urlValidation.error || 'Invalid URL',
      });
      return;
    }

    // Validate mapping if enabled
    if (enableMapping && !dataPath.trim()) {
      setTestResult({
        success: false,
        message: 'Items list path is required when mapping is enabled',
      });
      return;
    }

    // Validate for duplicate query parameters
    const paramValidation = validateParamConflicts({
      testParams: queryParams,
      defaultParams: defaultQueryParams,
      paginationParams: [], // No pagination params in test
      labels: {
        testParams: 'Test Query Params',
        defaultParams: 'Default Query Params',
        paginationParams: 'Pagination Params',
      },
    });

    if (!paramValidation.valid) {
      setTestResult({
        success: false,
        message: 'Parâmetros de consulta duplicados detectados',
        duplicateErrors: paramValidation.errors,
      });
      return;
    }

    // Build query parameters object using toObject utility
    const testParams = toObject(queryParams);

    // Merge with default query params (enabled ones only)
    const defaultParamsObj = toObject(defaultQueryParams.filter(p => p.enabled !== false));

    // Merge test params with default params (test params take priority)
    const mergedParams = { ...defaultParamsObj, ...testParams };

    setTesting(true);
    setTestResult(null);
    setParsedStructure(null);
    setMappingValidation(null);

    try {
      // Prepare API config with optional mapping and URL params
      const apiConfig = {
        urlParams: urlParams || [],
        ...(enableMapping ? {
          responseDataPath: {
            dataKey: dataPath.trim(),
            totalKey: totalPath.trim() || '',
            totalSource: 'body'
          }
        } : {})
      };

      const result = await testConnection(
        apiEndpoint,
        authToken,
        apiConfig,
        mergedParams
      );

      setTestResult(result);

      if (result.success) {
        // Validate mapping if enabled
        if (enableMapping && result.fullResponse) {
          const validation = validateMapping(result.fullResponse, dataPath.trim(), totalPath.trim());
          setMappingValidation(validation);

          // Parse structure with mapping for column suggestions
          if (validation.itemsFound) {
            const items = getNestedValue(result.fullResponse, dataPath.trim());
            if (items && Array.isArray(items) && items.length > 0) {
              const structure = parseResponseStructure(items[0], '');
              setParsedStructure(structure);
            }
          }
        } else {
          // Parse structure without mapping for column suggestions
          if (result.sampleData) {
            const structure = parseResponseStructure(result.sampleData, '');
            setParsedStructure(structure);
          }
        }

        // Update parent with mapping config
        handleMappingChange();
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: error.message || 'Connection test failed',
      });
    } finally {
      setTesting(false);
    }
  };

  /**
   * Validates response mapping paths
   */
  const validateMapping = (responseData, itemsPath, countPath) => {
    const validation = {
      itemsFound: false,
      itemsCount: 0,
      totalFound: false,
      totalValue: null,
      errors: []
    };

    try {
      // Validate items path
      if (itemsPath) {
        const items = getNestedValue(responseData, itemsPath);
        if (items && Array.isArray(items)) {
          validation.itemsFound = true;
          validation.itemsCount = items.length;
        } else if (items) {
          validation.errors.push(`Path "${itemsPath}" exists but is not an array`);
        } else {
          validation.errors.push(`Path "${itemsPath}" not found in response`);
        }
      }

      // Validate total path (optional)
      if (countPath) {
        const total = getNestedValue(responseData, countPath);
        if (total !== undefined && total !== null) {
          validation.totalFound = true;
          validation.totalValue = parseInt(total, 10);
        } else {
          validation.errors.push(`Path "${countPath}" not found in response`);
        }
      }
    } catch (error) {
      validation.errors.push(`Erro de validação de mapeamento: ${error.message}`);
    }

    return validation;
  };

  /**
   * Gets nested value from object using dot notation
   */
  const getNestedValue = (obj, path) => {
    if (!path) return obj;
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  /**
   * Applies suggested columns to configuration
   */
  const handleApplySuggestions = () => {
    if (parsedStructure?.suggestedColumns) {
      onSuggestColumns(parsedStructure.suggestedColumns);
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="Testar e Pré-visualizar"
        description="Configure parâmetros de teste, defina o mapeamento de resposta, se necessário, e pré-visualize a estrutura de dados da sua API."
        type="info"
        showIcon
        icon={<ApiOutlined />}
      />

      {/* Query Parameters Section - NEW QueryParamsEditor Component */}
      <QueryParamsEditor
        value={queryParams}
        onChange={handleQueryParamsChange}
      />

      {/* Response Mapping Section */}
      <Card title="Mapeamento de Resposta" size="small">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Checkbox
            checked={enableMapping}
            onChange={handleMappingToggle}
          >
            Habilitar Mapeamento de Resposta Personalizado
          </Checkbox>

          {!enableMapping && (
            <Alert
              message="A resposta da API será tratada como um array direto de itens"
              type="info"
              showIcon
            />
          )}

          {enableMapping && (
            <>
              

              <div>
                <Text strong>Caminho da Lista de Itens (obrigatório)</Text>
                <Input
                  placeholder='Caminho em notação dot, ex.: "data.items", "results"'
                  value={dataPath}
                  onChange={(e) => setDataPath(e.target.value)}
                  style={{ marginTop: 4 }}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Caminho em notação dot para o array de itens
                </Text>
              </div>

              <div>
                <Text strong>Caminho da Contagem Total (opcional)</Text>
                <Input
                  placeholder='ex.: "data.pagination.total", "total", deixe em branco se não estiver disponível'
                  value={totalPath}
                  onChange={(e) => setTotalPath(e.target.value)}
                  style={{ marginTop: 4 }}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Deixe em branco se a API não retornar a contagem total
                </Text>
              </div>

              {mappingValidation && (
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  {mappingValidation.itemsFound && (
                    <Alert
                      message={`Encontrados ${mappingValidation.itemsCount} itens em "${dataPath}"`}
                      type="success"
                      showIcon
                      icon={<CheckCircleOutlined />}
                    />
                  )}

                  {mappingValidation.totalFound && (
                    <Alert
                      message={`Total encontrado: ${mappingValidation.totalValue} em "${totalPath}"`}
                      type="success"
                      showIcon
                      icon={<CheckCircleOutlined />}
                    />
                  )}

                  {!mappingValidation.totalFound && totalPath && (
                    <Alert
                      message="Contagem total não disponível (usando o tamanho dos itens)"
                      type="info"
                      showIcon
                    />
                  )}

                  {mappingValidation.errors.length > 0 && (
                    <Alert
                      message="Erros de Mapeamento"
                      description={
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                          {mappingValidation.errors.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      }
                      type="error"
                      showIcon
                    />
                  )}
                </Space>
              )}
            </>
          )}
        </Space>
      </Card>

      {/* Test Button */}
      <Button
        type="primary"
        icon={<ApiOutlined />}
        onClick={handleTestConnection}
        loading={testing}
        disabled={!apiEndpoint}
        size="large"
        block
      >
        {testing ? 'Testando Conexão...' : 'Testar Conexão com a API'}
      </Button>

      {!apiEndpoint && (
        <Alert
          message="Endpoint da API é obrigatório"
          description="Por favor, insira uma URL de endpoint da API acima antes de testar"
          type="warning"
          showIcon
        />
      )}

      {/* Test Result */}
      {testResult && (
        <Alert
          message={
            testResult.success ? (
              <Space>
                <CheckCircleOutlined />
                Conexão Bem-sucedida
              </Space>
            ) : (
              <Space>
                <CloseCircleOutlined />
                Conexão Falhou
              </Space>
            )
          }
          description={
            testResult.duplicateErrors ? (
              <div>
                <div>{testResult.message}</div>
                <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
                  {testResult.duplicateErrors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            ) : (
              testResult.message
            )
          }
          type={testResult.success ? 'success' : 'error'}
          showIcon
        />
      )}

      {/* Response Structure Preview */}
      {parsedStructure && parsedStructure.isValid && (
        <Card title="Estrutura da Resposta" size="small">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Alert
              message={`Encontrados ${parsedStructure.fields.length} campos na resposta da API`}
              type="info"
              showIcon
              icon={<InfoCircleOutlined />}
            />

            <Collapse
              items={[
                {
                  key: 'fields',
                  label: 'Campos Disponíveis',
                  children: (
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {parsedStructure.fields.map((field) => (
                        <Card key={field.name} size="small" type="inner">
                          <Space direction="vertical" style={{ width: '100%' }}>
                            <Space>
                              <Text strong>{field.name}</Text>
                              <Tag color="blue">{field.type}</Tag>
                              {field.suggestAsColumn && (
                                <Tag color="green">Recomendado para coluna</Tag>
                              )}
                            </Space>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              Amostra: {JSON.stringify(field.sampleValue)}
                            </Text>
                          </Space>
                        </Card>
                      ))}
                    </Space>
                  ),
                },
                {
                  key: 'json',
                  label: 'Dados de Amostra (JSON)',
                  children: (
                    <pre
                      style={{
                        background: '#f5f5f5',
                        padding: '12px',
                        borderRadius: '4px',
                        overflow: 'auto',
                        maxHeight: '300px',
                      }}
                    >
                      {JSON.stringify(parsedStructure.sampleData, null, 2)}
                    </pre>
                  ),
                },
                testResult?.fullResponse && {
                  key: 'fullResponse',
                  label: 'Resposta Completa (Bruta)',
                  children: (
                    <pre
                      style={{
                        background: '#f5f5f5',
                        padding: '12px',
                        borderRadius: '4px',
                        overflow: 'auto',
                        maxHeight: '300px',
                      }}
                    >
                      {JSON.stringify(testResult.fullResponse, null, 2)}
                    </pre>
                  ),
                },
              ].filter(Boolean)}
            />

            {parsedStructure.suggestedColumns &&
              parsedStructure.suggestedColumns.length > 0 && (
                <>
                  <Alert
                    message="Sugestões de Colunas Disponíveis"
                    description={`Encontramos ${parsedStructure.suggestedColumns.length} campos que funcionariam bem como colunas da tabela. Clique abaixo para configurá-los automaticamente.`}
                    type="success"
                    showIcon
                  />

                  <Button
                    type="primary"
                    onClick={handleApplySuggestions}
                    block
                  >
                    Aplicar Colunas Sugeridas ({parsedStructure.suggestedColumns.length})
                  </Button>

                  <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: 8 }}>
                    Isso substituirá sua configuração de coluna atual por colunas sugeridas com base na resposta da API.
                  </Paragraph>
                </>
              )}
          </Space>
        </Card>
      )}
    </Space>
  );
};

export default PreviewSection;