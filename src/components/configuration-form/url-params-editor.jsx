/**
 * URL Params Editor Component
 *
 * Editor for URL path variables (e.g., :version, :userId)
 * Supports visual editing with auto-detection of variables in URL
 *
 * Features:
 * - Auto-detects path variables from URL
 * - Visual key-value interface
 * - Validation of missing/unused parameters
 * - Real-time URL preview with replaced values
 */

import { useState, useEffect } from 'react';
import {
  Card,
  Input,
  Button,
  Space,
  Alert,
  Typography,
  Tag,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import {
  extractUrlVariables,
  validateUrlParams,
  replaceUrlParams,
  hasUrlVariables,
} from '../../utils/url-params-replacer';

const { Text } = Typography;

const UrlParamsEditor = ({ value = [], onChange, currentUrl = '' }) => {
  const [params, setParams] = useState(value);
  const [validation, setValidation] = useState(null);
  const [urlPreview, setUrlPreview] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * Initialize from props
   */
  useEffect(() => {
    if (!isUpdating && value) {
      setParams(value);
      updateValidation(value);
    }
  }, [value, isUpdating]);

  /**
   * Update validation when URL or params change
   */
  useEffect(() => {
    updateValidation(params);
  }, [currentUrl, params]);

  /**
   * Updates validation and preview
   */
  const updateValidation = (currentParams) => {
    if (!currentUrl || !hasUrlVariables(currentUrl)) {
      setValidation(null);
      setUrlPreview(null);
      return;
    }

    // Validate params
    const validationResult = validateUrlParams(currentUrl, currentParams);
    setValidation(validationResult);

    // Generate preview
    const previewResult = replaceUrlParams(currentUrl, currentParams);
    setUrlPreview(previewResult);
  };

  /**
   * Notifies parent of changes
   */
  const notifyChange = (newParams) => {
    setIsUpdating(true);
    if (onChange) {
      onChange(newParams);
    }
    setTimeout(() => setIsUpdating(false), 0);
  };

  /**
   * Handles parameter changes
   */
  const handleParamChange = (index, field, val) => {
    const newParams = [...params];
    newParams[index][field] = val;
    setParams(newParams);
    updateValidation(newParams);
    notifyChange(newParams);
  };

  const handleAddParam = () => {
    const newParams = [...params, { key: '', value: '' }];
    setParams(newParams);
    updateValidation(newParams);
    notifyChange(newParams);
  };

  const handleRemoveParam = (index) => {
    const newParams = params.filter((_, i) => i !== index);
    setParams(newParams);
    updateValidation(newParams);
    notifyChange(newParams);
  };

  /**
   * Auto-detects and suggests parameters from URL
   */
  const handleAutoDetect = () => {
    if (!currentUrl) return;

    const variables = extractUrlVariables(currentUrl);
    const newParams = [];

    variables.forEach((varName) => {
      // Check if param already exists
      const existing = params.find((p) => p.key === varName);
      if (existing) {
        newParams.push(existing);
      } else {
        newParams.push({ key: varName, value: '' });
      }
    });

    setParams(newParams);
    updateValidation(newParams);
    notifyChange(newParams);
  };

  // Check if URL has variables
  const hasVariables = currentUrl && hasUrlVariables(currentUrl);
  const detectedVariables = hasVariables ? extractUrlVariables(currentUrl) : [];

  return (
    <Card title="URL Params (Path Variables)" size="small">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Alert
          message="Configure path variables in your URL"
          description="Path variables like :version or :userId will be replaced with the values you define here. Example: https://api.com/:version/users → https://api.com/2.3/users"
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
        />

    

        {!hasVariables && currentUrl && (
          <Alert
            message="No path variables detected in the URL"
            description="Path variables start with ':' (e.g., :version, :userId). Your URL doesn't contain any."
            type="info"
            showIcon
          />
        )}

        {/* Parameters editor */}
        {params.length > 0 && (
          <>
            {params.map((param, index) => {
              const isUsed = detectedVariables.includes(param.key);
              const isEmpty = !param.value || param.value.trim() === '';

              return (
                <Space key={index} style={{ width: '100%' }} align="start">
                  <Input
                    placeholder="Variable name (e.g., version)"
                    value={param.key}
                    onChange={(e) => handleParamChange(index, 'key', e.target.value)}
                    style={{ width: 150 }}
                    
                    status={!isUsed && param.key ? 'warning' : undefined}
                  />
                  <Input
                    placeholder="Value (e.g., 2.3)"
                    value={param.value}
                    onChange={(e) => handleParamChange(index, 'value', e.target.value)}
                    style={{ width: 200 }}
                    status={isEmpty ? 'error' : undefined}
                  />
                  {!isUsed && param.key && (
                    <Tag color="orange" icon={<WarningOutlined />}>
                      Not used in URL
                    </Tag>
                  )}
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveParam(index)}
                  />
                </Space>
              );
            })}
          </>
        )}

        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={handleAddParam}
          block
        >
          Add URL Parameter
        </Button>

        {/* Validation messages */}
        {validation && (
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            {validation.valid && (
              <Alert
                message="All URL parameters are configured correctly"
                type="success"
                showIcon
                icon={<CheckCircleOutlined />}
              />
            )}

            {validation.errors.length > 0 && (
              <Alert
                message="Configuration errors"
                description={
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {validation.errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                }
                type="error"
                showIcon
              />
            )}

            {validation.warnings.length > 0 && (
              <Alert
                message="Warnings"
                description={
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {validation.warnings.map((warning, i) => (
                      <li key={i}>{warning}</li>
                    ))}
                  </ul>
                }
                type="warning"
                showIcon
              />
            )}
          </Space>
        )}

        {/* URL Preview */}
        {urlPreview && urlPreview.url !== currentUrl && (
          <Card
            title="URL Preview"
            size="small"
            type="inner"
            style={{ backgroundColor: '#fafafa' }}
          >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Original URL:
                </Text>
                <div
                  style={{
                    padding: '8px',
                    background: '#fff',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    wordBreak: 'break-all',
                  }}
                >
                  {currentUrl}
                </div>
              </div>

              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Final URL (with replaced values):
                </Text>
                <div
                  style={{
                    padding: '8px',
                    background: validation?.valid ? '#f6ffed' : '#fff2e8',
                    border: `1px solid ${validation?.valid ? '#b7eb8f' : '#ffbb96'}`,
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    wordBreak: 'break-all',
                    color: validation?.valid ? '#52c41a' : '#fa8c16',
                  }}
                >
                  {urlPreview.url}
                </div>
              </div>

              {urlPreview.missing.length > 0 && (
                <Alert
                  message={`Missing values for: ${urlPreview.missing.map(m => `:${m}`).join(', ')}`}
                  type="warning"
                  showIcon
                  style={{ marginTop: 8 }}
                />
              )}
            </Space>
          </Card>
        )}
      </Space>
    </Card>
  );
};

export default UrlParamsEditor;
