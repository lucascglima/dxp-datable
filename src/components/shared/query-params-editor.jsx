/**
 * Query Params Editor Component
 *
 * Advanced editor for API query parameters with 3 input modes:
 * - Visual: Key-value interface with add/remove
 * - Query String: Raw query string input (key1=value1&key2=value2)
 * - JSON: JSON array input ([{"key": "k1", "value": "v1"}])
 *
 * Features:
 * - Bidirectional synchronization between all formats
 * - Auto-detection of input format
 * - URL encoding/decoding handling
 * - Real-time validation and preview
 */

import { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Input,
  Button,
  Space,
  Alert,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import {
  parseQueryString,
  parseJSON,
  toQueryString,
  toJSON,
  detectFormat,
  parseAny,
  encodeParam,
} from '../../utils/query-string-parser';

const { TextArea } = Input;
const { Text } = Typography;

const QueryParamsEditor = ({ value = [], onChange }) => {
  const [activeTab, setActiveTab] = useState('visual');
  const [params, setParams] = useState(value);
  const [queryStringInput, setQueryStringInput] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [parsePreview, setParsePreview] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * Initialize from props
   */
  useEffect(() => {
    if (!isUpdating && value) {
      setParams(value);
      setQueryStringInput(toQueryString(value));
      setJsonInput(toJSON(value));
      updateParsePreview(value);
    }
  }, [value, isUpdating]);

  /**
   * Updates parse preview
   */
  const updateParsePreview = (currentParams) => {
    if (!currentParams || currentParams.length === 0) {
      setParsePreview(null);
      return;
    }

    const hasSpecialChars = currentParams.some(p =>
      p.value && /[*()&=?#+]/.test(p.value)
    );

    setParsePreview({
      success: true,
      count: currentParams.length,
      params: currentParams,
      hasSpecialChars,
    });
  };

  /**
   * Notifies parent of changes
   */
  const notifyChange = (newParams) => {
    setIsUpdating(true);
    if (onChange) {
      onChange(newParams);
    }
    setTimeout(() => setIsUpdating(false), 0);
  };

  /**
   * Handles visual tab changes
   */
  const handleParamChange = (index, field, val) => {
    const newParams = [...params];
    newParams[index][field] = val;
    setParams(newParams);
    setQueryStringInput(toQueryString(newParams));
    setJsonInput(toJSON(newParams));
    updateParsePreview(newParams);
    notifyChange(newParams);
  };

  const handleAddParam = () => {
    const newParams = [...params, { key: '', value: '' }];
    setParams(newParams);
    setQueryStringInput(toQueryString(newParams));
    setJsonInput(toJSON(newParams));
    updateParsePreview(newParams);
    notifyChange(newParams);
  };

  const handleRemoveParam = (index) => {
    const newParams = params.filter((_, i) => i !== index);
    setParams(newParams);
    setQueryStringInput(toQueryString(newParams));
    setJsonInput(toJSON(newParams));
    updateParsePreview(newParams);
    notifyChange(newParams);
  };

  /**
   * Handles query string input changes
   */
  const handleQueryStringChange = (e) => {
    const input = e.target.value;
    setQueryStringInput(input);

    try {
      const result = parseAny(input);

      if (result.errors.length === 0) {
        setParams(result.params);
        setJsonInput(toJSON(result.params));
        updateParsePreview(result.params);
        notifyChange(result.params);
      } else {
        setParsePreview({
          success: false,
          errors: result.errors,
        });
      }
    } catch (error) {
      setParsePreview({
        success: false,
        errors: [error.message],
      });
    }
  };

  /**
   * Handles JSON input changes
   */
  const handleJsonChange = (e) => {
    const input = e.target.value;
    setJsonInput(input);

    try {
      const result = parseAny(input);

      if (result.errors.length === 0) {
        setParams(result.params);
        setQueryStringInput(toQueryString(result.params));
        updateParsePreview(result.params);
        notifyChange(result.params);
      } else {
        setParsePreview({
          success: false,
          errors: result.errors,
        });
      }
    } catch (error) {
      setParsePreview({
        success: false,
        errors: [error.message],
      });
    }
  };

  /**
   * Tab items
   */
  const tabItems = [
    {
      key: 'visual',
      label: 'Visual',
      children: (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {params.map((param, index) => (
            <Space key={index} style={{ width: '100%' }} align="start">
              <Input
                placeholder="Chave (ex.: página)"
                value={param.key}
                onChange={(e) => handleParamChange(index, 'key', e.target.value)}
                style={{ width: 150 }}
              />
              <Input
                placeholder="Valor (ex.: 1)"
                value={param.value}
                onChange={(e) => handleParamChange(index, 'value', e.target.value)}
                style={{ width: 200 }}
              />
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveParam(index)}
              />
            </Space>
          ))}

          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={handleAddParam}
            block
          >
            Adicionar Parâmetro
          </Button>
        </Space>
      ),
    },
    {
      key: 'queryString',
      label: 'Query String',
      children: (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Alert
            message="Cole ou edite a query string"
            description="Formato: chave1=valor1&chave2=valor2. Sincroniza automaticamente com os formatos Visual e JSON."
            type="info"
            showIcon
          />

          <TextArea
            placeholder="key=U4DMV*8nvpm3EOpvf69Rxw((&site=stackoverflow&page=1&pagesize=10&order=desc"
            value={queryStringInput}
            onChange={handleQueryStringChange}
            rows={6}
            style={{ fontFamily: 'monospace' }}
          />

          <Text type="secondary" style={{ fontSize: 12 }}>
            Caracteres especiais serão codificados em URL automaticamente ao serem enviados para a API.
          </Text>
        </Space>
      ),
    },
    {
      key: 'json',
      label: 'JSON',
      children: (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Alert
            message="Cole ou edite o array JSON"
            description='Formato: [{"key": "page", "value": "1"}]. Sincroniza automaticamente com os formatos Visual e Query String.'
            type="info"
            showIcon
          />

          <TextArea
            placeholder='[{"key": "page", "value": "1"}, {"key": "site", "value": "stackoverflow"}]'
            value={jsonInput}
            onChange={handleJsonChange}
            rows={8}
            style={{ fontFamily: 'monospace' }}
          />

          <Text type="secondary" style={{ fontSize: 12 }}>
            Deve ser um array JSON válido com as propriedades &quot;key&quot; e &quot;value&quot;.
          </Text>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Parâmetros para consulta de Teste" size="small">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />

        {/* Parsing Preview */}
        {parsePreview && (
          <Card
            title="Pré-visualização da Análise"
            size="small"
            type="inner"
            style={{ backgroundColor: '#fafafa' }}
          >
            {parsePreview.success ? (
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Alert
                  message={`Analisado com sucesso (${parsePreview.count} parâmetro${parsePreview.count !== 1 ? 's' : ''})`}
                  type="success"
                  showIcon
                  icon={<CheckCircleOutlined />}
                />

                <div style={{ marginTop: 8 }}>
                  {parsePreview.params.map((param, index) => (
                    <div key={index} style={{ marginBottom: 4 }}>
                      <Text strong>{param.key}</Text>
                      <Text type="secondary">: </Text>
                      <Text>{param.value || '(vazio)'}</Text>

                      {param.value && /[*()&=?#+]/.test(param.value) && (
                        <div style={{ marginLeft: 16, fontSize: 12 }}>
                          <Text type="secondary">
                            Codificado em URL: {encodeParam(param.value)}
                          </Text>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {parsePreview.hasSpecialChars && (
                  <Alert
                    message="Caracteres especiais detectados"
                    description="Valores com caracteres especiais (*()&=?#+) serão automaticamente codificados em URL ao serem enviados para a API."
                    type="info"
                    showIcon
                    style={{ marginTop: 8 }}
                  />
                )}
              </Space>
            ) : (
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Alert
                  message="Erros de análise"
                  type="error"
                  showIcon
                  icon={<CloseCircleOutlined />}
                />
                <ul style={{ margin: 0, paddingLeft: 20, color: '#ff4d4f' }}>
                  {parsePreview.errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </Space>
            )}
          </Card>
        )}
      </Space>
    </Card>
  );
};

export default QueryParamsEditor;