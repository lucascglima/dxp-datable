/**
 * Default Query Params Editor Component
 *
 * Editor for default query parameters that are sent with all API requests
 * Each parameter has an enabled/disabled checkbox
 *
 * Features:
 * - Visual key-value interface with enable/disable toggle
 * - Parameters are sent to API only when enabled
 * - Used in both table data fetching and test requests
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Card,
  Input,
  Button,
  Space,
  Alert,
  Typography,
  Checkbox,

} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

const DefaultQueryParamsEditor = ({ value = [], onChange }) => {
  const [params, setParams] = useState(value);

  // Track update source to prevent circular updates
  const updateSourceRef = useRef(null);

  /**
   * Notifies parent of changes with source tracking
   */
  const notifyChange = useCallback((newParams, source = 'visual') => {
    updateSourceRef.current = source;
    if (onChange) {
      onChange(newParams);
    }
  }, [onChange]);

  /**
   * Initialize from props only when coming from parent
   */
  useEffect(() => {
    // Only update if the change came from parent (not from internal edits)
    if (updateSourceRef.current === null || updateSourceRef.current === 'parent') {
      setParams(value);
    }
    // Reset source after processing
    updateSourceRef.current = null;
  }, [value]);

  /**
   * Handles parameter changes
   */
  const handleParamChange = (index, field, val) => {
    const newParams = [...params];
    newParams[index][field] = val;
    setParams(newParams);
    notifyChange(newParams);
  };

  const handleAddParam = () => {
    const newParams = [
      ...params,
      { key: '', value: '', enabled: true }, // New params are enabled by default
    ];
    setParams(newParams);
    notifyChange(newParams);
  };

  const handleRemoveParam = (index) => {
    const newParams = params.filter((_, i) => i !== index);
    setParams(newParams);
    notifyChange(newParams);
  };


  return (
    <Card title="Parâmetros de consulta (Query)" size="small">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Alert
          message="Parâmetros de consultas estáticas (Query)"
          description="Esses parâmetros serão enviados com todas as requisições da API (tanto para os dados da tabela quanto para os testes). Use a caixa de seleção para ativar/desativar cada parâmetro."
          type="info"          
          icon={<InfoCircleOutlined />}
          
        />

        {/* Parameters editor */}
        {params.length > 0 && (
          <>
            {params.map((param, index) => (
              <div key={index}>
                <Space style={{ width: '100%' }} align="start">
                  <Checkbox
                    checked={param.enabled !== false} // Default to true if undefined
                    onChange={(e) =>
                      handleParamChange(index, 'enabled', e.target.checked)
                    }
                    style={{ marginTop: 8 }}
                  />
                  <Input
                    placeholder="Chave (ex: site)"
                    value={param.key}
                    onChange={(e) => handleParamChange(index, 'key', e.target.value)}
                    style={{ width: 150 }}
                    disabled={!param.enabled}
                  />
                  <Input
                    placeholder="Valor (ex: stackoverflow)"
                    value={param.value}
                    onChange={(e) => handleParamChange(index, 'value', e.target.value)}
                    style={{ width: 200 }}
                    disabled={!param.enabled}
                  />
            
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveParam(index)}
                  />
                </Space>
                <Text
                  type="secondary"
                  style={{
                    fontSize: 11,
                    marginLeft: 32,
                    display: 'block',
                    marginTop: 4,
                  }}
                >
                  {param.enabled
                    ? `Será enviado: ?${param.key || '...'}=${param.value || '...'}`
                    : 'Desativado - não será enviado nas requisições'}
                </Text>
              </div>
            ))}
          </>
        )}

        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={handleAddParam}
          block
        >
          Adicionar Parâmetro de Consulta Padrão
        </Button>

        {/* Example section */}
        {params.length === 0 && (
          <Alert
            message="Exemplo de uso"
            description={
              <div>
                <Text>
                  Se a sua API sempre exige certos parâmetros como{' '}
                  <Text code>site=stackoverflow</Text> ou{' '}
                  <Text code>filter=withbody</Text>, adicione-os aqui. Você pode
                  desativá-los temporariamente sem excluir usando a caixa de seleção.
                </Text>
              </div>
            }
        
          
          />
        )}
      </Space>
    </Card>
  );
};

export default DefaultQueryParamsEditor;
