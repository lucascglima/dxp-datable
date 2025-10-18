/**
 * Pagination Configuration Section
 *
 * Form section for configuring table pagination settings.
 * Simple interface for page size and pagination display options.
 */


import { Form, Select, Checkbox, Alert, Space } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const { Option } = Select;

const PaginationConfigSection = ({ value = {}, onChange }) => {
  const defaultPagination = {
    pageSize: 20,
    showPagination: true,
    ...value,
  };

  /**
   * Handles page size change
   */
  const handlePageSizeChange = (pageSize) => {
    onChange({
      ...defaultPagination,
      pageSize,
    });
  };

  /**
   * Handles show pagination toggle
   */
  const handleShowPaginationChange = (e) => {
    onChange({
      ...defaultPagination,
      showPagination: e.target.checked,
    });
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="Pagination Settings"
        description="Configure how many items to display per page and whether to show pagination controls."
        type="info"
        showIcon
        icon={<SettingOutlined />}
      />

      <Form.Item help="Uncheck to hide pagination controls and show all items">
        <Checkbox
          checked={defaultPagination.showPagination}
          onChange={handleShowPaginationChange}
        >
          Show pagination controls
        </Checkbox>
      </Form.Item>

      <Form.Item
        label="Items per Page"
        help="Number of rows to display on each page"
      >
        <Select
          value={defaultPagination.pageSize}
          onChange={handlePageSizeChange}
          size="large"
          style={{ width: '100%' }}
        >
          <Option value={10}>10 items</Option>
          <Option value={20}>20 items</Option>
          <Option value={50}>50 items</Option>
          <Option value={100}>100 items</Option>
        </Select>
      </Form.Item>

  

      {!defaultPagination.showPagination && (
        <Alert
          message="Pagination disabled"
          description="All items will be displayed on a single page. This may affect performance with large datasets."
          type="warning"
          showIcon
        />
      )}

      {defaultPagination.pageSize > 50 && (
        <Alert
          message="Large page size"
          description="Displaying many items per page may affect page performance."
          type="info"
          showIcon
        />
      )}
    </Space>
  );
};

export default PaginationConfigSection;
