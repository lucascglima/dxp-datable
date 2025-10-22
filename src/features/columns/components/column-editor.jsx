/**
 * Column Editor Component
 *
 * Form for editing a single column configuration.
 * Extracted from columns-config-section.jsx.
 */

import { Card, Form, Input, InputNumber, Checkbox, Space, Button, Row, Col, Tooltip, Select, Alert, Divider } from 'antd';
import { DeleteOutlined, InfoCircleOutlined, FormatPainterOutlined } from '@ant-design/icons';
import { getAvailableRenderers, getRendererFields } from '../renderers';
import RenderConfigForm from './render-config-form';
import { validateColumn } from '../../../core/validators/column-validator';

const { Option } = Select;

const ColumnEditor = ({ column, index, onUpdate, onRemove, onRenderTypeChange, onRenderConfigChange }) => {
  const validation = validateColumn(column, index);
  const hasErrors = validation.length > 0;

  return (
    <Card
      key={column.id || index}
      type="inner"
      title={
        <Space
        >
          <span>Coluna {index + 1}:</span>
          {column.title && <span style={{ fontWeight: 'normal' }}>{column.title}</span>}
        </Space>
      }
      extra={
        <Tooltip title="Remover coluna">
          <Button
            type="primary"        
            icon={<DeleteOutlined />}
            onClick={() => onRemove(index)}
          >            
          </Button>
        </Tooltip>
            
      }
      style={{
        borderColor: hasErrors ? '#ff4d4f' : undefined,
      }}
    >
      
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={
                <Space>
                  Nome*
                  <Tooltip title="Texto exibido no título da coluna">
                    <InfoCircleOutlined style={{ color: '#4B67A2' }} />
                  </Tooltip>
                </Space>
              }
              
              validateStatus={!column.title ? 'error' : 'success'}
            >
              <Input
                value={column.title}
                onChange={(e) => onUpdate(index, 'title', e.target.value)}
                placeholder="Nome"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={
                <Space>
                  Campo de origem*
                  <Tooltip title="Nome exato da propriedade retornada pela sua API (case-sensitive)">
                    <InfoCircleOutlined style={{ color: '#4B67A2' }} />
                  </Tooltip>
                </Space>
              }
              
              validateStatus={!column.dataIndex ? 'error' : 'success'}
            >
              <Input
                value={column.dataIndex}
                onChange={(e) => onUpdate(index, 'dataIndex', e.target.value)}
                placeholder="nome"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} justify={'flex'}>
       

          {column.sortable && (
            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    Campo de ordenação*
                    <Tooltip title="Nome do campo enviado para ordenação na API. Deixe vazio para usar o dataIndex">
                      <InfoCircleOutlined style={{ color: '#4B67A2' }} />
                    </Tooltip>
                  </Space>
                }
              >
                <Input
                  value={column.sortField}
                  onChange={(e) => onUpdate(index, 'sortField', e.target.value)}
                  placeholder={column.dataIndex || 'Usar dataIndex'}
                />
              </Form.Item>
            </Col>
          )}
             <Col span={12} style={{ paddingLeft: 0 }}>
            <Form.Item label=" " colon={false} >
              <Checkbox
                checked={column.sortable}
                onChange={(e) => onUpdate(index, 'sortable', e.target.checked)}
              >
                Ativar ordenação
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>


        <Divider orientation="left">
          <Space>
            <FormatPainterOutlined />
            Renderização customizada 
          </Space>
        </Divider>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={
                <Space>
                  Tipo
                  <Tooltip title="Escolha como os valores desta coluna serão exibidos">
                    <InfoCircleOutlined style={{ color: '#4B67A2' }} />
                  </Tooltip>
                </Space>
              }
            >
              <Select
                value={column.render?.type || 'default'}
                onChange={(value) => onRenderTypeChange(index, value)}
                placeholder="Selecione o tipo"
              >
                {getAvailableRenderers().map((renderer) => (
                  <Option key={renderer.value} value={renderer.value}>
                    <Space direction="vertical" size={0}>
                      <span>
                        {renderer.label}{' '}
                        <span style={{ fontSize: '12px', color: '#888' }}>
                          ({renderer.description})
                        </span>
                      </span>
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Largura">
              <InputNumber
                value={column.width}
                onChange={(val) => onUpdate(index, 'width', val)}
                placeholder="Largura da coluna"
                min={50}
                max={1000}
                addonAfter="px"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Render-specific configuration fields */}
        {column.render?.type && column.render.type !== 'default' && (
          <Card size="small" type="inner" style={{ background: '#fafafa', marginBottom: 8, padding: 8 }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <RenderConfigForm
                renderType={column.render.type}
                config={column.render.config || {}}
                fields={getRendererFields(column.render.type)}
                onConfigChange={(field, value) => onRenderConfigChange(index, field, value)}
              />
            </Space>
          </Card>
        )}

      
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
};

export default ColumnEditor;
