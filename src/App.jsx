/**
 * App Component
 *
 * Main application component with navigation and routing.
 * Provides visual no-code configuration interface for DataTable.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, Layout } from 'antd';
import NavigationMenu from './components/navigation/navigation-menu';
import ConfigurationPage from './pages/configuration-page';
import DataTablePage from './pages/datatable-page';

const { Header, Content } = Layout;

/**
 * App Component
 *
 * Root component with navigation and routing
 */
const App = () => {
  // Ant Design theme configuration
  const theme = {
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 4,
      fontSize: 14,
    },
  };

  return (
    <ConfigProvider theme={theme}>
      <Router>
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
              <NavigationMenu />
            </div>
          </Header>

          {/* Main Content */}
          <Content style={{ background: '#f0f2f5' }}>
            <Routes>
              {/* Default route - Example Page */}
              <Route path="/" element={<Navigate to="/configuration" replace />} />              

              {/* Configuration Page - Visual no-code setup */}
              <Route path="/configuration" element={<ConfigurationPage />} />

              {/* DataTable Page - User's configured table */}
              <Route path="/datatable" element={<DataTablePage />} />

              {/* Redirect unknown routes to example */}
              <Route path="*" element={<Navigate to="/example" replace />} />
            </Routes>
          </Content>
        </Layout>
      </Router>
    </ConfigProvider>
  );
};

export default App;
