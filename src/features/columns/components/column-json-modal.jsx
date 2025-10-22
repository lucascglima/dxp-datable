/**
 * Column JSON Modal Component
 *
 * Modal for importing/exporting column configuration as JSON.
 * Extracted from columns-config-section.jsx.
 */

import { useState } from 'react';
import { Modal, Space, Alert, Button, Input } from 'antd';

const { TextArea } = Input;

const ColumnJsonModal = ({ visible, columns, onClose, onImport }) => {
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState(null);

  /**
   * Initialize JSON text when modal opens
   */
  const handleOpen = () => {
    setJsonText(JSON.stringify(columns, null, 2));
    setJsonError(null);
  };

  /**
   * Handles import action
   */
  const handleImport = () => {
    const result = onImport(jsonText);

    if (result.success) {
      setJsonError(null);
      onClose();
    } else {
      setJsonError(result.errors?.[0] || 'Erro ao importar JSON');
    }
  };

  /**
   * Copies JSON to clipboard
   */
  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
  };

  return (
    <Modal
      title="Importar/Editar JSON de Colunas"
      open={visible}
      onCancel={onClose}
      afterOpenChange={(open) => open && handleOpen()}
      onOk={handleImport}
      okText="Importar"
      width={700}
      footer={[
        <Button key="copy" onClick={handleCopy}>
          Copiar para Área de Transferência
        </Button>,
        <Button key="cancel" onClick={onClose}>
          Cancelar
        </Button>,
        <Button key="import" type="primary" onClick={handleImport}>
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
              <p>
                <strong>Campos obrigatórios:</strong> title, dataIndex
              </p>
              <p>
                <strong>Campos opcionais:</strong> key, sortable, clickable, width, icon,
                iconClickable
              </p>
            </div>
          }
          type="info"
        />

        {jsonError && (
          <Alert message="JSON Inválido" description={jsonError} type="error" showIcon closable />
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
  );
};

export default ColumnJsonModal;
