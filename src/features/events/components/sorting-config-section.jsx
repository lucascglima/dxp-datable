/**
 * Sorting Configuration Section Component
 *
 * Handles column sorting configuration (server/client/disabled).
 * Extracted from events-config.section.jsx.
 */

import { Card, Form, Alert, Space, Typography, Input, Radio, Select } from 'antd';
import { SortAscendingOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

const SortingConfigSection = ({ value, onChange }) => {
  const defaultValue = {
    mode: 'server',
    serverConfig: {
      columnParam: '_columnSort',
      orderParam: '_sort',
      orderFormat: 'numeric',
      orderValues: {
        ascend: '1',
        descend: '-1',
      },
    },
  };

  const currentValue = value || defaultValue;

  /**
   * Handles sorting mode change
   */
  const handleModeChange = (e) => {
    const mode = e.target.value;
    onChange({
      ...currentValue,
      mode,
    });
  };

  /**
   * Handles server config changes
   */
  const handleServerConfigChange = (field, fieldValue) => {
    onChange({
      ...currentValue,
      serverConfig: {
        ...currentValue.serverConfig,
        [field]: fieldValue,
      },
    });
  };

  /**
   * Handles order format change
   */
  const handleOrderFormatChange = (format) => {
    let orderValues = { ascend: '1', descend: '-1' };
    if (format === 'numeric') {
      orderValues = { ascend: '1', descend: '-1' };
    }
    if (format === 'asc-desc') {    
      orderValues = { ascend: 'asc', descend: 'desc' };
    } else if (format === 'ascend-descend') {
      orderValues = { ascend: 'ascend', descend: 'descend' };
    }

    onChange({
      ...currentValue,
      serverConfig: {
        ...currentValue.serverConfig,
        orderFormat: format,
        orderValues,
      },
    });
  };

  return (
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
          Escolha como as colunas da tabela devem ser ordenadas quando os usuários clicam nos
          cabeçalhos das colunas.
        </Paragraph>

        <Form.Item label="Modo de Ordenação">
          <Radio.Group
            value={currentValue.mode}
            onChange={handleModeChange}
            buttonStyle="solid"
          >
            <Radio.Button value="server">Lado do Servidor (API)</Radio.Button>
            <Radio.Button value="client">Lado do Cliente (Navegador)</Radio.Button>
            <Radio.Button value="disabled">Desabilitado</Radio.Button>
          </Radio.Group>
        </Form.Item>

        {currentValue.mode === 'server' && (
          <>
            <Alert
              message="Ordenação do Lado do Servidor"
              description="Os parâmetros de ordenação serão enviados para sua API como parâmetros de consulta. Seu backend deve lidar com esses parâmetros e retornar dados ordenados."
              type="info"              
            />

            <Form.Item
              label="Nome do Parâmetro da Coluna"
              help="O nome do parâmetro de consulta para a coluna a ser ordenada (ex.: 'sortBy', '_columnSort')"
            >
              <Input
                value={currentValue.serverConfig.columnParam}
                onChange={(e) => handleServerConfigChange('columnParam', e.target.value)}
                placeholder="_columnSort"
              />
            </Form.Item>

            <Form.Item
              label="Nome do Parâmetro de Ordem"
              help="O nome do parâmetro de consulta para a ordem de ordenação (ex.: 'order', '_sort')"
            >
              <Input
                value={currentValue.serverConfig.orderParam}
                onChange={(e) => handleServerConfigChange('orderParam', e.target.value)}
                placeholder="_sort"
              />
            </Form.Item>

            <Form.Item
              label="Formato do Valor da Ordem"
              help="Como a direção da ordenação deve ser representada na consulta"
            >
              <Select
                value={currentValue.serverConfig.orderFormat}
                onChange={handleOrderFormatChange}
                style={{ width: '100%' }}
              >
                <Select.Option value="numeric">
                  Numérico (1 = ascendente, -1 = descendente)
                </Select.Option>
                <Select.Option value="asc-desc">
                  Texto reduzido (asc = ascendente, desc = descendente)
                </Select.Option>
                <Select.Option value="ascend-descend">
                  Texto completo (ascend = ascendente, descend = descendente)
                </Select.Option>
              </Select>
            </Form.Item>

            <Alert
              message="Exemplo de Consulta"
              description={
                <div>
                  <Text code>
                    ?{currentValue.serverConfig.columnParam}=name&
                    {currentValue.serverConfig.orderParam}=
                    {currentValue.serverConfig.orderValues.ascend}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Os parâmetros são adicionados apenas quando uma coluna é ordenada. Eles são
                    removidos quando a ordenação é limpa.
                  </Text>
                </div>
              }
              type="success"
              showIcon
              style={{ marginTop: '8px' }}
            />
          </>
        )}

        {currentValue.mode === 'client' && (
          <Alert
            message="Ordenação do Lado do Cliente"
            description="Os dados serão ordenados diretamente no navegador. Isso funciona bem para pequenos conjuntos de dados, mas pode ser lento para tabelas grandes. Nenhuma chamada de API é feita ao ordenar."            
            type="info"
          />
        )}

        {currentValue.mode === 'disabled' && (
          <Alert
            message="Ordenação Desabilitada"
            description="Os usuários não poderão ordenar colunas. Os cabeçalhos das colunas não serão clicáveis para ordenação."
            type="warning"
            showIcon
          />
        )}
      </Space>
    </Card>
  );
};

export default SortingConfigSection;
