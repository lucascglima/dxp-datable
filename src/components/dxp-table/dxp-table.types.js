import PropTypes from 'prop-types';

/**
 * Column configuration shape for the DataTable
 */
export const columnShape = PropTypes.shape({
  key: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  dataIndex: PropTypes.string.isRequired,
  sortable: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  align: PropTypes.oneOf(['left', 'center', 'right']),
  render: PropTypes.func,
});

/**
 * Pagination configuration shape
 */
export const paginationShape = PropTypes.shape({
  current: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
});

/**
 * Sort event object shape
 */
export const sortEventShape = PropTypes.shape({
  columnKey: PropTypes.string.isRequired,
  order: PropTypes.oneOf(['ascend', 'descend', null]),
});

/**
 * PropTypes for DxpTable component
 */
export const dxpTablePropTypes = {
  columns: PropTypes.arrayOf(columnShape).isRequired,
  data: PropTypes.array.isRequired,
  pagination: paginationShape.isRequired,
  loading: PropTypes.bool,
  onSort: PropTypes.func,
  onRowClick: PropTypes.func,
  onPaginationChange: PropTypes.func,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  sortingConfig: PropTypes.object,
};

/**
 * PropTypes for DxpTableHeader component
 */
export const dxpTableHeaderPropTypes = {
  columns: PropTypes.arrayOf(columnShape).isRequired,
  onSort: PropTypes.func,
  sortingConfig: PropTypes.object,
};

/**
 * PropTypes for DxpTableFooter component
 */
export const dxpTableFooterPropTypes = {
  current: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
};
