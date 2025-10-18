/**
 * Navigation Menu Component
 *
 * Top navigation menu for the application.
 * Shows all available pages with status indicators.
 */


import { Link, useLocation } from 'react-router-dom';
import { Menu, Badge } from 'antd';
import {
  SettingOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { hasConfiguration } from '../../services/config-storage';

const NavigationMenu = () => {
  const location = useLocation();
  const configExists = hasConfiguration();

  const items = [    
    {
      key: '/configuration',
      icon: <SettingOutlined />,
      label: (
        <Link to="/configuration">
          Configuration{' '}
          {!configExists && (
            <Badge
              count="New"
              style={{ backgroundColor: '#52c41a', marginLeft: 8 }}
            />
          )}
        </Link>
      ),
    },
    {
      key: '/datatable',
      icon: <TableOutlined />,
      label: <Link to="/datatable">My DataTable</Link>,
      disabled: !configExists,
    },
  ];

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[location.pathname]}
      items={items}
      style={{
        marginBottom: 0,
        borderBottom: '1px solid #f0f0f0',
      }}
    />
  );
};

export default NavigationMenu;
