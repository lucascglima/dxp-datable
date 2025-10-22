/**
 * Row Click Event Section Component
 *
 * Handles row click event configuration with code editor.
 * Extracted from events-config.section.jsx.
 */

import { useState } from 'react';
import { Card, Form, Switch, Alert, Space, Typography, Input } from 'antd';
import { CodeOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

const RowClickEventSection = ({ value, onChange }) => {
  const [codeError, setCodeError] = useState(null);

  const defaultValue = {
    enabled: false,
    code: "console.log('Row clicked:', record);",
  };

  const currentValue = value || defaultValue;

  /**
   * Handles enable/disable toggle
   */
  const handleToggle = (enabled) => {
    onChange({
      ...currentValue,
      enabled,
    });
  };

  /**
   * Handles code change
   */
  const handleCodeChange = (e) => {
    const code = e.target.value;
    setCodeError(null);

    // Basic syntax validation
    try {
      new Function('record', code);
    } catch (error) {
      setCodeError(error.message);
    }

    onChange({
      ...currentValue,
      code,
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
      ...currentValue,
      code: exampleCode,
    });
  };

  return (
    <Card
      title={
        <Space>
          <CodeOutlined />
          <Text strong>Evento de Clique na Linha</Text>
        </Space>
      }
      extra={
        <Switch
          checked={currentValue.enabled}
          onChange={handleToggle}
          checkedChildren="Habilitado"
          unCheckedChildren="Desabilitado"
        />
      }
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Defina o que acontece quando um usuário clica em uma linha da tabela. Os dados da linha
          estão disponíveis como a <code>record</code> variável.
        </Paragraph>

        {currentValue.enabled && (
          <>
            <Form.Item
              label="Código JavaScript"
              validateStatus={codeError ? 'error' : undefined}
              help={
                codeError ||
                'Escreva o código JavaScript para executar no clique da linha. A variável "record" contém os dados da linha.'
              }
            >
              <TextArea
                value={currentValue.code}
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

        {!currentValue.enabled && (
          <Alert
            message="Evento de clique na linha está desabilitado"
            description="Habilite o interruptor acima para configurar o comportamento personalizado de clique na linha."
            type="warning"
            showIcon
          />
        )}
      </Space>
    </Card>
  );
};

export default RowClickEventSection;
