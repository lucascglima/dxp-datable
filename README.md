# DxpTable Component - Visual Configuration Platform

A reusable, no-code DataTable component built with React and Ant Design, featuring a visual configuration interface and full Liferay Custom Element integration. Built following **Clean Architecture** and **Clean Code** principles.

## 🎯 Features

### Core Features
- **Visual No-Code Configuration** - Configure tables through an intuitive wizard interface
- **Clean Architecture** - Separation of concerns with core, features, and components layers
- **Fully Controlled Component** - Complete control over table state and behavior
- **Column Sorting** - Client-side and server-side sorting support
- **Custom Pagination** - Flexible pagination with page size selection
- **Dynamic Parameters** - Search inputs and filters that update the table
- **Event Handling** - Row click events with custom JavaScript code
- **Response Mapping** - Handle complex API responses with custom paths
- **Liferay Integration** - Ready for Liferay DXP Custom Element deployment

### Configuration Features
- API endpoint configuration with authentication
- URL parameters and query parameters support
- Column configuration with custom renderers (boolean, date, custom)
- Pagination settings (client/server-side)
- Event configuration (row clicks, sorting)
- Response mapping for nested data structures
- Test and preview API responses before saving
- Column suggestions from API response
- JSON import/export for column configurations

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Quick start guide for users
- **[NO-CODE-GUIDE.md](NO-CODE-GUIDE.md)** - No-code configuration guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Detailed architecture documentation
- **[HOOKS.md](HOOKS.md)** - Custom hooks reference
- **[COMPONENTS.md](COMPONENTS.md)** - Components documentation
- **[VALIDATORS.md](VALIDATORS.md)** - Validation utilities
- **[REFACTORING-SUMMARY.md](REFACTORING-SUMMARY.md)** - Refactoring summary and metrics
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contributing guidelines
- **[IMPROVEMENTS.md](IMPROVEMENTS.md)** - Future improvements

## 🏗️ Project Structure (Clean Architecture)

```
/src
  /core                           # Core business logic (framework-independent)
    /hooks                        # Shared custom hooks
      ├── use-configuration-state.js
      └── use-column-manager.js
    /validators                   # Business rules validators
      ├── config-validator.js
      ├── column-validator.js
      └── mapping-validator.js
    /models                       # Types and constants
      └── configuration.types.js

  /features                       # Feature modules (use cases)
    /configuration
      /hooks
        └── use-configuration-wizard.jsx
      /components
        ├── configuration-wizard.jsx
        └── step-navigation.jsx
    /preview
      /components
        ├── api-test-panel.jsx
        ├── response-mapper-panel.jsx
        └── column-suggestions-panel.jsx
      /hooks
        ├── use-api-test.js
        └── use-response-mapping.js
    /columns
      /components
        ├── column-list.jsx
        ├── column-editor.jsx
        ├── column-json-modal.jsx
        └── render-config-form.jsx
    /events
      /components
        ├── row-click-event-section.jsx
        └── sorting-config-section.jsx

  /components                     # Reusable UI components
    /dxp-table                    # Main table component
      ├── dxp-table.jsx
      ├── dxp-table-header.jsx
      ├── dxp-table-footer.jsx
      └── dxp-table.types.js
    /shared                       # Shared components
      ├── query-params-editor.jsx
      ├── url-params-editor.jsx
      └── default-query-params-editor.jsx
    /configuration-form           # Configuration sections
      ├── api-config-section.jsx
      ├── columns-config-section.jsx
      ├── pagination-config-section.jsx
      ├── events-config.section.jsx
      ├── dynamic-params-config-section.jsx
      └── preview-section.jsx

  /services                       # External services
    ├── config-storage.js         # localStorage management
    ├── liferay-api.js           # Liferay API client
    └── external-api.js          # External API client

  /utils                          # Utility functions
    ├── api-validator.js
    ├── query-string-parser.js
    ├── url-params-replacer.js
    └── column-renderers/
        ├── index.jsx
        ├── boolean-renderer.jsx
        ├── date-renderer.jsx
        └── default-renderer.jsx

  /pages                          # Application pages
    ├── configuration-page.jsx    # Configuration wizard
    └── datatable-page.jsx        # Table display

  /config                         # Configuration files
    └── liferay-config.js

  /styles                         # Styles
    ├── main.scss
    └── theme/
```

