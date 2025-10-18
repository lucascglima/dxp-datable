/**
 * Columns Configuration Section
 *
 * Visual interface for configuring table columns without writing JSON.
 * Supports manual configuration, JSON import/export, and icon configuration.
 */

import React, { useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Checkbox,
  Button,
  Card,
  Space,
  Alert,
  Row,
  Col,
  Tooltip,
  Modal,
  Select,
  message,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  ColumnHeightOutlined,
  ImportOutlined,
  ExportOutlined,
  SmileOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

// Available Ant Design icons for column configuration
const AVAILABLE_ICONS = [
  { value: 'UserOutlined', label: 'User' },
  { value: 'MailOutlined', label: 'Mail' },
  { value: 'PhoneOutlined', label: 'Phone' },
  { value: 'HomeOutlined', label: 'Home' },
  { value: 'EditOutlined', label: 'Edit' },
  { value: 'DeleteOutlined', label: 'Delete' },
  { value: 'EyeOutlined', label: 'View' },
  { value: 'DownloadOutlined', label: 'Download' },
  { value: 'UploadOutlined', label: 'Upload' },
  { value: 'StarOutlined', label: 'Star' },
  { value: 'HeartOutlined', label: 'Heart' },
  { value: 'CheckOutlined', label: 'Check' },
  { value: 'CloseOutlined', label: 'Close' },
  { value: 'SettingOutlined', label: 'Settings' },
  { value: 'SearchOutlined', label: 'Search' },
  { value: 'PlusOutlined', label: 'Plus' },
  { value: 'MinusOutlined', label: 'Minus' },
  { value: 'InfoCircleOutlined', label: 'Info' },
  { value: 'WarningOutlined', label: 'Warning' },
  { value: 'LinkOutlined', label: 'Link' },
];

const ColumnsConfigSection = ({ value = [], onChange }) => {
  const [jsonModalVisible, setJsonModalVisible] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState(null);

  /**
   * Adds a new empty column
   */
  const handleAddColumn = () => {
    const timestamp = Date.now();
    const newColumn = {
      id: `col_${timestamp}`, // Use id for React key, separate from column key
      key: `column_${timestamp}`,
      title: '',
      dataIndex: '',
      sortable: true,
      clickable: false,
      width: undefined,
      icon: undefined,
      iconClickable: false,
    };

    onChange([...value, newColumn]);
  };

  /**
   * Removes a column by index
   */
  const handleRemoveColumn = (index) => {
    const newColumns = value.filter((_, i) => i !== index);
    onChange(newColumns);
  };

  /**
   * Updates a specific column field
   * FIXED: Now properly handles state updates without remounting
   */
  const handleColumnChange = (index, field, fieldValue) => {
    const newColumns = value.map((col, i) => {
      if (i === index) {
        const updated = {
          ...col,
          [field]: fieldValue,
        };

        // Auto-generate key from dataIndex if dataIndex changes and key wasn't manually set
        if (field === 'dataIndex' && fieldValue && !col.manualKey) {
          updated.key = fieldValue;
        }

        return updated;
      }
      return col;
    });

    onChange(newColumns);
  };

  /**
   * Validates column configuration
   */
  const getColumnValidation = (column) => {
    const errors = [];

    if (!column.title || !column.title.trim()) {
      errors.push('Column title is required');
    }

    if (!column.dataIndex || !column.dataIndex.trim()) {
      errors.push('Data field is required');
    }

    return errors;
  };

  /**
   * Opens JSON import/export modal
   */
  const handleOpenJsonModal = () => {
    setJsonText(JSON.stringify(value, null, 2));
    setJsonError(null);
    setJsonModalVisible(true);
  };

  /**
   * Exports current configuration as JSON
   */
  const handleExportJson = () => {
    const json = JSON.stringify(value, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'columns-configuration.json';
    a.click();
    URL.revokeObjectURL(url);
    message.success('Configuration exported successfully');
  };

  /**
   * Imports configuration from JSON
   */
  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonText);

      // Validate JSON structure
      if (!Array.isArray(parsed)) {
        throw new Error('JSON must be an array of columns');
      }

      // Validate each column
      parsed.forEach((col, index) => {
        if (!col.title) {
          throw new Error(`Column ${index + 1}: title is required`);
        }
        if (!col.dataIndex) {
          throw new Error(`Column ${index + 1}: dataIndex is required`);
        }
      });

      // Add id to each column if not present
      const columnsWithIds = parsed.map((col, index) => ({
        id: col.id || `col_${Date.now()}_${index}`,
        key: col.key || col.dataIndex,
        title: col.title,
        dataIndex: col.dataIndex,
        sortable: col.sortable !== undefined ? col.sortable : true,
        clickable: col.clickable || false,
        width: col.width,
        icon: col.icon,
        iconClickable: col.iconClickable || false,
      }));

      onChange(columnsWithIds);
      setJsonModalVisible(false);
      setJsonError(null);
      message.success(`Successfully imported ${columnsWithIds.length} columns`);
    } catch (error) {
      setJsonError(error.message);
    }
  };

  /**
   * Copies JSON to clipboard
   */
  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonText);
    message.success('JSON copied to clipboard');
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="Table Columns Configuration"
        description="Define which columns to display in your table. You can configure columns visually or import from JSON."
        type="info"
        showIcon
        icon={<ColumnHeightOutlined />}
      />

      {/* JSON Import/Export Buttons */}
      <Space>
        <Button
          icon={<ImportOutlined />}
          onClick={handleOpenJsonModal}
        >
          Import/Edit JSON
        </Button>
        <Button
          icon={<ExportOutlined />}
          onClick={handleExportJson}
          disabled={value.length === 0}
        >
          Export JSON
        </Button>
      </Space>

      {value.length === 0 && (
        <Alert
          message="No columns configured"
          description="Click 'Add Column' below to configure columns manually, or use 'Import JSON' to paste column configuration."
          type="warning"
          showIcon
        />
      )}

      {value.map((column, index) => {
        const validation = getColumnValidation(column);
        const hasErrors = validation.length > 0;

        return (
          <Card
            key={column.id || index} // Use stable id for React key
            size="small"
            title={
              <Space>
                <span>Column {index + 1}</span>
                {column.title && <span style={{ fontWeight: 'normal' }}>- {column.title}</span>}
              </Space>
            }
            extra={
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveColumn(index)}
              >
                Remove
              </Button>
            }
            style={{
              borderColor: hasErrors ? '#ff4d4f' : undefined,
            }}
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={
                      <Space>
                        Column Display Name
                        <Tooltip title="This is what users will see in the table header">
                          <InfoCircleOutlined style={{ color: '#1890ff' }} />
                        </Tooltip>
                      </Space>
                    }
                    required
                    validateStatus={!column.title ? 'error' : 'success'}
                  >
                    <Input
                      value={column.title}
                      onChange={(e) =>
                        handleColumnChange(index, 'title', e.target.value)
                      }
                      placeholder="Name"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label={
                      <Space>
                        Data Field Name
                        <Tooltip title="The exact property name from your API response (case-sensitive)">
                          <InfoCircleOutlined style={{ color: '#1890ff' }} />
                        </Tooltip>
                      </Space>
                    }
                    required
                    validateStatus={!column.dataIndex ? 'error' : 'success'}
                  >
                    <Input
                      value={column.dataIndex}
                      onChange={(e) =>
                        handleColumnChange(index, 'dataIndex', e.target.value)
                      }
                      placeholder="name"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Column Width (Optional)">
                    <InputNumber
                      value={column.width}
                      onChange={(val) =>
                        handleColumnChange(index, 'width', val)
                      }
                      placeholder="Auto"
                      min={50}
                      max={1000}
                      addonAfter="px"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label=" " colon={false}>
                    <Checkbox
                      checked={column.sortable}
                      onChange={(e) =>
                        handleColumnChange(index, 'sortable', e.target.checked)
                      }
                    >
                      Enable sorting
                    </Checkbox>
                  </Form.Item>
                </Col>
              </Row>
              
              {hasErrors && (
                <Alert
                  message="Column configuration incomplete"
                  description={
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      {validation.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  }
                  type="error"
                  showIcon
                  closable
                />
              )}
            </Space>
          </Card>
        );
      })}

      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={handleAddColumn}
        block
        size="large"
      >
        Add Column
      </Button>

      {value.length > 0 && (
        <Alert
          message={`${value.length} column${value.length > 1 ? 's' : ''} configured`}
          type="success"
          showIcon
        />
      )}

      {/* JSON Import/Export Modal */}
      <Modal
        title="Import/Edit Columns JSON"
        open={jsonModalVisible}
        onCancel={() => setJsonModalVisible(false)}
        onOk={handleImportJson}
        okText="Import"
        width={700}
        footer={[
          <Button key="copy" onClick={handleCopyJson}>
            Copy to Clipboard
          </Button>,
          <Button key="cancel" onClick={() => setJsonModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="import" type="primary" onClick={handleImportJson}>
            Import
          </Button>,
        ]}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Alert
            message="JSON Format"
            description={
              <div>
                <p>Paste or edit your columns configuration in JSON format.</p>
                <p><strong>Required fields:</strong> title, dataIndex</p>
                <p><strong>Optional fields:</strong> key, sortable, clickable, width, icon, iconClickable</p>
              </div>
            }
            type="info"
            showIcon
          />

          {jsonError && (
            <Alert
              message="Invalid JSON"
              description={jsonError}
              type="error"
              showIcon
              closable
            />
          )}

          <TextArea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            rows={15}
            placeholder='[{"title": "Name", "dataIndex": "name", "sortable": true}]'
            style={{ fontFamily: 'monospace' }}
          />
        </Space>
      </Modal>
    </Space>
  );
};

export default ColumnsConfigSection;
