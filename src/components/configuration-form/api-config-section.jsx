/**
 * API Configuration Section
 *
 * Form section for configuring API endpoint and authentication.
 * Provides URL validation and example loading functionality.
 */

import React, { useState } from 'react';
import { Form, Input, Button, Alert, Space, Divider } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined, LinkOutlined } from '@ant-design/icons';
import { validateUrl } from '../../utils/api-validator';
import UrlParamsEditor from './url-params-editor';
import DefaultQueryParamsEditor from './default-query-params-editor';

const ApiConfigSection = ({ value = {}, onChange }) => {
  const [showToken, setShowToken] = useState(false);
  const [urlValidation, setUrlValidation] = useState(null);

  /**
   * Handles API endpoint change with validation
   */
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
        message="API Configuration"
        description="Configure the external API endpoint you want to fetch data from. You can use any REST API that returns JSON data."
        type="info"
        showIcon
      />

      <Form.Item
        label="API Endpoint URL"
        required
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
          'Enter the complete URL of your API endpoint'
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
            Use suggested URL: {urlValidation.fixedUrl}
          </Button>
        )}
      </Form.Item>

      <Divider orientation="left">URL Parameters</Divider>

      {/* URL Params Section */}
      <UrlParamsEditor
        value={value.urlParams || []}
        onChange={handleUrlParamsChange}
        currentUrl={value.apiEndpoint || ''}
      />

      <Divider orientation="left">Query Parameters</Divider>

      {/* Default Query Params Section */}
      <DefaultQueryParamsEditor
        value={value.defaultQueryParams || []}
        onChange={handleDefaultQueryParamsChange}
      />

      <Divider orientation="left">Authentication</Divider>

      <Form.Item
        label="Authentication Token (Optional)"
        help="Leave empty if your API doesn't require authentication. Include 'Bearer' prefix if needed."
      >
        <Input
          type={showToken ? 'text' : 'password'}
          value={value.authToken}
          onChange={handleTokenChange}
          placeholder="Bearer your-token-here or leave empty"
          suffix={
            <Button
              type="text"
              icon={showToken ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={() => setShowToken(!showToken)}
            />
          }
          size="large"
        />
      </Form.Item>

      <Form.Item label="Request Method">
        <Input value="GET" disabled size="large" />
        <span style={{ fontSize: '12px', color: '#666' }}>
          Only GET requests are supported in this version
        </span>
      </Form.Item>

      <Button
        type="dashed"
        icon={<LinkOutlined />}
        onClick={handleLoadExample}
        block
      >
        Load Example API (JSONPlaceholder Users)
      </Button>
    </Space>
  );
};

export default ApiConfigSection;
