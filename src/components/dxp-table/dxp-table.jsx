import React from 'react';
import { Table } from 'antd';
import DxpTableHeader from './dxp-table-header';
import DxpTableFooter from './dxp-table-footer';
import { dxpTablePropTypes } from './dxp-table.types';

/**
 * DxpTable Component
 *
 * Main orchestrator component that integrates Ant Design Table with custom header and footer.
 * Fully controlled (stateless) component that relies on parent for all state management.
 *
 * @param {Object} props
 * @param {Array} props.columns - Column configuration array
 * @param {Array} props.data - Data array to be rendered
 * @param {Object} props.pagination - Pagination configuration (current, pageSize, total)
 * @param {boolean} props.loading - Loading state indicator
 * @param {Function} props.onSort - Callback when column is sorted
 * @param {Function} props.onRowClick - Callback when row is clicked
 * @param {Function} props.onPaginationChange - Callback when pagination changes
 * @param {string} props.rowKey - Unique key for each row
 * @param {Object} props.sortingConfig - Sorting configuration
 */
const DxpTable = ({
  columns,
  data,
  pagination,
  loading = false,
  onSort = () => {},
  onRowClick = () => {},
  onPaginationChange = () => {},
  rowKey,
  sortingConfig,
}) => {
  /**
   * Process header configuration and get columns with sort handler
   */
  const headerConfig = DxpTableHeader({ columns, onSort, sortingConfig });

  /**
   * Handles row click events
   */
  const handleRowClick = (record) => {
    return {
      onClick: () => {
        onRowClick(record);
      },
    };
  };

  /**
   * Handles pagination changes from footer
   * Consolidates page and pageSize changes into single callback
   */
  const handlePageChange = (page) => {
    onPaginationChange({
      current: page,
      pageSize: pagination.pageSize,
    });
  };

  const handlePageSizeChange = (pageSize) => {
    onPaginationChange({
      current: 1, // Reset to first page when pageSize changes
      pageSize: pageSize,
    });
  };

  return (
    <div className="dxp-table-container">
      <Table
        columns={headerConfig.columns}
        dataSource={data}
        rowKey={rowKey}
        loading={loading}
        pagination={false} // Disable built-in pagination, using custom footer
        onChange={headerConfig.onChange}
        onRow={handleRowClick}
      />

      <DxpTableFooter
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        pageSizeOptions={pagination.pageSizeOptions}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

DxpTable.propTypes = dxpTablePropTypes;

export default DxpTable;
