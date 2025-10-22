/**
 * Navigation Menu Component
 *
 * Top navigation menu for the application.
 * Shows all available pages with status indicators.
 *
 * REFACTORED: Removed react-router-dom Links.
 * Now uses view state management for Liferay client extension compatibility.
 */

import PropTypes from 'prop-types';
import { Menu, Badge } from 'antd';
import { SettingOutlined, TableOutlined } from '@ant-design/icons';
import { hasConfiguration } from '../../services/config-storage';
import { VIEWS } from '../../hooks/use-view-manager';

const NavigationMenu = ({ currentView, onNavigate }) => {
  const configExists = hasConfiguration();

  const handleMenuClick = ({ key }) => {
    onNavigate(key);
  };

  const items = [
    {
      key: VIEWS.CONFIGURATION,
      icon: <SettingOutlined />,
      label: (
        <span>
          Configuração{' '}
          {!configExists && (
            <Badge count="Novo" style={{ backgroundColor: '#52c41a', marginLeft: 8 }} />
          )}
        </span>
      ),
    },
    {
      key: VIEWS.DATATABLE,
      icon: <TableOutlined />,
      label: <span>Tabela configurada</span>,
      disabled: !configExists,
    },
  ];

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[currentView]}
      items={items}
      onClick={handleMenuClick}
      style={{
        marginBottom: 0,
        borderBottom: '1px solid #f0f0f0',
      }}
    />
  );
};

NavigationMenu.propTypes = {
  currentView: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
};

export default NavigationMenu;
