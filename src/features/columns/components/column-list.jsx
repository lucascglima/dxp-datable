/**
 * Column List Component
 *
 * Renders list of column editors with add button.
 * Extracted from columns-config-section.jsx.
 */

import { Space, Button, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ColumnEditor from './column-editor';

const ColumnList = ({ columns, onAdd, onUpdate, onRemove, onRenderTypeChange, onRenderConfigChange }) => {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {columns.length === 0 && (
        <Alert
          message="Nenhuma coluna configurada"
          description="Clique em 'Adicionar Coluna' abaixo para configurar manualmente ou use 'Importar JSON' para colar uma configuração existente."
          type="warning"
          showIcon
        />
      )}

      {columns.map((column, index) => (
        <ColumnEditor
          key={column.id || index}
          column={column}
          index={index}
          onUpdate={onUpdate}
          onRemove={onRemove}
          onRenderTypeChange={onRenderTypeChange}
          onRenderConfigChange={onRenderConfigChange}
        />
      ))}

      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={onAdd}
        block
        size="large"
      >
        Adicionar Coluna
      </Button>

      {columns.length > 0 && (
        <Alert
          message={`${columns.length} coluna${columns.length > 1 ? 's' : ''} configurada${
            columns.length > 1 ? 's' : ''
          }`}
          type="success"
          showIcon
        />
      )}
    </Space>
  );
};

export default ColumnList;
