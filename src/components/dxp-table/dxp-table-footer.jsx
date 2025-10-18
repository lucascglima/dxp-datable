import React from 'react';
import { Pagination, Space, Typography } from 'antd';
import { dxpTableFooterPropTypes } from './dxp-table.types';

const { Text } = Typography;

/**
 * DxpTableFooter Component
 *
 * Renders pagination controls and displays information about the current view.
 * Fully controlled component that emits events for page and pageSize changes.
 *
 * @param {Object} props
 * @param {number} props.current - Current page number
 * @param {number} props.pageSize - Number of items per page
 * @param {number} props.total - Total number of records
 * @param {Array} props.pageSizeOptions - Available page size options
 * @param {Function} props.onPageChange - Callback when page changes
 * @param {Function} props.onPageSizeChange - Callback when page size changes
 */
const DxpTableFooter = ({
  current,
  pageSize,
  total,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange = () => {},
  onPageSizeChange = () => {},
}) => {
  /**
   * Calculates the range of records currently displayed
   */
  const getDisplayRange = () => {
    const start = total === 0 ? 0 : (current - 1) * pageSize + 1;
    const end = Math.min(current * pageSize, total);
    return { start, end };
  };

  /**
   * Handles pagination change from Ant Design Pagination component
   * Determines if it was a page change or pageSize change and emits appropriate event
   */
  const handlePaginationChange = (page, newPageSize) => {
    if (newPageSize !== pageSize) {
      // PageSize changed
      onPageSizeChange(newPageSize);
    } else {
      // Page changed
      onPageChange(page);
    }
  };

  const { start, end } = getDisplayRange();

  return (
    <Space
      direction="horizontal"
      size="middle"
      style={{
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 16,
      }}
    >
      <Text type="secondary">
        Itens {start} a {end} de {total} registros
      </Text>

      <Pagination
        current={current}
        pageSize={pageSize}
        total={total}
        pageSizeOptions={pageSizeOptions}
        showSizeChanger
        onChange={handlePaginationChange}
        onShowSizeChange={handlePaginationChange}
        
      />
    </Space>
  );
};

DxpTableFooter.propTypes = dxpTableFooterPropTypes;

export default DxpTableFooter;
