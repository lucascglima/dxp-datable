/**
 * API Configuration Section
 *
 * Form section for configuring API endpoint and authentication.
 * Provides URL validation and example loading functionality.
 */

import React, { useState } from 'react';
import { Form, Input, Button, Alert, Space, Divider } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { validateUrl } from '../../utils/api-validator';
import { UrlParamsEditor, DefaultQueryParamsEditor } from '../shared';

const ApiConfigSection = ({ value = {}, onChange }) => {
  const [urlValidation, setUrlValidation] = useState(null);

  const handleEndpointChange = (e) => {
    const url = e.target.value;
    const validation = validateUrl(url);
    setUrlValidation(validation);

    onChange({
      ...value,
      apiEndpoint: url,
    });
  };

  /**
   * Handles auth token change
   */

  const handleTokenChange = (e) => {
    onChange({
      ...value,
      authToken: e.target.value,
    });
  };
  
  /**
   * Handles URL params change
   */
    const handleUrlParamsChange = (urlParams) => {
    onChange({
      ...value,
      urlParams,
    });
  };

  /**
   * Handles default query params change
   */
  const handleDefaultQueryParamsChange = (defaultQueryParams) => {
    onChange({
      ...value,
      defaultQueryParams,
    });
  };

  /**
   * Loads example API configuration
   */
  const handleLoadExample = () => {
    onChange({
      ...value,
      apiEndpoint: 'https://jsonplaceholder.typicode.com/users',
      authToken: '',
      urlParams: [],
      defaultQueryParams: [],
    });
    setUrlValidation({ valid: true, severity: 'success' });
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="Configuração da API"
        description="Configure o endpoint da API de onde você deseja buscar os dados. Você pode usar qualquer API REST que retorne dados em JSON."
        type="info"
      />

      <Form.Item
        
        label="URL do Endpoint da API*"
      
        validateStatus={
          urlValidation
            ? urlValidation.valid
              ? 'success'
              : 'error'
            : undefined
        }
        help={
          urlValidation?.error ||
          urlValidation?.warning ||
          'Digite a URL completa do endpoint da sua API'
        }
      >
        <Input
          value={value.apiEndpoint}
          onChange={handleEndpointChange}
          placeholder="https://jsonplaceholder.typicode.com/users"
          prefix={<LinkOutlined />}
          size="large"
        />
        {urlValidation?.fixedUrl && (
          <Button
            type="link"
            size="small"
            onClick={() => {
              onChange({
                ...value,
                apiEndpoint: urlValidation.fixedUrl,
              });
              setUrlValidation(validateUrl(urlValidation.fixedUrl));
            }}
          >
            Usar URL sugerida: {urlValidation.fixedUrl}
          </Button>
        )}
      </Form.Item>

      <UrlParamsEditor
        value={value.urlParams || []}
        onChange={handleUrlParamsChange}
        currentUrl={value.apiEndpoint || ''}
      />

      <DefaultQueryParamsEditor
        value={value.defaultQueryParams || []}
        onChange={handleDefaultQueryParamsChange}
      />

      <Divider orientation="left">Autenticação</Divider>

      <Form.Item
        layout="vertical"
        label="Token de Autenticação (Opcional)"
        help="Deixe em branco se sua API não exigir autenticação. Use o formato Bearer para tokens JWT."
      >
        <Input.Password          
          value={value.authToken}
          onChange={handleTokenChange}
          placeholder="Bearer seu-token-aqui ou deixe em branco"          
        />
      </Form.Item>

      <Form.Item layout="vertical" label="Método da Requisição">
        <Input value="GET" disabled size="small" />
        <span style={{ fontSize: '12px', color: '#666' }}>
          Apenas requisições GET são suportadas nesta versão
        </span>
      </Form.Item>

      <Button
        type="dashed"
        icon={<LinkOutlined />}
        onClick={handleLoadExample}
        block
      >
        Carregar API de Exemplo (Usuários do JSONPlaceholder)
      </Button>
    </Space>
  );
};

export default ApiConfigSection;
