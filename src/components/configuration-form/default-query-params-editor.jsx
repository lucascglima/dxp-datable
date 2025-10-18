/**
 * Default Query Params Editor Component
 *
 * Editor for default query parameters that are sent with all API requests
 * Each parameter has an enabled/disabled checkbox
 *
 * Features:
 * - Visual key-value interface with enable/disable toggle
 * - Parameters are sent to API only when enabled
 * - Used in both table data fetching and test requests
 */

import { useState, useEffect } from 'react';
import {
  Card,
  Input,
  Button,
  Space,
  Alert,
  Typography,
  Checkbox,
  Tag,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

const DefaultQueryParamsEditor = ({ value = [], onChange }) => {
  const [params, setParams] = useState(value);
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * Initialize from props
   */
  useEffect(() => {
    if (!isUpdating && value) {
      setParams(value);
    }
  }, [value, isUpdating]);

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
    notifyChange(newParams);
  };

  const handleAddParam = () => {
    const newParams = [
      ...params,
      { key: '', value: '', enabled: true }, // New params are enabled by default
    ];
    setParams(newParams);
    notifyChange(newParams);
  };

  const handleRemoveParam = (index) => {
    const newParams = params.filter((_, i) => i !== index);
    setParams(newParams);
    notifyChange(newParams);
  };


  return (
    <Card title="Default Query Params" size="small">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Alert
          message="Default query parameters for all requests"
          description="These query parameters will be sent with all API requests (both table data and tests). Use the checkbox to enable/disable each parameter."
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
        />

        {/* Parameters editor */}
        {params.length > 0 && (
          <>
            {params.map((param, index) => (
              <div key={index}>
                <Space style={{ width: '100%' }} align="start">
                  <Checkbox
                    checked={param.enabled !== false} // Default to true if undefined
                    onChange={(e) =>
                      handleParamChange(index, 'enabled', e.target.checked)
                    }
                    style={{ marginTop: 8 }}
                  />
                  <Input
                    placeholder="Key (e.g., site)"
                    value={param.key}
                    onChange={(e) => handleParamChange(index, 'key', e.target.value)}
                    style={{ width: 150 }}
                    disabled={!param.enabled}
                  />
                  <Input
                    placeholder="Value (e.g., stackoverflow)"
                    value={param.value}
                    onChange={(e) => handleParamChange(index, 'value', e.target.value)}
                    style={{ width: 200 }}
                    disabled={!param.enabled}
                  />
            
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveParam(index)}
                  />
                </Space>
                <Text
                  type="secondary"
                  style={{
                    fontSize: 11,
                    marginLeft: 32,
                    display: 'block',
                    marginTop: 4,
                  }}
                >
                  {param.enabled
                    ? `Will be sent: ?${param.key || '...'}=${param.value || '...'}`
                    : 'Disabled - will not be sent in requests'}
                </Text>
              </div>
            ))}
          </>
        )}

        {params.length === 0 && (
          <Alert
            message="No default query params configured"
            description="Add query parameters that should be sent with every API request. You can enable/disable them individually."
            type="info"
            showIcon
          />
        )}

        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={handleAddParam}
          block
        >
          Add Default Query Parameter
        </Button>

        {/* Example section */}
        {params.length === 0 && (
          <Alert
            message="Example use case"
            description={
              <div>
                <Text>
                  If your API always requires certain parameters like{' '}
                  <Text code>site=stackoverflow</Text> or{' '}
                  <Text code>filter=withbody</Text>, add them here. You can temporarily
                  disable them without deleting using the checkbox.
                </Text>
              </div>
            }
            type="info"
            showIcon={false}
            style={{ backgroundColor: '#f0f5ff', border: '1px solid #adc6ff' }}
          />
        )}
      </Space>
    </Card>
  );
};

export default DefaultQueryParamsEditor;
