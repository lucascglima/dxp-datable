# Components Documentation

Comprehensive guide to all components in the DxpTable project, organized by layer and feature.

## Table of Contents

- [Core Table Components](#core-table-components)
- [Feature Components](#feature-components)
  - [Preview Feature](#preview-feature)
  - [Columns Feature](#columns-feature)
  - [Events Feature](#events-feature)
- [Shared Components](#shared-components)
- [Configuration Form Components](#configuration-form-components)

---

## Core Table Components

### DxpTable

**Location**: `src/components/dxp-table/dxp-table.jsx`

**Purpose**: Main table component that orchestrates header, body, and footer.

**Props**:
```typescript
{
  columns: Array<Column>,          // Column definitions
  data: Array<Object>,             // Table data
  pagination: PaginationConfig,    // Pagination configuration
  rowKey: string,                  // Unique key for each row
  loading?: boolean,               // Loading state
  onSort?: Function,               // Sort callback
  onRowClick?: Function,           // Row click callback
  onPaginationChange?: Function,   // Pagination callback
}
```

**Example**:
```jsx
<DxpTable
  columns={[
    { key: 'id', title: 'ID', dataIndex: 'id', sortable: true },
    { key: 'name', title: 'Name', dataIndex: 'name' },
  ]}
  data={users}
  pagination={{ current: 1, pageSize: 10, total: 100 }}
  rowKey="id"
  onSort={(column, order) => console.log(column, order)}
/>
```

---

## Feature Components

### Preview Feature

#### ApiTestPanel

**Location**: `src/features/preview/components/api-test-panel.jsx`

**Purpose**: Displays API test button and results.

**Props**:
```typescript
{
  apiEndpoint: string,             // API endpoint
  testing: boolean,                // Testing in progress
  testResult: Object|null,         // Test result
  onTest: Function,                // Test callback
}
```

**Example**:
```jsx
<ApiTestPanel
  apiEndpoint="https://api.example.com/users"
  testing={false}
  testResult={{ success: true, message: 'Connection successful' }}
  onTest={() => handleTest()}
/>
```

#### ResponseMapperPanel

**Location**: `src/features/preview/components/response-mapper-panel.jsx`

**Purpose**: Configuration UI for response mapping.

**Props**:
```typescript
{
  enableMapping: boolean,
  dataPath: string,
  totalPath: string,
  mappingValidation: Object|null,
  onToggleMapping: Function,
  onDataPathChange: Function,
  onTotalPathChange: Function,
}
```

#### ColumnSuggestionsPanel

**Location**: `src/features/preview/components/column-suggestions-panel.jsx`

**Purpose**: Displays API response structure and column suggestions.

**Props**:
```typescript
{
  parsedStructure: Object|null,    // Parsed response structure
  onApplySuggestions: Function,    // Apply suggestions callback
  fullResponse: Object,            // Full API response
}
```

---

### Columns Feature

#### ColumnList

**Location**: `src/features/columns/components/column-list.jsx`

**Purpose**: Renders list of column editors.

**Props**:
```typescript
{
  columns: Array<Column>,
  onAdd: Function,
  onUpdate: Function,
  onRemove: Function,
  onRenderTypeChange: Function,
  onRenderConfigChange: Function,
}
```

#### ColumnEditor

**Location**: `src/features/columns/components/column-editor.jsx`

**Purpose**: Form for editing a single column.

**Props**:
```typescript
{
  column: Column,
  index: number,
  onUpdate: Function,
  onRemove: Function,
  onRenderTypeChange: Function,
  onRenderConfigChange: Function,
}
```

**Features**:
- Title and dataIndex configuration
- Width settings
- Sortable checkbox
- Render type selection
- Validation feedback

#### ColumnJsonModal

**Location**: `src/features/columns/components/column-json-modal.jsx`

**Purpose**: Modal for JSON import/export of columns.

**Props**:
```typescript
{
  visible: boolean,
  columns: Array<Column>,
  onClose: Function,
  onImport: Function,
}
```

#### RenderConfigForm

**Location**: `src/features/columns/components/render-config-form.jsx`

**Purpose**: Dynamic form for renderer-specific configuration.

**Props**:
```typescript
{
  renderType: string,
  config: Object,
  fields: Array<FieldDef>,
  onConfigChange: Function,
}
```

---

### Events Feature

#### RowClickEventSection

**Location**: `src/features/events/components/row-click-event-section.jsx`

**Purpose**: Configuration for row click events.

**Props**:
```typescript
{
  value: {
    enabled: boolean,
    code: string,
  },
  onChange: Function,
}
```

**Features**:
- Enable/disable toggle
- JavaScript code editor
- Syntax validation
- Example code loader
- Available variables documentation

#### SortingConfigSection

**Location**: `src/features/events/components/sorting-config-section.jsx`

**Purpose**: Configuration for column sorting.

**Props**:
```typescript
{
  value: {
    mode: 'server' | 'client' | 'disabled',
    serverConfig: Object,
  },
  onChange: Function,
}
```

**Features**:
- Mode selection (server/client/disabled)
- Server-side configuration
- Parameter name configuration
- Order format selection
- Query example display

---

## Shared Components

### QueryParamsEditor

**Location**: `src/components/shared/query-params-editor.jsx`

**Purpose**: Editor for query parameters (key-value pairs).

**Props**:
```typescript
{
  value: Array<{ key: string, value: string }>,
  onChange: Function,
}
```

**Features**:
- Add/remove parameters
- Key-value editing
- Validation

### UrlParamsEditor

**Location**: `src/components/shared/url-params-editor.jsx`

**Purpose**: Editor for URL path parameters.

**Props**:
```typescript
{
  value: Array<{ name: string, value: string }>,
  onChange: Function,
}
```

### DefaultQueryParamsEditor

**Location**: `src/components/shared/default-query-params-editor.jsx`

**Purpose**: Editor for default query parameters with enable/disable.

**Props**:
```typescript
{
  value: Array<{ key: string, value: string, enabled: boolean }>,
  onChange: Function,
}
```

---

## Configuration Form Components

### ApiConfigSection

**Location**: `src/components/configuration-form/api-config-section.jsx`

**Purpose**: Configuration section for API endpoint and authentication.

**Props**:
```typescript
{
  value: {
    apiEndpoint: string,
    authToken: string,
    urlParams: Array,
    defaultQueryParams: Array,
  },
  onChange: Function,
}
```

### PreviewSection

**Location**: `src/components/configuration-form/preview-section.jsx`

**Purpose**: Orchestrator for API preview and testing (refactored).

**Props**:
```typescript
{
  apiEndpoint: string,
  authToken: string,
  urlParams: Array,
  defaultQueryParams: Array,
  testQueryParams: Array,
  responseDataPath: Object|null,
  onTestQueryParamsChange: Function,
  onSuggestColumns: Function,
  onResponseMappingChange: Function,
}
```

**Composition**:
- QueryParamsEditor
- ResponseMapperPanel
- ApiTestPanel
- ColumnSuggestionsPanel

### ColumnsConfigSection

**Location**: `src/components/configuration-form/columns-config-section.jsx`

**Purpose**: Orchestrator for column configuration (refactored).

**Props**:
```typescript
{
  value: Array<Column>,
  onChange: Function,
}
```

**Composition**:
- ColumnList
- ColumnJsonModal

### EventsConfigSection

**Location**: `src/components/configuration-form/events-config.section.jsx`

**Purpose**: Orchestrator for events configuration (refactored).

**Props**:
```typescript
{
  value: {
    onRowClick: Object,
    sorting: Object,
  },
  onChange: Function,
}
```

**Composition**:
- RowClickEventSection
- SortingConfigSection

---

## Component Patterns

### Orchestrator Pattern

Orchestrator components compose smaller focused components:

```jsx
// Orchestrator
const PreviewSection = (props) => (
  <Space direction="vertical">
    <QueryParamsEditor {...queryProps} />
    <ResponseMapperPanel {...mapperProps} />
    <ApiTestPanel {...testProps} />
    <ColumnSuggestionsPanel {...suggestionsProps} />
  </Space>
);

// Used in parent
<PreviewSection {...allProps} />
```

**Benefits**:
- Single responsibility for each component
- Easy to test individually
- Reusable pieces

### Controlled Component Pattern

All form components are controlled:

```jsx
const [value, setValue] = useState('');

<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### Prop Drilling Prevention

Use hooks to avoid deep prop drilling:

```jsx
// Instead of passing through many levels
<Parent configState={configState}>
  <Child configState={configState}>
    <GrandChild configState={configState} />
  </Child>
</Parent>

// Use hooks at the level needed
const GrandChild = () => {
  const configState = useConfigurationState();
  // Use directly
};
```

---

## Styling

All components use Ant Design components with customization via:
- SCSS modules
- Theme tokens
- Inline styles (sparingly)

## Accessibility

Components follow accessibility best practices:
- Proper ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support

## Related Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture overview
- [HOOKS.md](HOOKS.md) - Custom hooks
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contributing guidelines
