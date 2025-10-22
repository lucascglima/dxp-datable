# Custom Hooks Reference

This document provides detailed documentation for all custom hooks used in the DxpTable Component project.

## Table of Contents

- [Core Hooks](#core-hooks)
  - [useConfigurationState](#useconfigurationstate)
  - [useColumnManager](#usecolumnmanager)
- [Feature Hooks](#feature-hooks)
  - [useConfigurationWizard](#useconfigurationwizard)
  - [useApiTest](#useapitest)
  - [useResponseMapping](#useresponsemapping)
- [Table Hooks](#table-hooks)
  - [useTableData](#usetabledata)

---

## Core Hooks

### useConfigurationState

**Location**: `src/core/hooks/use-configuration-state.js`

**Purpose**: Manages the main configuration state with auto-save to localStorage.

**Parameters**: None

**Returns**:
```typescript
{
  config: Object,                      // Current configuration object
  setConfig: Function,                 // Set entire configuration
  updateApiConfig: Function,           // Update API configuration
  updateTestQueryParams: Function,     // Update test query parameters
  updateColumns: Function,             // Update columns configuration
  updatePagination: Function,          // Update pagination settings
  updateEvents: Function,              // Update events configuration
  updateDynamicParams: Function,       // Update dynamic parameters
  updateResponseMapping: Function,     // Update response mapping
  replaceConfig: Function,             // Replace entire configuration
  clearConfig: Function,               // Clear and reset configuration
  saveConfig: Function,                // Manual save to localStorage
}
```

**Usage Example**:
```javascript
import { useConfigurationState } from '../core/hooks/use-configuration-state';

function ConfigurationPage() {
  const configState = useConfigurationState();

  const handleApiChange = (apiConfig) => {
    configState.updateApiConfig(apiConfig);
  };

  return (
    <div>
      <ApiConfigSection
        value={configState.config.apiEndpoint}
        onChange={handleApiChange}
      />
    </div>
  );
}
```

**Features**:
- ✅ Automatic save to localStorage on changes
- ✅ Loads existing configuration on mount
- ✅ Backward compatibility with older configs
- ✅ Provides granular update functions

---

### useColumnManager

**Location**: `src/core/hooks/use-column-manager.js`

**Purpose**: Manages column CRUD operations with validation and JSON import/export.

**Parameters**:
- `initialColumns` (Array): Initial columns array
- `onChange` (Function): Callback when columns change

**Returns**:
```typescript
{
  columns: Array,                  // Current columns array
  addColumn: Function,             // Add new empty column
  removeColumn: Function,          // Remove column by index
  updateColumn: Function,          // Update column field
  updateRenderType: Function,      // Update column render type
  updateRenderConfig: Function,    // Update render configuration
  importFromJson: Function,        // Import columns from JSON string
  exportToJson: Function,          // Export columns to JSON string
  exportToFile: Function,          // Export and download as file
  replaceColumns: Function,        // Replace all columns
}
```

**Usage Example**:
```javascript
import { useColumnManager } from '../core/hooks/use-column-manager';

function ColumnsConfig({ value, onChange }) {
  const columnManager = useColumnManager(value, onChange);

  const handleAddColumn = () => {
    columnManager.addColumn();
  };

  const handleImport = (jsonText) => {
    const result = columnManager.importFromJson(jsonText);
    if (!result.success) {
      console.error(result.errors);
    }
  };

  return (
    <div>
      <Button onClick={handleAddColumn}>Add Column</Button>
      <Button onClick={columnManager.exportToFile}>Export JSON</Button>
    </div>
  );
}
```

**Features**:
- ✅ CRUD operations for columns
- ✅ JSON import with validation
- ✅ JSON export with download
- ✅ Auto-generates column keys
- ✅ Validates column data

---

## Feature Hooks

### useConfigurationWizard

**Location**: `src/features/configuration/hooks/use-configuration-wizard.jsx`

**Purpose**: Manages wizard step navigation and state.

**Parameters**: None

**Returns**:
```typescript
{
  currentStep: number,             // Current step index (0-based)
  stepDefinitions: Array,          // Array of step definitions
  nextStep: Function,              // Navigate to next step
  previousStep: Function,          // Navigate to previous step
  goToStep: Function,              // Navigate to specific step
  resetWizard: Function,           // Reset to first step
  isFirstStep: boolean,            // True if on first step
  isLastStep: boolean,             // True if on last step
  getCurrentStep: Function,        // Get current step definition
  totalSteps: number,              // Total number of steps
}
```

**Step Definitions**:
```javascript
[
  { key: 'api', title: 'API', icon: <ApiOutlined /> },
  { key: 'preview', title: 'Preview e Teste', icon: <EyeOutlined /> },
  { key: 'columns', title: 'Colunas', icon: <TableOutlined /> },
  { key: 'pagination', title: 'Paginação', icon: <SettingOutlined /> },
  { key: 'events', title: 'Eventos', icon: <ThunderboltOutlined /> },
  { key: 'dynamicParams', title: 'Inputs dinâmicos', icon: <SearchOutlined /> },
]
```

**Usage Example**:
```javascript
import { useConfigurationWizard } from '../features/configuration/hooks/use-configuration-wizard.jsx';

function ConfigurationWizard() {
  const wizard = useConfigurationWizard();

  return (
    <div>
      <Steps current={wizard.currentStep} />
      {wizard.stepDefinitions[wizard.currentStep].content}

      <div>
        {!wizard.isFirstStep && (
          <Button onClick={wizard.previousStep}>Previous</Button>
        )}
        {!wizard.isLastStep && (
          <Button onClick={wizard.nextStep}>Next</Button>
        )}
      </div>
    </div>
  );
}
```

**Features**:
- ✅ Step navigation with validation
- ✅ Icon configuration for each step
- ✅ Helper methods for first/last step
- ✅ Direct step navigation

---

### useApiTest

**Location**: `src/features/preview/hooks/use-api-test.js`

**Purpose**: Manages API connection testing with validation.

**Parameters**: None

**Returns**:
```typescript
{
  testing: boolean,                // True while testing
  testResult: Object|null,         // Test result or null
  runTest: Function,               // Execute API test
  clearResult: Function,           // Clear test result
}
```

**runTest Parameters**:
```typescript
{
  apiEndpoint: string,             // API endpoint URL
  authToken: string,               // Authentication token
  urlParams: Array,                // URL parameters
  queryParams: Array,              // Query parameters
  defaultQueryParams: Array,       // Default query parameters
  mappingConfig: Object|null,      // Response mapping configuration
}
```

**Test Result Structure**:
```typescript
{
  success: boolean,                // Test success status
  message: string,                 // Result message
  sampleData: Object,              // Sample data from response
  fullResponse: Object,            // Full API response
  errors: Array,                   // Validation errors (if any)
  duplicateErrors: Array,          // Duplicate param errors (if any)
}
```

**Usage Example**:
```javascript
import { useApiTest } from '../features/preview/hooks/use-api-test';

function ApiTestPanel({ apiEndpoint, authToken }) {
  const { testing, testResult, runTest } = useApiTest();

  const handleTest = async () => {
    const result = await runTest({
      apiEndpoint,
      authToken,
      queryParams: [{ key: 'page', value: '1' }],
    });

    if (result.success) {
      console.log('Test passed!', result.sampleData);
    }
  };

  return (
    <div>
      <Button loading={testing} onClick={handleTest}>
        Test API
      </Button>
      {testResult && (
        <Alert type={testResult.success ? 'success' : 'error'}>
          {testResult.message}
        </Alert>
      )}
    </div>
  );
}
```

**Features**:
- ✅ URL validation before testing
- ✅ Duplicate parameter detection
- ✅ Mapping validation
- ✅ Merges default and test parameters
- ✅ Returns structured test results

---

### useResponseMapping

**Location**: `src/features/preview/hooks/use-response-mapping.js`

**Purpose**: Manages response mapping configuration and validation.

**Parameters**:
- `initialMapping` (Object|null): Initial mapping configuration
- `onChange` (Function): Callback when mapping changes

**Returns**:
```typescript
{
  enableMapping: boolean,          // Mapping enabled flag
  dataPath: string,                // Path to data array
  totalPath: string,               // Path to total count
  mappingValidation: Object|null,  // Validation result
  toggleMapping: Function,         // Enable/disable mapping
  updateDataPath: Function,        // Update data path
  updateTotalPath: Function,       // Update total path
  validateAgainstResponse: Function, // Validate against response
  clearValidation: Function,       // Clear validation
  getMappingConfig: Function,      // Get current mapping config
}
```

**Mapping Configuration Structure**:
```typescript
{
  dataKey: string,                 // Path to items array (e.g., "data.items")
  totalKey: string,                // Path to total count (e.g., "data.total")
  totalSource: 'body',             // Source of total (always 'body')
}
```

**Usage Example**:
```javascript
import { useResponseMapping } from '../features/preview/hooks/use-response-mapping';

function ResponseMapperPanel({ initialMapping, onChange }) {
  const mapping = useResponseMapping(initialMapping, onChange);

  const handleValidate = (response) => {
    const validation = mapping.validateAgainstResponse(response);
    if (validation.itemsFound) {
      console.log(`Found ${validation.itemsCount} items`);
    }
  };

  return (
    <div>
      <Checkbox
        checked={mapping.enableMapping}
        onChange={(e) => mapping.toggleMapping(e.target.checked)}
      >
        Enable Mapping
      </Checkbox>

      {mapping.enableMapping && (
        <Input
          value={mapping.dataPath}
          onChange={(e) => mapping.updateDataPath(e.target.value)}
          placeholder="data.items"
        />
      )}
    </div>
  );
}
```

**Features**:
- ✅ Toggle mapping on/off
- ✅ Dot notation path support
- ✅ Validates paths against response
- ✅ Auto-notifies parent on changes
- ✅ Returns structured validation

---

## Table Hooks

### useTableData

**Location**: `src/hooks/use-table-data.js`

**Purpose**: Manages table data fetching, pagination, and sorting.

**Parameters**:
- `endpoint` (string): API endpoint
- `options` (Object): Configuration options

**Options**:
```typescript
{
  initialPageSize: number,         // Initial page size (default: 10)
  debounceDelay: number,          // Debounce delay in ms (default: 300)
  initialFilters: Object,         // Initial filter values
  autoFetch: boolean,             // Auto-fetch on mount (default: true)
}
```

**Returns**:
```typescript
{
  data: Array,                     // Current page data
  loading: boolean,                // Loading state
  error: Object|null,              // Error object
  pagination: Object,              // Pagination state
  handlePaginationChange: Function, // Pagination handler
  handleSort: Function,            // Sort handler
  handleFilterChange: Function,    // Filter handler
  refetch: Function,               // Manual refetch
  reset: Function,                 // Reset table state
}
```

**Pagination State**:
```typescript
{
  current: number,                 // Current page number
  pageSize: number,                // Items per page
  total: number,                   // Total items count
}
```

**Usage Example**:
```javascript
import { useTableData } from './hooks/use-table-data';

function MyDataTable() {
  const {
    data,
    loading,
    pagination,
    handlePaginationChange,
    handleSort,
  } = useTableData('/api/users', {
    initialPageSize: 20,
    debounceDelay: 500,
  });

  return (
    <DxpTable
      data={data}
      loading={loading}
      pagination={pagination}
      onPaginationChange={handlePaginationChange}
      onSort={handleSort}
    />
  );
}
```

**Features**:
- ✅ Automatic data fetching
- ✅ Debounced requests
- ✅ Pagination support
- ✅ Sorting support
- ✅ Filter support
- ✅ Error handling
- ✅ Manual refetch
- ✅ State reset

---

## Hook Best Practices

### 1. Single Responsibility
Each hook should have one clear responsibility.

✅ Good:
```javascript
const { columns, addColumn } = useColumnManager();
const { testing, runTest } = useApiTest();
```

❌ Bad:
```javascript
const { columns, addColumn, testing, runTest } = useMegaHook();
```

### 2. Return Objects, Not Arrays
Makes it easier to add new return values without breaking existing code.

✅ Good:
```javascript
const { data, loading, error } = useTableData();
```

❌ Bad:
```javascript
const [data, loading, error] = useTableData();
```

### 3. Prefix with 'use'
Follow React's naming convention for hooks.

✅ Good: `useApiTest`, `useColumnManager`
❌ Bad: `apiTest`, `columnManager`

### 4. Keep Hooks Pure
Hooks should not have side effects in their definition, only in effects.

✅ Good:
```javascript
const useApiTest = () => {
  const [testing, setTesting] = useState(false);

  const runTest = async () => {
    setTesting(true);
    // ... test logic
  };

  return { testing, runTest };
};
```

### 5. Document Return Values
Always document what the hook returns.

```javascript
/**
 * Custom hook for API testing
 * @returns {{
 *   testing: boolean,
 *   testResult: Object|null,
 *   runTest: Function,
 *   clearResult: Function
 * }}
 */
export const useApiTest = () => {
  // ...
};
```

## Testing Hooks

### Unit Testing with React Testing Library

```javascript
import { renderHook, act } from '@testing-library/react';
import { useColumnManager } from '../use-column-manager';

describe('useColumnManager', () => {
  it('should add a column', () => {
    const { result } = renderHook(() => useColumnManager([], jest.fn()));

    act(() => {
      result.current.addColumn();
    });

    expect(result.current.columns).toHaveLength(1);
  });
});
```

## Related Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture overview
- [COMPONENTS.md](COMPONENTS.md) - Component documentation
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contributing guidelines
