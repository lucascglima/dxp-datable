/**
 * Columns Configuration Section (Refactored)
 *
 * Orchestrates column configuration with list, editor, and JSON modal.
 * Reduced from 637 lines to ~120 lines using composition.
 */

import { useState, useCallback } from 'react';
import { Space, Alert, Button } from 'antd';
import { ImportOutlined, ExportOutlined } from '@ant-design/icons';
import { getRendererDefaultConfig } from '../../features/columns/renderers';
import ColumnList from '../../features/columns/components/column-list';
import ColumnJsonModal from '../../features/columns/components/column-json-modal';
import { useColumnManager } from '../../core/hooks/use-column-manager';
import { ErrorBoundary } from '../error-boundary';

const ColumnsConfigSection = ({ value = [], onChange }) => {
  const [jsonModalVisible, setJsonModalVisible] = useState(false);

  // Use column manager hook
  const columnManager = useColumnManager(value, onChange);

  /**
   * Handles render type change for a column
   * Memoized to prevent unnecessary re-renders
   */
  const handleRenderTypeChange = useCallback(
    (index, renderType) => {
      const defaultConfig = getRendererDefaultConfig(renderType);
      columnManager.updateRenderType(index, renderType, defaultConfig);
    },
    [columnManager]
  );

  /**
   * Opens JSON import/export modal
   * Memoized to prevent unnecessary re-renders
   */
  const handleOpenJsonModal = useCallback(() => {
    setJsonModalVisible(true);
  }, []);

  /**
   * Closes JSON modal
   * Memoized to prevent unnecessary re-renders
   */
  const handleCloseJsonModal = useCallback(() => {
    setJsonModalVisible(false);
  }, []);

  /**
   * Handles JSON import
   * Memoized to prevent unnecessary re-renders
   */
  const handleImportJson = useCallback(
    (jsonText) => {
      return columnManager.importFromJson(jsonText);
    },
    [columnManager]
  );

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="Configuração das colunas da tabela"
        description="Defina quais colunas serão exibidas na sua tabela. Você pode configurar visualmente ou importar via JSON."
        type="info"
      />

      <Space>
        <Button icon={<ImportOutlined />} onClick={handleOpenJsonModal}>
          Importar/Editar JSON
        </Button>
        <Button
          icon={<ExportOutlined />}
          onClick={columnManager.exportToFile}
          disabled={value.length === 0}
        >
          Exportar JSON
        </Button>
      </Space>

      <ErrorBoundary>
        <ColumnList
          columns={value}
          onAdd={columnManager.addColumn}
          onUpdate={columnManager.updateColumn}
          onRemove={columnManager.removeColumn}
          onRenderTypeChange={handleRenderTypeChange}
          onRenderConfigChange={columnManager.updateRenderConfig}
        />
      </ErrorBoundary>

      <ErrorBoundary>
        <ColumnJsonModal
          visible={jsonModalVisible}
          columns={value}
          onClose={handleCloseJsonModal}
          onImport={handleImportJson}
        />
      </ErrorBoundary>
    </Space>
  );
};

export default ColumnsConfigSection;