## 🚀 Installation

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

## 💡 Quick Start

### Option 1: Visual Configuration (No Code)

1. Run the development server: `npm run dev`
2. Navigate to the configuration page
3. Follow the 6-step wizard:
   - **Step 1**: Configure API endpoint and authentication
   - **Step 2**: Test API and preview response structure
   - **Step 3**: Configure columns (or use suggestions)
   - **Step 4**: Configure pagination
   - **Step 5**: Configure events (row clicks, sorting)
   - **Step 6**: Configure dynamic parameters (search, filters)
4. Save and view your configured table

### Option 2: Code-Based Usage

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

## 🎨 Architecture Highlights

### Clean Architecture Principles

1. **Separation of Concerns**: Business logic (core) is separated from UI (components)
2. **Dependency Rule**: Dependencies point inward (components → features → core)
3. **Single Responsibility**: Each module has one reason to change
4. **Reusability**: Hooks and validators can be used independently
5. **Testability**: Isolated components and hooks are easy to test

### Key Design Patterns

- **Custom Hooks Pattern**: Encapsulate stateful logic
- **Composition Pattern**: Small, focused components composed together
- **Factory Pattern**: Column renderers creation
- **Observer Pattern**: Event handling and callbacks
- **Strategy Pattern**: Different sorting modes (server/client/disabled)

## 📊 Refactoring Results

The project was recently refactored following Clean Architecture principles:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Total Lines** | 2,167 | ~620 | **-71%** |
| **Largest File** | 645 lines | ~250 lines | **-61%** |
| **Files >600 lines** | 3 | 0 | **-100%** |
| **Responsibilities/File** | 3-4 | 1-2 | **-50%** |

See [REFACTORING-SUMMARY.md](REFACTORING-SUMMARY.md) for details.

## 🔧 API Reference

### DxpTable Component

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
| render | Object | No | Custom render configuration (type, config) |

### Custom Hooks

- **[useConfigurationState](HOOKS.md#useconfigurationstate)** - Manage configuration state
- **[useColumnManager](HOOKS.md#usecolumnmanager)** - CRUD operations for columns
- **[useConfigurationWizard](HOOKS.md#useconfigurationwizard)** - Wizard navigation
- **[useApiTest](HOOKS.md#useapitest)** - API connection testing
- **[useResponseMapping](HOOKS.md#useresponsemapping)** - Response mapping configuration
- **[useTableData](HOOKS.md#usetabledata)** - Table data management

## 🌐 Liferay Custom Element Integration

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

Liferay automatically provides configuration via `window.Liferay` object.

### Client Extension Configuration

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

## 🧪 Development

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

## 📝 Common Liferay Endpoints

- User Accounts: `/o/headless-admin-user/v1.0/user-accounts`
- Blog Posts: `/o/headless-delivery/v1.0/sites/{siteId}/blog-postings`
- Structured Content: `/o/headless-delivery/v1.0/sites/{siteId}/structured-contents`
- Documents: `/o/headless-delivery/v1.0/sites/{siteId}/documents`

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:
- Adding new components following the architecture
- Creating new hooks
- Code conventions and naming patterns
- How to add validators

## 📄 License

MIT

## 🙏 Acknowledgments

Built with:
- [React](https://reactjs.org/)
- [Ant Design](https://ant.design/)
- [Vite](https://vitejs.dev/)
- [Axios](https://axios-http.com/)
- [date-fns](https://date-fns.org/)
