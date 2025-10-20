import React from 'react';
import { dxpTableHeaderPropTypes } from './dxp-table.types';

/**
 * DxpTableHeader Component
 *
 * Processes and transforms column configuration for Ant Design Table.
 * Handles sorting logic and emits sort events.
 *
 * @param {Object} props
 * @param {Array} props.columns - Array of column configurations
 * @param {Function} props.onSort - Callback function when column is sorted
 * @param {Object} props.sortingConfig - Sorting configuration (mode, serverConfig)
 * @returns {Array} Processed columns for Ant Design Table
 */
const DxpTableHeader = ({ columns, onSort = () => {}, sortingConfig }) => {
  /**
   * Creates a sorter function for client-side sorting
   */
  const createSorter = (dataIndex) => {
    return (a, b) => {
      const aVal = a[dataIndex];
      const bVal = b[dataIndex];

      // Handle null/undefined values
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      // Sort by type
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return aVal - bVal;
      }

      // Fallback: convert to string and compare
      return String(aVal).localeCompare(String(bVal));
    };
  };
  /**
   * Validates that essential column properties are present
   */
  const validateColumn = (column) => {
    if (!column.key) {
      console.error('A coluna não possui a propriedade necessária: key', column);
      return false;
    }
    if (!column.title) {
      console.error('A coluna não possui a propriedade necessária: title', column);
      return false;
    }
    if (!column.dataIndex) {
      console.error('A coluna não possui a propriedade necessária: dataIndex', column);
      return false;
    }
    return true;
  };

  /**
   * Transforms column configuration to Ant Design format
   */
  const processColumns = () => {
    const sortingMode = sortingConfig?.mode || 'disabled';

    return columns
      .filter(validateColumn)
      .map((column) => {
        const antColumn = {
          key: column.key,
          title: column.title,
          dataIndex: column.dataIndex,
          ...(column.width && { width: column.width }),
          ...(column.align && { align: column.align }),
          ...(column.render && { render: column.render }),
        };

        // Add sorting configuration if sortable
        if (column.sortable && sortingMode !== 'disabled') {
          antColumn.sortDirections = ['ascend', 'descend'];

          if (sortingMode === 'client') {
            // Client-side sorting: provide actual sorter function
            antColumn.sorter = createSorter(column.dataIndex);
          } else if (sortingMode === 'server') {
            // Server-side sorting: just indicate sortable
            antColumn.sorter = true;
          }
        }

        return antColumn;
      });
  };

  /**
   * Handles sort change events from Ant Design Table
   * Transforms Ant Design sort event to simplified format
   */
  const handleSortChange = (pagination, filters, sorter) => {
    if (sorter && sorter.column) {
      onSort({
        columnKey: sorter.columnKey || sorter.field,
        order: sorter.order || null,
      });
    } else {
      // Sort was cleared
      onSort({
        columnKey: null,
        order: null,
      });
    }
  };

  return {
    columns: processColumns(),
    onChange: handleSortChange,
  };
};

DxpTableHeader.propTypes = dxpTableHeaderPropTypes;

export default DxpTableHeader;
