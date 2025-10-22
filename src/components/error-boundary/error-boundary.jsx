/**
 * Error Boundary Component
 *
 * Catches JavaScript errors in child components and displays a fallback UI.
 * Prevents entire app from crashing when a component fails.
 *
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 *
 * Or with custom fallback:
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <YourComponent />
 * </ErrorBoundary>
 */

import React from 'react';
import { Alert, Button, Card, Space, Typography } from 'antd';
import { WarningOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error details:', errorInfo);

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // You can also log to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    // Reset error state and try to recover
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback provided by parent
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <Card
          style={{
            margin: '16px 0',
            border: '1px solid #ff4d4f',
            backgroundColor: '#fff2f0',
          }}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Alert
              message="Algo deu errado"
              description="Ocorreu um erro ao renderizar este componente. Você pode tentar recarregar ou continuar usando outras partes da aplicação."
              type="error"
              showIcon
              icon={<WarningOutlined />}
            />

            <Space>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={this.handleReset}
              >
                Tentar Novamente
              </Button>
              <Button onClick={() => window.location.reload()}>
                Recarregar Página
              </Button>
            </Space>

            {/* Show error details in development mode */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Card
                size="small"
                title="Detalhes do Erro (Apenas em Desenvolvimento)"
                style={{ marginTop: 16 }}
              >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div>
                    <Text strong>Mensagem:</Text>
                    <pre style={{
                      background: '#f5f5f5',
                      padding: '8px',
                      borderRadius: '4px',
                      overflow: 'auto'
                    }}>
                      {this.state.error.toString()}
                    </pre>
                  </div>

                  {this.state.errorInfo && (
                    <div>
                      <Text strong>Stack Trace:</Text>
                      <pre style={{
                        background: '#f5f5f5',
                        padding: '8px',
                        borderRadius: '4px',
                        overflow: 'auto',
                        maxHeight: '200px'
                      }}>
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </Space>
              </Card>
            )}
          </Space>
        </Card>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
