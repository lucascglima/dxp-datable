/**
 * useColumnManager Hook
 *
 * Manages column CRUD operations.
 * Extracted from columns-config-section.jsx to follow clean architecture.
 *
 * Note: This hook does NOT maintain internal state. It operates directly on
 * the columns array passed from the parent component to ensure state synchronization.
 * The parent component controls the state via the onChange callback.
 */

import { message } from 'antd';
import { createNewColumn } from '../models/configuration.types';
import { validateColumnsJson } from '../validators/column-validator';

/**
 * Custom hook for managing columns (stateless - parent controls state)
 * @param {Array} columns - Current columns array (controlled by parent)
 * @param {Function} onChange - Callback when columns change
 * @returns {Object} Column management functions
 */
export const useColumnManager = (columns = [], onChange) => {
  /**
   * Updates columns via onChange callback
   * Note: We don't maintain internal state - parent controls the state
   */
  const updateColumns = (newColumns) => {
    if (onChange) {
      onChange(newColumns);
    }
  };


  /**
   * Adds a new empty column
   */
  const addColumn = () => {
    const newColumn = createNewColumn();
    updateColumns([...columns, newColumn]);
  };

  /**
   * Removes a column by index
   */
  const removeColumn = (index) => {
    const newColumns = columns.filter((_, i) => i !== index);
    updateColumns(newColumns);
  };

  /**
   * Updates a specific column field
   */
  const updateColumn = (index, field, value) => {
    const newColumns = columns.map((col, i) => {
      if (i === index) {
        const updated = {
          ...col,
          [field]: value,
        };

        // Auto-generate key from dataIndex if dataIndex changes and key wasn't manually set
        if (field === 'dataIndex' && value && !col.manualKey) {
          updated.key = value;
        }

        return updated;
      }
      return col;
    });

    updateColumns(newColumns);
  };

  /**
   * Updates render type for a column
   */
  const updateRenderType = (index, renderType, defaultConfig = {}) => {
    const newColumns = columns.map((col, i) => {
      if (i === index) {
        return {
          ...col,
          render: {
            type: renderType,
            config: defaultConfig,
          },
        };
      }
      return col;
    });

    updateColumns(newColumns);
  };

  /**
   * Updates render configuration for a column
   */
  const updateRenderConfig = (index, configField, configValue) => {
    const newColumns = columns.map((col, i) => {
      if (i === index) {
        return {
          ...col,
          render: {
            ...col.render,
            config: {
              ...col.render.config,
              [configField]: configValue,
            },
          },
        };
      }
      return col;
    });

    updateColumns(newColumns);
  };

  /**
   * Imports columns from JSON string
   */
  const importFromJson = (jsonText) => {
    const validation = validateColumnsJson(jsonText);

    if (!validation.valid) {
      return {
        success: false,
        errors: validation.errors,
      };
    }

    // Add IDs to imported columns
    const columnsWithIds = validation.data.map((col, index) => ({
      id: col.id || `col_${Date.now()}_${index}`,
      key: col.key || col.dataIndex,
      title: col.title,
      dataIndex: col.dataIndex,
      sortable: col.sortable !== undefined ? col.sortable : true,
      clickable: col.clickable || false,
      width: col.width,
      icon: col.icon,
      iconClickable: col.iconClickable || false,
      render: col.render || {
        type: 'default',
        config: {},
      },
    }));

    updateColumns(columnsWithIds);
    message.success(`Importadas ${columnsWithIds.length} colunas com sucesso`);

    return {
      success: true,
      count: columnsWithIds.length,
    };
  };

  /**
   * Exports columns to JSON string
   */
  const exportToJson = () => {
    return JSON.stringify(columns, null, 2);
  };

  /**
   * Exports columns as downloadable file
   */
  const exportToFile = () => {
    const json = exportToJson();
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
   * Replaces all columns (used for applying suggestions)
   */
  const replaceColumns = (newColumns) => {
    updateColumns(newColumns);
  };

  return {
    // Note: We don't return 'columns' because parent component controls the state
    addColumn,
    removeColumn,
    updateColumn,
    updateRenderType,
    updateRenderConfig,
    importFromJson,
    exportToJson,
    exportToFile,
    replaceColumns,
  };
};
