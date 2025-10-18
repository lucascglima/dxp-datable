# DxpTable Component

A reusable DataTable component built with React and Ant Design, with full Liferay Custom Element integration.

## Features

- Fully controlled/stateless component
- Column sorting support
- Custom pagination with page size selection
- Row click handling
- Record count display
- Liferay Headless API integration
- Custom element support for Liferay DXP
- Debounced data fetching
- Error handling and loading states
- Simple and clean API

## Project Structure

```
/src
  /components
    /dxp-table
      ├── dxp-table.jsx              # Main table orchestrator
      ├── dxp-table-header.jsx       # Column management
      ├── dxp-table-footer.jsx       # Pagination and footer
      ├── dxp-table.types.js         # PropTypes definitions
      └── index.js                   # Exports
  /config
    └── liferay-config.js            # Liferay context reader
  /services
    └── liferay-api.js               # API service with axios
  /hooks
    └── use-table-data.js            # Custom hook for data management
  /pages
    └── example-page.jsx             # Example usage page
  ├── App.jsx                        # Main app component
  ├── main.jsx                       # Entry point & custom element
  └── index.css                      # Global styles
```

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env.local` and configure:

```env
VITE_LIFERAY_API_URL=http://localhost:8080
VITE_LIFERAY_TOKEN=your-oauth-token-here
```

### 3. Development

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

## Usage

### Basic Usage with useTableData Hook

```javascript
import DxpTable from './components/dxp-table';
import { useTableData } from './hooks/use-table-data';

function MyComponent() {
  const {
    data,
    loading,
    pagination,
    handlePaginationChange,
    handleSort,
  } = useTableData('/o/headless-admin-user/v1.0/user-accounts', {
    initialPageSize: 10,
    debounceDelay: 300,
  });

  const columns = [
    { key: 'id', title: 'ID', dataIndex: 'id', sortable: true },
    { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
    { key: 'email', title: 'Email', dataIndex: 'emailAddress' },
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
      onRowClick={(record) => console.log(record)}
    />
  );
}
```

## Props

### DxpTable

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| columns | Array | Yes | Column configuration array |
| data | Array | Yes | Data array to be rendered |
| pagination | Object | Yes | Pagination configuration (current, pageSize, total) |
| rowKey | String | Yes | Unique key for each row |
| loading | Boolean | No | Loading state indicator |
| onSort | Function | No | Callback when column is sorted |
| onRowClick | Function | No | Callback when row is clicked |
| onPaginationChange | Function | No | Callback when pagination changes |

### Column Configuration

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| key | String | Yes | Unique identifier for the column |
| title | String | Yes | Column header title |
| dataIndex | String | Yes | Key in data object |
| sortable | Boolean | No | Enable sorting for this column |
| width | String/Number | No | Column width |
| align | String | No | Text alignment (left, center, right) |
| render | Function | No | Custom render function for cells |

## API Reference

### useTableData Hook

Custom hook that manages table state and data fetching.

**Parameters:**
- `endpoint` (string): Liferay API endpoint
- `options` (object):
  - `initialPageSize` (number): Initial page size (default: 10)
  - `debounceDelay` (number): Debounce delay in ms (default: 300)
  - `initialFilters` (object): Initial filter values
  - `autoFetch` (boolean): Auto-fetch data on mount (default: true)

**Returns:**
- `data` (array): Current page data
- `loading` (boolean): Loading state
- `error` (object): Error object if request fails
- `pagination` (object): Pagination state
- `handlePaginationChange` (function): Pagination change handler
- `handleSort` (function): Sort change handler
- `handleFilterChange` (function): Filter change handler
- `refetch` (function): Manually trigger data refetch
- `reset` (function): Reset table state

### Liferay API Service

The `liferay-api.js` service provides these methods:

- `getTableData(endpoint, params)` - GET request with pagination/sorting
- `postData(endpoint, data)` - POST request
- `putData(endpoint, data)` - PUT request
- `deleteData(endpoint)` - DELETE request
- `getById(endpoint, id)` - GET single item by ID

## Liferay Custom Element Integration

### Deployment to Liferay

After building, the `dist/` folder contains:
- `main.js` - Application bundle
- `main.css` - Styles
- `assets/` - Static assets

### Using in Liferay

The component is registered as a custom element:

```html
<dxp-datatable></dxp-datatable>
```

Liferay automatically provides configuration via `window.Liferay` object containing:
- Authentication token
- API base URL
- User context
- Theme information

### Client Extension Configuration

Create a `client-extension.yaml` for Liferay deployment:

```yaml
assemble:
  - from: dist
    include: "**/*"
    into: static

dxp-datatable-custom-element:
  cssURLs:
    - main.css
  friendlyURLMapping: dxp-datatable
  htmlElementName: dxp-datatable
  instanceable: true
  name: DxpTable Component
  portletCategoryName: category.client-extensions
  type: customElement
  urls:
    - main.js
  useESM: true
```

## Components

- **dxp-table.jsx** - Main component that orchestrates the table
- **dxp-table-header.jsx** - Manages columns and header configuration
- **dxp-table-footer.jsx** - Manages pagination and footer information
- **dxp-table.types.js** - PropTypes definitions
- **liferay-config.js** - Liferay context configuration reader
- **liferay-api.js** - API service with axios and interceptors
- **use-table-data.js** - Custom hook for data management

## Common Liferay Endpoints

- User Accounts: `/o/headless-admin-user/v1.0/user-accounts`
- Blog Posts: `/o/headless-delivery/v1.0/sites/{siteId}/blog-postings`
- Structured Content: `/o/headless-delivery/v1.0/sites/{siteId}/structured-contents`
- Documents: `/o/headless-delivery/v1.0/sites/{siteId}/documents`

## Development

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint Code

```bash
npm run lint
```

## License

MIT
