/**
 * Preview Section
 *
 * Tests API connection and displays response structure.
 * Helps users understand their data and suggests column configurations.
 */

import  { useState } from 'react';
import {
  Button,
  Alert,
  Space,
  Collapse,
  Tag,
  Typography,
  Spin,
  Card,
} from 'antd';
import {
  ApiOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { testConnection, parseResponseStructure } from '../../services/external-api';
import { validateUrl } from '../../utils/api-validator';

const { Text, Paragraph } = Typography;

const PreviewSection = ({ apiEndpoint, authToken, onSuggestColumns }) => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [parsedStructure, setParsedStructure] = useState(null);

  /**
   * Tests API connection and parses response
   */
  const handleTestConnection = async () => {
    // Validate URL first
    const urlValidation = validateUrl(apiEndpoint);
    if (!urlValidation.valid) {
      setTestResult({
        success: false,
        message: urlValidation.error || 'Invalid URL',
      });
      return;
    }

    setTesting(true);
    setTestResult(null);
    setParsedStructure(null);

    try {
      const result = await testConnection(apiEndpoint, authToken);
      setTestResult(result);

      if (result.success && result.sampleData) {
        const structure = parseResponseStructure(result.sampleData);
        setParsedStructure(structure);
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: error.message || 'Connection test failed',
      });
    } finally {
      setTesting(false);
    }
  };

  /**
   * Applies suggested columns to configuration
   */
  const handleApplySuggestions = () => {
    if (parsedStructure?.suggestedColumns) {
      onSuggestColumns(parsedStructure.suggestedColumns);
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="Test & Preview"
        description="Test your API connection and preview the data structure to help configure columns."
        type="info"
        showIcon
        icon={<ApiOutlined />}
      />

      <Button
        type="primary"
        icon={<ApiOutlined />}
        onClick={handleTestConnection}
        loading={testing}
        disabled={!apiEndpoint}
        size="large"
        block
      >
        {testing ? 'Testing Connection...' : 'Test API Connection'}
      </Button>

      {!apiEndpoint && (
        <Alert
          message="API endpoint required"
          description="Please enter an API endpoint URL above before testing"
          type="warning"
          showIcon
        />
      )}

      {testResult && (
        <Alert
          message={
            testResult.success ? (
              <Space>
                <CheckCircleOutlined />
                Connection Successful
              </Space>
            ) : (
              <Space>
                <CloseCircleOutlined />
                Connection Failed
              </Space>
            )
          }
          description={testResult.message}
          type={testResult.success ? 'success' : 'error'}
          showIcon
        />
      )}

      {parsedStructure && parsedStructure.isValid && (
        <Card title="Response Structure" size="small">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Alert
              message={`Found ${parsedStructure.fields.length} fields in API response`}
              type="info"
              showIcon
              icon={<InfoCircleOutlined />}
            />

            <Collapse
              items={[
                {
                  key: 'fields',
                  label: 'Available Fields',
                  children: (
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {parsedStructure.fields.map((field) => (
                        <Card key={field.name} size="small" type="inner">
                          <Space direction="vertical" style={{ width: '100%' }}>
                            <Space>
                              <Text strong>{field.name}</Text>
                              <Tag color="blue">{field.type}</Tag>
                              {field.suggestAsColumn && (
                                <Tag color="green">Recommended for column</Tag>
                              )}
                            </Space>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              Sample: {JSON.stringify(field.sampleValue)}
                            </Text>
                          </Space>
                        </Card>
                      ))}
                    </Space>
                  ),
                },
                {
                  key: 'json',
                  label: 'Sample Data (JSON)',
                  children: (
                    <pre
                      style={{
                        background: '#f5f5f5',
                        padding: '12px',
                        borderRadius: '4px',
                        overflow: 'auto',
                        maxHeight: '300px',
                      }}
                    >
                      {JSON.stringify(parsedStructure.sampleData, null, 2)}
                    </pre>
                  ),
                },
              ]}
            />

            {parsedStructure.suggestedColumns &&
              parsedStructure.suggestedColumns.length > 0 && (
                <>
                  <Alert
                    message="Column Suggestions Available"
                    description={`We found ${parsedStructure.suggestedColumns.length} fields that would work well as table columns. Click below to auto-configure them.`}
                    type="success"
                    showIcon
                  />

                  <Button
                    type="primary"
                    onClick={handleApplySuggestions}
                    block
                  >
                    Apply Suggested Columns ({parsedStructure.suggestedColumns.length})
                  </Button>

                  <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: 8 }}>
                    This will replace your current column configuration with suggested columns based on the API response.
                  </Paragraph>
                </>
              )}
          </Space>
        </Card>
      )}
    </Space>
  );
};

export default PreviewSection;
