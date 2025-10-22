/**
 * API Test Panel Component
 *
 * Handles API connection testing and displays results.
 * Extracted from preview-section.jsx.
 */

import { Button, Alert, Space } from 'antd';
import { ApiOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const ApiTestPanel = ({ apiEndpoint, testing, testResult, onTest }) => {
  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {/* Test Button */}
      <Button
        type="primary"
        icon={<ApiOutlined />}
        onClick={onTest}
        loading={testing}
        disabled={!apiEndpoint}
        size="large"
        block
      >
        {testing ? 'Testando Conexão...' : 'Testar conexão com a API'}
      </Button>

      {/* Warning when no endpoint */}
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
              <Space>Conexão bem-sucedida</Space>
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
            ) : testResult.errors ? (
              <div>
                <div>{testResult.message}</div>
                <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
                  {testResult.errors.map((error, i) => (
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
    </Space>
  );
};

export default ApiTestPanel;
