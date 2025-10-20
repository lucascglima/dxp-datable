/**
 * Events Configuration Section
 *
 * Form section for configuring table events like row clicks.
 * Provides a code editor for custom JavaScript event handlers.
 */

import { useState } from 'react';
import { Form, Switch, Alert, Space, Typography, Input, Card, Radio, Select } from 'antd';
import { ThunderboltOutlined, CodeOutlined, SortAscendingOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

const EventsConfigSection = ({ value = {}, onChange }) => {
  const [codeError, setCodeError] = useState(null);

  // Default event configuration
  const defaultEvents = {
    onRowClick: {
      enabled: false,
      code: "console.log('Row clicked:', record);",
    },
    sorting: {
      mode: 'server', // 'server' | 'client' | 'disabled'
      serverConfig: {
        columnParam: '_columnSort',
        orderParam: '_sort',
        orderFormat: 'numeric', // 'numeric' | 'text' | 'antd'
        orderValues: {
          ascend: '1',
          descend: '-1',
        },
      },
    },
  };

  const currentEvents = value || defaultEvents;
  const sortingConfig = currentEvents.sorting || defaultEvents.sorting;

  /**
   * Handles enable/disable toggle for row click event
   */
  const handleRowClickToggle = (enabled) => {
    onChange({
      ...currentEvents,
      onRowClick: {
        ...currentEvents.onRowClick,
        enabled,
      },
    });
  };

  /**
   * Handles code change for row click event
   */
  const handleCodeChange = (e) => {
    const code = e.target.value;
    setCodeError(null);

    // Basic syntax validation
    try {
      // Test if code can be compiled as a function
      new Function('record', code);
    } catch (error) {
      setCodeError(error.message);
    }

    onChange({
      ...currentEvents,
      onRowClick: {
        ...currentEvents.onRowClick,
        code,
      },
    });
  };

  /**
   * Loads example code
   */
  const handleLoadExample = () => {
    const exampleCode = `// Access row data
console.log('User clicked:', record);

// Show alert with row data
alert('Name: ' + record.name + '\\nEmail: ' + record.email);

// You can use any JavaScript here!`;

    onChange({
      ...currentEvents,
      onRowClick: {
        ...currentEvents.onRowClick,
        code: exampleCode,
      },
    });
  };

  /**
   * Handles sorting mode change
   */
  const handleSortingModeChange = (e) => {
    const mode = e.target.value;
    onChange({
      ...currentEvents,
      sorting: {
        ...sortingConfig,
        mode,
      },
    });
  };

  /**
   * Handles server config changes
   */
  const handleServerConfigChange = (field, value) => {
    onChange({
      ...currentEvents,
      sorting: {
        ...sortingConfig,
        serverConfig: {
          ...sortingConfig.serverConfig,
          [field]: value,
        },
      },
    });
  };

  /**
   * Handles order format change
   */
  const handleOrderFormatChange = (format) => {
    let orderValues = { ascend: '1', descend: '-1' };

    if (format === 'text') {
      orderValues = { ascend: 'asc', descend: 'desc' };
    } else if (format === 'antd') {
      orderValues = { ascend: 'ascend', descend: 'descend' };
    }

    onChange({
      ...currentEvents,
      sorting: {
        ...sortingConfig,
        serverConfig: {
          ...sortingConfig.serverConfig,
          orderFormat: format,
          orderValues,
        },
      },
    });
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="Configuração de Eventos"
        description="Configure manipuladores de eventos personalizados para sua tabela. Use JavaScript para definir o que acontece quando os usuários interagem com seus dados."
        type="info"
        showIcon
        icon={<ThunderboltOutlined />}
      />

      {/* Row Click Event Section */}
      <Card
        title={
          <Space>
            <CodeOutlined />
            <Text strong>Evento de Clique na Linha</Text>
          </Space>
        }
        extra={
          <Switch
            checked={currentEvents.onRowClick?.enabled || false}
            onChange={handleRowClickToggle}
            checkedChildren="Habilitado"
            unCheckedChildren="Desabilitado"
          />
        }
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            Defina o que acontece quando um usuário clica em uma linha da tabela. Os dados da linha estão disponíveis
            como a <code>record</code> variável.
          </Paragraph>

          {currentEvents.onRowClick?.enabled && (
            <>
              <Form.Item
                label="Código JavaScript"
                validateStatus={codeError ? 'error' : undefined}
                help={codeError || 'Escreva o código JavaScript para executar no clique da linha. A variável "record" contém os dados da linha.'}
              >
                <TextArea
                  value={currentEvents.onRowClick?.code || ''}
                  onChange={handleCodeChange}
                  placeholder="console.log('Row clicked:', record);"
                  rows={10}
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '13px',
                  }}
                />
              </Form.Item>

              <Alert
                message="Variáveis Disponíveis"
                description={
                  <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                    <li>
                      <code>record</code> - Objeto contendo todos os dados da linha clicada
                    </li>
                    <li>
                      <code>console</code> - Use console.log() para depurar
                    </li>
                    <li>
                      <code>alert()</code> - Mostrar caixas de diálogo de alerta
                    </li>
                  </ul>
                }
                type="info"
                showIcon
              />

              <div style={{ display: 'flex', gap: '8px' }}>
                <a onClick={handleLoadExample} style={{ fontSize: '13px' }}>
                  Carregar Código de Exemplo
                </a>
              </div>
            </>
          )}

          {!currentEvents.onRowClick?.enabled && (
            <Alert
              message="Evento de clique na linha está desabilitado"
              description="Habilite o interruptor acima para configurar o comportamento personalizado de clique na linha."
              type="warning"
              showIcon
            />
          )}
        </Space>
      </Card>

      {/* Sorting Configuration Section */}
      <Card
        title={
          <Space>
            <SortAscendingOutlined />
            <Text strong>Ordenação de Colunas</Text>
          </Space>
        }
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            Escolha como as colunas da tabela devem ser ordenadas quando os usuários clicam nos cabeçalhos das colunas.
          </Paragraph>

          <Form.Item label="Modo de Ordenação">
            <Radio.Group
              value={sortingConfig.mode}
              onChange={handleSortingModeChange}
              buttonStyle="solid"
            >
              <Radio.Button value="server">Lado do Servidor (API)</Radio.Button>
              <Radio.Button value="client">Lado do Cliente (Navegador)</Radio.Button>
              <Radio.Button value="disabled">Desabilitado</Radio.Button>
            </Radio.Group>
          </Form.Item>

          {sortingConfig.mode === 'server' && (
            <>
              <Alert
                message="Ordenação do Lado do Servidor"
                description="Os parâmetros de ordenação serão enviados para sua API como parâmetros de consulta. Seu backend deve lidar com esses parâmetros e retornar dados ordenados."
                type="info"
                showIcon
              />

              <Form.Item
                label="Nome do Parâmetro da Coluna"
                help="O nome do parâmetro de consulta para a coluna a ser ordenada (ex.: 'sortBy', '_columnSort')"
              >
                <Input
                  value={sortingConfig.serverConfig.columnParam}
                  onChange={(e) => handleServerConfigChange('columnParam', e.target.value)}
                  placeholder="_columnSort"
                />
              </Form.Item>

              <Form.Item
                label="Nome do Parâmetro de Ordem"
                help="O nome do parâmetro de consulta para a ordem de ordenação (ex.: 'order', '_sort')"
              >
                <Input
                  value={sortingConfig.serverConfig.orderParam}
                  onChange={(e) => handleServerConfigChange('orderParam', e.target.value)}
                  placeholder="_sort"
                />
              </Form.Item>

              <Form.Item
                label="Formato do Valor da Ordem"
                help="Como a direção da ordenação deve ser representada na consulta"
              >
                <Select
                  value={sortingConfig.serverConfig.orderFormat}
                  onChange={handleOrderFormatChange}
                  style={{ width: '100%' }}
                >
                  <Select.Option value="numeric">
                    Numérico (1 = ascendente, -1 = descendente)
                  </Select.Option>
                  <Select.Option value="text">
                    Texto reduzido (asc = ascendente, desc = descendente)
                  </Select.Option>
                  <Select.Option value="antd">
                    Texto completo (ascend = ascendente, descend = descendente)
                  </Select.Option>
                </Select>
              </Form.Item>

              <Alert
                message="Exemplo de Consulta"
                description={
                  <div>
                    <Text code>
                      ?{sortingConfig.serverConfig.columnParam}=name&
                      {sortingConfig.serverConfig.orderParam}={sortingConfig.serverConfig.orderValues.ascend}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Os parâmetros são adicionados apenas quando uma coluna é ordenada. Eles são removidos quando a ordenação é limpa.
                    </Text>
                  </div>
                }
                type="success"
                showIcon
                style={{ marginTop: '8px' }}
              />
            </>
          )}

          {sortingConfig.mode === 'client' && (
            <Alert
              message="Ordenação do Lado do Cliente"
              description="Os dados serão ordenados diretamente no navegador. Isso funciona bem para pequenos conjuntos de dados, mas pode ser lento para tabelas grandes. Nenhuma chamada de API é feita ao ordenar."
              type="info"
              showIcon
            />
          )}

          {sortingConfig.mode === 'disabled' && (
            <Alert
              message="Ordenação Desabilitada"
              description="Os usuários não poderão ordenar colunas. Os cabeçalhos das colunas não serão clicáveis para ordenação."
              type="warning"
              showIcon
            />
          )}
        </Space>
      </Card>

    </Space>
  );
};

export default EventsConfigSection;