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
      errors.push('O título da coluna é obrigatório');
    }

    if (!column.dataIndex || !column.dataIndex.trim()) {
      errors.push('O campo de dados é obrigatório');
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
    message.success('Configuração exportada com sucesso');
  };

   /**
   * Imports configuration from JSON
   */
  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonText);

      if (!Array.isArray(parsed)) {
        throw new Error('O JSON deve ser um array de colunas');
      }

      parsed.forEach((col, index) => {
        if (!col.title) {
          throw new Error(`Coluna ${index + 1}: o campo "title" é obrigatório`);
        }
        if (!col.dataIndex) {
          throw new Error(`Coluna ${index + 1}: o campo "dataIndex" é obrigatório`);
        }
      });

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
      message.success(`Importadas ${columnsWithIds.length} colunas com sucesso`);
    } catch (error) {
      setJsonError(error.message);
    }
  };

  /**
   * Copies JSON to clipboard
   */
  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonText);
    message.success('JSON copiado para a área de transferência');
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="Configuração das Colunas da Tabela"
        description="Defina quais colunas serão exibidas na sua tabela. Você pode configurar visualmente ou importar via JSON."
        type="info"
        showIcon
        icon={<ColumnHeightOutlined />}
      />

      <Space>
        <Button
          icon={<ImportOutlined />}
          onClick={handleOpenJsonModal}
        >
          Importar/Editar JSON
        </Button>
        <Button
          icon={<ExportOutlined />}
          onClick={handleExportJson}
          disabled={value.length === 0}
        >
          Exportar JSON
        </Button>
      </Space>

      {value.length === 0 && (
        <Alert
          message="Nenhuma coluna configurada"
          description="Clique em 'Adicionar Coluna' abaixo para configurar manualmente ou use 'Importar JSON' para colar uma configuração existente."
          type="warning"
          showIcon
        />
      )}

      {value.map((column, index) => {
        const validation = getColumnValidation(column);
        const hasErrors = validation.length > 0;

        return (
          <Card
            key={column.id || index}
            size="small"
            title={
              <Space>
                <span>Coluna {index + 1}</span>
                {column.title && <span style={{ fontWeight: 'normal' }}> - {column.title}</span>}
              </Space>
            }
            extra={
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveColumn(index)}
              >
                Remover
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
                        Nome da Coluna
                        <Tooltip title="Texto exibido no cabeçalho da tabela">
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
                      placeholder="Nome"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label={
                      <Space>
                        Campo de Dados
                        <Tooltip title="Nome exato da propriedade retornada pela sua API (case-sensitive)">
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
                      placeholder="nome"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Largura da Coluna (Opcional)">
                    <InputNumber
                      value={column.width}
                      onChange={(val) =>
                        handleColumnChange(index, 'width', val)
                      }
                      placeholder="Automático"
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
                      Habilitar ordenação
                    </Checkbox>
                  </Form.Item>
                </Col>
              </Row>

              {hasErrors && (
                <Alert
                  message="Configuração da coluna incompleta"
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
        Adicionar Coluna
      </Button>

      {value.length > 0 && (
        <Alert
          message={`${value.length} coluna${value.length > 1 ? 's' : ''} configurada${value.length > 1 ? 's' : ''}`}
          type="success"
          showIcon
        />
      )}

      <Modal
        title="Importar/Editar JSON de Colunas"
        open={jsonModalVisible}
        onCancel={() => setJsonModalVisible(false)}
        onOk={handleImportJson}
        okText="Importar"
        width={700}
        footer={[
          <Button key="copy" onClick={handleCopyJson}>
            Copiar para Área de Transferência
          </Button>,
          <Button key="cancel" onClick={() => setJsonModalVisible(false)}>
            Cancelar
          </Button>,
          <Button key="import" type="primary" onClick={handleImportJson}>
            Importar
          </Button>,
        ]}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Alert
            message="Formato do JSON"
            description={
              <div>
                <p>Cole ou edite a configuração das colunas em formato JSON.</p>
                <p><strong>Campos obrigatórios:</strong> title, dataIndex</p>
                <p><strong>Campos opcionais:</strong> key, sortable, clickable, width, icon, iconClickable</p>
              </div>
            }
            type="info"
            showIcon
          />

          {jsonError && (
            <Alert
              message="JSON Inválido"
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
            placeholder='[{"title": "Nome", "dataIndex": "name", "sortable": true}]'
            style={{ fontFamily: 'monospace' }}
          />
        </Space>
      </Modal>
    </Space>
  );
};

export default ColumnsConfigSection;
