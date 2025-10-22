/**
 * App Component
 *
 * Main application component with view management.
 * Provides visual no-code configuration interface for DataTable.
 *
 * REFACTORED: Removed react-router-dom for Liferay client extension compatibility.
 * Client extensions cannot use BrowserRouter as it conflicts with Liferay's routing.
 */

import React from 'react';
import { ConfigProvider, Layout, App as AntdApp } from 'antd';
import NavigationMenu from './components/navigation/navigation-menu';
import ConfigurationPage from './pages/configuration-page';
import DataTablePage from './pages/datatable-page';
import { antdTheme } from './styles/config/antd-theme';
import { useViewManager, VIEWS } from './hooks/use-view-manager';

const { Header, Content } = Layout;

/**
 * App Component
 *
 * Root component with view management (no routing)
 */
const App = () => {
  const viewManager = useViewManager(VIEWS.CONFIGURATION);

  return (
    <ConfigProvider theme={antdTheme}>
      <AntdApp>
        <Layout style={{ minHeight: '100vh' }}>
          {/* Navigation Header */}
          <Header
            style={{
              background: '#fff',
              padding: 0,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
              <NavigationMenu
                currentView={viewManager.currentView}
                onNavigate={viewManager.navigateTo}
              />
            </div>
          </Header>

          {/* Main Content */}
          <Content style={{ background: '#f0f2f5' }}>
            {viewManager.currentView === VIEWS.CONFIGURATION && (
              <ConfigurationPage onNavigate={viewManager.navigateTo} />
            )}
            {viewManager.currentView === VIEWS.DATATABLE && (
              <DataTablePage onNavigate={viewManager.navigateTo} />
            )}
          </Content>
        </Layout>
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;
