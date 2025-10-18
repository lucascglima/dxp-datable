# Quick Start Guide

This guide will help you get the DxpTable component up and running quickly.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- (Optional) Liferay DXP 7.4+ for deployment

## Local Development Setup

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment (Optional)

For local development with a real Liferay instance:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_LIFERAY_API_URL=http://localhost:8080
VITE_LIFERAY_TOKEN=your-oauth-token-here
```

### Step 3: Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:3000`

## Understanding the Code

### 1. DxpTable Component

The main table component is located at `src/components/dxp-table/`:

```javascript
import DxpTable from './components/dxp-table';

<DxpTable
  columns={columns}
  data={data}
  pagination={pagination}
  rowKey="id"
  loading={loading}
  onPaginationChange={handlePaginationChange}
  onSort={handleSort}
  onRowClick={handleRowClick}
/>
```

### 2. useTableData Hook

Simplifies data fetching and state management:

```javascript
import { useTableData } from './hooks/use-table-data';

const {
  data,
  loading,
  pagination,
  handlePaginationChange,
  handleSort,
  refetch,
} = useTableData('/o/headless-admin-user/v1.0/user-accounts');
```

### 3. Column Configuration

Define your table columns:

```javascript
const columns = [
  {
    key: 'id',
    title: 'ID',
    dataIndex: 'id',
    sortable: true,
    width: 80,
  },
  {
    key: 'name',
    title: 'Name',
    dataIndex: 'name',
    sortable: true,
    render: (text, record) => (
      <span>{text || `${record.givenName} ${record.familyName}`}</span>
    ),
  },
];
```

## Creating a New Page

### Step 1: Create Page Component

Create `src/pages/my-page.jsx`:

```javascript
import React from 'react';
import DxpTable from '../components/dxp-table';
import { useTableData } from '../hooks/use-table-data';

const MyPage = () => {
  const { data, loading, pagination, handlePaginationChange, handleSort } =
    useTableData('/your/api/endpoint');

  const columns = [
    // Define your columns
  ];

  return (
    <DxpTable
      columns={columns}
      data={data}
      pagination={pagination}
      loading={loading}
      rowKey="id"
      onPaginationChange={handlePaginationChange}
      onSort={handleSort}
    />
  );
};

export default MyPage;
```

### Step 2: Add Route

Edit `src/App.jsx`:

```javascript
import MyPage from './pages/my-page';

// In Routes:
<Route path="/my-page" element={<MyPage />} />
```

## Deploying to Liferay

### Step 1: Build the Project

```bash
npm run build
```

This creates a `dist/` folder with:
- `main.js` - Application bundle
- `main.css` - Styles
- `assets/` - Static resources

### Step 2: Deploy to Liferay

1. Copy the contents of `dist/` to your Liferay workspace client extension folder
2. Ensure `client-extension.yaml` is in the root of your client extension
3. Deploy using Liferay Workspace:

```bash
blade gw deploy
```

### Step 3: Add to a Page

1. Go to your Liferay site
2. Edit a page
3. Add a "Widget" fragment
4. Search for "DxpTable Component"
5. Drag and drop it onto the page

## Customizing API Calls

### Custom Filters

```javascript
const { data, handleFilterChange } = useTableData(endpoint, {
  initialFilters: {
    status: 'active',
    type: 'user',
  },
});

// Update filters
handleFilterChange({ status: 'inactive' });
```

### Manual Refetch

```javascript
const { refetch } = useTableData(endpoint);

// Manually trigger data refresh
const handleRefresh = () => {
  refetch();
};
```

### Custom Request Configuration

Edit `src/services/liferay-api.js` to add custom headers or interceptors:

```javascript
// Add custom header
instance.interceptors.request.use((config) => {
  config.headers['X-Custom-Header'] = 'value';
  return config;
});
```

## Troubleshooting

### CORS Errors

If you encounter CORS errors in development:

1. Configure Liferay CORS settings
2. Use a proxy in `vite.config.js`:

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/o': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
```

### Authentication Issues

If API calls fail with 401:

1. Verify your OAuth token in `.env.local`
2. Check Liferay OAuth2 configuration
3. Ensure user has appropriate permissions

### Data Not Loading

1. Check browser console for errors
2. Verify API endpoint is correct
3. Check network tab for response data structure
4. Ensure data structure matches column `dataIndex` values

## Next Steps

- Customize the table styling in `src/index.css`
- Add more pages for different data types
- Implement filtering UI components
- Add export functionality
- Create custom cell renderers

## Resources

- [Ant Design Table Documentation](https://ant.design/components/table)
- [Liferay Headless API](https://learn.liferay.com/w/dxp/headless-delivery/consuming-apis)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
