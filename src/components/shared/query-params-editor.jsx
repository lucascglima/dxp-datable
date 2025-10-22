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
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Tabs, Input, Button, Space, Alert, Typography, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { toQueryString, toJSON, parseAny } from '../../utils/query-string-parser';

const { TextArea } = Input;
const { Text } = Typography;

const QueryParamsEditor = ({ value = [], onChange }) => {
  const [activeTab, setActiveTab] = useState('visual');
  const [params, setParams] = useState(value);
  const [queryStringInput, setQueryStringInput] = useState('');
  const [jsonInput, setJsonInput] = useState('');

  // Track update source to prevent circular updates
  const updateSourceRef = useRef(null);
  const debounceTimerRef = useRef(null);

  /**
   * Notifies parent of changes with source tracking
   */
  const notifyChange = useCallback(
    (newParams, source = 'visual') => {
      updateSourceRef.current = source;
      if (onChange) {
        onChange(newParams);
      }
    },
    [onChange]
  );

  /**
   * Initialize from props only when coming from parent
   */
  useEffect(() => {
    // Only update if the change came from parent (not from internal edits)
    if (updateSourceRef.current === null || updateSourceRef.current === 'parent') {
      setParams(value);
      setQueryStringInput(toQueryString(value));
      setJsonInput(toJSON(value));
    }
    // Reset source after processing
    updateSourceRef.current = null;

    // Cleanup debounce timer on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [value]);

  /**
   * Handles visual tab changes
   */
  const handleParamChange = (index, field, val) => {
    const newParams = [...params];
    newParams[index][field] = val;
    setParams(newParams);
    setQueryStringInput(toQueryString(newParams));
    setJsonInput(toJSON(newParams));
    notifyChange(newParams);
  };

  const handleAddParam = () => {
    const newParams = [...params, { key: '', value: '' }];
    setParams(newParams);
    setQueryStringInput(toQueryString(newParams));
    setJsonInput(toJSON(newParams));
    notifyChange(newParams);
  };

  const handleRemoveParam = (index) => {
    const newParams = params.filter((_, i) => i !== index);
    setParams(newParams);
    setQueryStringInput(toQueryString(newParams));
    setJsonInput(toJSON(newParams));
    notifyChange(newParams);
  };

  /**
   * Handles query string input changes with debouncing
   */
  const handleQueryStringChange = useCallback(
    (e) => {
      const input = e.target.value;
      setQueryStringInput(input);

      // Clear previous debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Debounce the parsing and notification
      debounceTimerRef.current = setTimeout(() => {
        try {
          const result = parseAny(input);

          if (result.errors.length === 0) {
            updateSourceRef.current = 'queryString';
            setParams(result.params);
            setJsonInput(toJSON(result.params));
            notifyChange(result.params, 'queryString');
          }
        } catch (error) {
          // Silently ignore parsing errors during editing
        }
      }, 500); // 500ms debounce
    },
    [notifyChange]
  );

  /**
   * Handles JSON input changes with debouncing
   */
  const handleJsonChange = useCallback(
    (e) => {
      const input = e.target.value;
      setJsonInput(input);

      // Clear previous debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Debounce the parsing and notification
      debounceTimerRef.current = setTimeout(() => {
        try {
          const result = parseAny(input);

          if (result.errors.length === 0) {
            updateSourceRef.current = 'json';
            setParams(result.params);
            setQueryStringInput(toQueryString(result.params));
            notifyChange(result.params, 'json');
          }
        } catch (error) {
          // Silently ignore parsing errors during editing
        }
      }, 500); // 500ms debounce
    },
    [notifyChange]
  );

  /**
   * Tab items
   */
  const tabItems = [
    {
      key: 'visual',
      label: 'Visual',
      children: (
        <Space direction="vertical" style={{ width: '100%', gap: 16 }}>
          {params.map((param, index) => (
            <Space key={index} align="start" style={{ gap: 12 }}>
              <Input
                placeholder="Chave (ex.: página)"
                value={param.key}
                onChange={(e) => handleParamChange(index, 'key', e.target.value)}
              />
              <Input
                placeholder="Valor (ex.: 1)"
                value={param.value}
                onChange={(e) => handleParamChange(index, 'value', e.target.value)}
              />
              <Tooltip title="Remover parâmetro">
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveParam(index)}
                />
              </Tooltip>
            </Space>
          ))}

          <Button variant="outlined" icon={<PlusOutlined />} onClick={handleAddParam} block>
            Adicionar parâmetro para teste
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
          />
          <TextArea
            placeholder="page=1&pagesize=10&order=desc"
            value={queryStringInput}
            onChange={handleQueryStringChange}
            rows={6}
            style={{ fontFamily: 'monospace' }}
          />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Caracteres especiais serão codificados em URL automaticamente ao serem enviados para a
            API.
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
    <Card title="Parâmetros para requisição de teste" size="small">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </Space>
    </Card>
  );
};

export default QueryParamsEditor;
