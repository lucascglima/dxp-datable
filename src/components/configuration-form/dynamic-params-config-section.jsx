/**
 * Dynamic Parameters Configuration Section
 *
 * Form section for configuring dynamic search and filter parameters.
 * Provides UI for enabling/disabling search input and other dynamic filters.
 */

import React from 'react';
import { Form, Switch, Alert, Space, Typography, Input, Card, Divider } from 'antd';
import { SearchOutlined, FilterOutlined, CalendarOutlined } from '@ant-design/icons';
import { SearchInputParam } from '../dynamic-params';
import { defaultDynamicParamsConfig } from '../dynamic-params/dynamic-params.types';

const { Text, Paragraph } = Typography;

const DynamicParamsConfigSection = ({ value = {}, onChange }) => {
  // Merge with default config to ensure all fields exist
  const currentConfig = {
    ...defaultDynamicParamsConfig,
    ...value,
    searchInput: {
      ...defaultDynamicParamsConfig.searchInput,
      ...(value?.searchInput || {}),
    },
  };

  /**
   * Handles search input enable/disable toggle
   */
  const handleSearchInputToggle = (enabled) => {
    onChange({
      ...currentConfig,
      searchInput: {
        ...currentConfig.searchInput,
        enabled,
      },
    });
  };

  /**
   * Handles query param name change
   */
  const handleQueryParamNameChange = (e) => {
    const queryParamName = e.target.value;
    onChange({
      ...currentConfig,
      searchInput: {
        ...currentConfig.searchInput,
        queryParamName,
      },
    });
  };

  /**
   * Handles placeholder change
   */
  const handlePlaceholderChange = (e) => {
    const placeholder = e.target.value;
    onChange({
      ...currentConfig,
      searchInput: {
        ...currentConfig.searchInput,
        placeholder,
      },
    });
  };

  /**
   * Loads example configuration
   */
  const handleLoadExample = () => {
    onChange({
      ...currentConfig,
      searchInput: {
        enabled: true,
        queryParamName: 'search',
        placeholder: 'Buscar por nome, e-mail',
        currentValue: '',
      },
    });
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="Configuração de Parâmetros Dinâmicos"
        description="Configure parâmetros dinâmicos de busca e filtros que aparecem acima da tabela. Esses parâmetros permitem que os usuários filtrem os dados em tempo real."
        type="info"
        showIcon
        icon={<FilterOutlined />}
      />

      {/* Search Input Parameter Section */}
      <Card
        title={
          <Space>
            <SearchOutlined />
            <Text strong>Campo de Busca</Text>
          </Space>
        }
        extra={
          <Switch
            checked={currentConfig.searchInput?.enabled || false}
            onChange={handleSearchInputToggle}
            checkedChildren="Ativado"
            unCheckedChildren="Desativado"
          />
        }
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            Adicione um campo de busca acima da tabela. O valor digitado será enviado à sua API como um parâmetro de consulta após o usuário parar de digitar (1 segundo de atraso).
          </Paragraph>

          {currentConfig.searchInput?.enabled && (
            <>
              <Form.Item
                label="Nome do Parâmetro de Consulta*"
                help="Nome do parâmetro que será enviado à API (ex: 'search', 'q', 'filter')"
                
              >
                <Input
                  value={currentConfig.searchInput?.queryParamName || ''}
                  onChange={handleQueryParamNameChange}
                  placeholder="search"
                />
              </Form.Item>

              <Form.Item
                label="Texto do Placeholder"
                help="O texto exibido dentro do campo de busca"
              >
                <Input
                  value={currentConfig.searchInput?.placeholder || ''}
                  onChange={handlePlaceholderChange}
                  placeholder="Buscar..."
                />
              </Form.Item>

              <Divider orientation="left">
                <Text type="secondary" style={{ fontSize: '13px' }}>
                  Pré-visualização
                </Text>
              </Divider>

              <SearchInputParam
                placeholder={currentConfig.searchInput?.placeholder || 'Buscar...'}
                disabled
                style={{ width: '100%' }}
              />

              <Alert
                message="Como funciona"
                description={
                  <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                    <li>O usuário digita no campo de busca acima da tabela</li>
                    <li>Após 1 segundo sem digitar, o valor é enviado à API</li>
                    <li>
                      A API recebe: <code>?{currentConfig.searchInput?.queryParamName}=valor_da_busca</code>
                    </li>
                    <li>
                      O valor de busca é salvo no localStorage e restaurado ao recarregar a página
                    </li>
                  </ul>
                }
                type="info"
                showIcon
              />

              <div style={{ display: 'flex', gap: '8px' }}>
                <a onClick={handleLoadExample} style={{ fontSize: '13px' }}>
                  Carregar Configuração de Exemplo
                </a>
              </div>
            </>
          )}

          {!currentConfig.searchInput?.enabled && (
            <Alert
              message="Campo de busca desativado"
              description="Ative o interruptor acima para configurar um campo de busca que aparecerá acima da tabela."
              type="warning"
              showIcon
            />
          )}
        </Space>
      </Card>

      {/* Future Parameters Placeholder */}
      <Card
        title={
          <Space>
            <CalendarOutlined />
            <Text strong>Mais Parâmetros em Breve</Text>
          </Space>
        }
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            Versões futuras incluirão parâmetros dinâmicos adicionais:
          </Paragraph>
          <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
            <li>
              <Text disabled>Selecionador de Intervalo de Datas – Filtrar por períodos</Text>
            </li>
            <li>
              <Text disabled>Seletor de Abas – Filtrar por categorias</Text>
            </li>
            <li>
              <Text disabled>Filtros Dropdown – Seleção única ou múltipla</Text>
            </li>
            <li>
              <Text disabled>Parâmetros Personalizados – Defina seus próprios tipos de parâmetro</Text>
            </li>
          </ul>
        </Space>
      </Card>
    </Space>
  );
};

export default DynamicParamsConfigSection;
