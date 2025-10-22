/**
 * Pagination Configuration Section
 *
 * Form section for configuring table pagination settings.
 * Supports multiple pagination modes: disabled, client-side (auto), and API-based.
 */

import { Form, Select, Checkbox, Alert, Space, Radio, Input, Divider } from 'antd';
import { ApiOutlined, ThunderboltOutlined } from '@ant-design/icons';

const { Option } = Select;

const PaginationConfigSection = ({ value = {}, onChange }) => {
  const defaultPagination = {
    pageSize: 20,
    showPagination: true,
    mode: 'api', // 'api' | 'client'
    apiParamNames: {
      page: '_page',
      pageSize: '_page_size',
    },
    ...value,
  };

  /**
   * Handles page size change
   */
  const handlePageSizeChange = (pageSize) => {
    onChange({
      ...defaultPagination,
      pageSize,
    });
  };

  /**
   * Handles show pagination toggle
   */
  const handleShowPaginationChange = (e) => {
    onChange({
      ...defaultPagination,
      showPagination: e.target.checked,
    });
  };

  /**
   * Handles pagination mode change
   */
  const handleModeChange = (e) => {
    onChange({
      ...defaultPagination,
      mode: e.target.value,
    });
  };

  /**
   * Handles API parameter name changes
   */
  const handleParamNameChange = (field, value) => {
    onChange({
      ...defaultPagination,
      apiParamNames: {
        ...defaultPagination.apiParamNames,
        [field]: value,
      },
    });
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="Configurações de Paginação"
        description="Configure o comportamento da paginação: desabilite-a, use paginação do lado do cliente ou envie parâmetros de paginação para sua API."
        type="info"
      />

      {/* Show Pagination Toggle */}
      <Form.Item help="Desmarque para ocultar os controles de paginação e mostrar todos os itens em uma única página">
        <Checkbox
          checked={defaultPagination.showPagination}
          onChange={handleShowPaginationChange}
        >
          Mostrar controles de paginação
        </Checkbox>
      </Form.Item>

      {/* Show additional options only if pagination is enabled */}
      {defaultPagination.showPagination && (
        <>
          <Divider orientation="left">Modo de Paginação</Divider>

          {/* Pagination Mode */}
          <Form.Item
            label="Modo de Paginação"
            help="Escolha como a paginação é tratada"
          >
            <Radio.Group
              value={defaultPagination.mode}
              onChange={handleModeChange}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Radio value="api">
                  <Space>
                    <ApiOutlined />
                    <strong>Paginação por API</strong>
                    <span style={{ color: '#8c8c8c' }}>
                      - Enviar parâmetros de página para a API (lado do servidor)
                    </span>
                  </Space>
                </Radio>
                <Radio value="client">
                  <Space>
                    <ThunderboltOutlined />
                    <strong>Auto Paginação (Lado do cliente)</strong>
                    <span style={{ color: '#8c8c8c' }}>
                      - Carregar todos os dados uma vez, paginar no navegador
                    </span>
                  </Space>
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          {/* Items per Page */}
          <Form.Item
            label="Itens por Página"
            help="Número de linhas a serem exibidas em cada página"
          >
            <Select
              value={defaultPagination.pageSize}
              onChange={handlePageSizeChange}
              size="large"
              style={{ width: '100%' }}
            >
              <Option value={10}>10 itens</Option>
              <Option value={20}>20 itens</Option>
              <Option value={50}>50 itens</Option>
              <Option value={100}>100 itens</Option>
            </Select>
          </Form.Item>

          {/* API Parameter Names - Only show if mode is 'api' */}
          {defaultPagination.mode === 'api' && (
            <>
              <Divider orientation="left">Parâmetros da API</Divider>

              <Alert
                message="Nomes de Parâmetros de API Personalizados"
                description="Configure os nomes dos parâmetros de consulta que serão enviados para sua API para paginação."
                type="info"
                style={{ marginBottom: 16 }}
              />

              <Form.Item
                label="Nome do Parâmetro da Página"
                help="Nome do parâmetro de consulta para o número da página (ex.: ?_page=1)"
              >
                <Input
                  value={defaultPagination.apiParamNames?.page || '_page'}
                  onChange={(e) => handleParamNameChange('page', e.target.value)}
                  placeholder="_page"
                  size="large"
                  prefix={<ApiOutlined />}
                />
              </Form.Item>

              <Form.Item
                label="Nome do Parâmetro de Tamanho da Página"
                help="Nome do parâmetro de consulta para o tamanho da página (ex.: ?_page_size=20)"
              >
                <Input
                  value={defaultPagination.apiParamNames?.pageSize || '_page_size'}
                  onChange={(e) => handleParamNameChange('pageSize', e.target.value)}
                  placeholder="_page_size"
                  size="large"
                  prefix={<ApiOutlined />}
                />
              </Form.Item>

              <Alert
                message={`Exemplo de Chamada de API: ${defaultPagination.apiParamNames?.page || '_page'}=1&${defaultPagination.apiParamNames?.pageSize || '_page_size'}=${defaultPagination.pageSize}`}
                type="success"
                showIcon
              />
            </>
          )}

          {/* Client-side mode info */}
          {defaultPagination.mode === 'client' && (
            <Alert
              message="Paginação do Lado do Cliente Ativa"
              description="Todos os dados serão carregados da API uma vez. A paginação será tratada no navegador para melhor desempenho."
              type="success"
              showIcon
            />
          )}
        </>
      )}

      {/* Warning when pagination is disabled */}
      {!defaultPagination.showPagination && (
        <Alert
          message="Paginação Desabilitada"
          description="Todos os itens serão exibidos em uma única página sem controles de paginação. A API será chamada sem parâmetros de paginação para buscar todos os dados."
          type="warning"
          showIcon
        />
      )}

      {/* Warning for large page sizes */}
      {defaultPagination.showPagination && defaultPagination.pageSize > 50 && (
        <Alert
          message="Tamanho de Página Grande"
          description="Exibir muitos itens por página pode afetar o desempenho da página."
          type="info"
          closable
          showIcon
        />
      )}
    </Space>
  );
};

export default PaginationConfigSection;