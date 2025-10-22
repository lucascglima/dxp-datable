# Architecture Documentation

This document describes the architecture of the DxpTable Component project, built following **Clean Architecture** and **Clean Code** principles.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Clean Architecture Principles](#clean-architecture-principles)
- [Layer Responsibilities](#layer-responsibilities)
- [Project Structure](#project-structure)
- [Dependency Flow](#dependency-flow)
- [Design Patterns](#design-patterns)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [Data Flow](#data-flow)

## Architecture Overview

The project follows a **layered architecture** inspired by Clean Architecture (Robert C. Martin), organized into three main layers:

```
┌─────────────────────────────────────────────────┐
│             PRESENTATION LAYER                   │
│  (Pages, Components, Features UI)               │
│  - React Components                              │
│  - User Interface                                │
└────────────┬────────────────────────────────────┘
             │ depends on ↓
┌────────────┴────────────────────────────────────┐
│           APPLICATION LAYER                      │
│  (Features, Use Cases)                           │
│  - Feature modules                               │
│  - Use case specific logic                       │
└────────────┬────────────────────────────────────┘
             │ depends on ↓
┌────────────┴────────────────────────────────────┐
│              CORE LAYER                          │
│  (Business Logic, Domain)                        │
│  - Hooks                                         │
│  - Validators                                    │
│  - Models/Types                                  │
│  - Framework-independent                         │
└──────────────────────────────────────────────────┘
```

## Clean Architecture Principles

### 1. Independence of Frameworks
- Core business logic doesn't depend on React or Ant Design
- Hooks and validators are framework-agnostic
- Easy to migrate to another UI library if needed

### 2. Testability
- Business rules can be tested without UI
- Isolated components are easy to unit test
- Validators work independently

### 3. Independence of UI
- UI components are thin wrappers around business logic
- Easy to change UI without affecting business rules

### 4. Independence of Database/External Services
- Services are abstracted behind interfaces
- Easy to swap localStorage for API storage
- API clients can be replaced

### 5. Dependency Rule
**Dependencies point inward**: Outer layers depend on inner layers, never the reverse.

```
Components → Features → Core
     ↓          ↓        ↓
  (UI)    (Use Cases) (Domain)
```

## Layer Responsibilities

### Core Layer (`/src/core`)

**Responsibility**: Contains business logic, domain models, and framework-independent code.

**Contains**:
- `/hooks` - Reusable custom hooks with business logic
- `/validators` - Business rule validators
- `/models` - Type definitions and constants

**Rules**:
- ✅ NO dependencies on frameworks (React, Ant Design)
- ✅ Pure functions where possible
- ✅ Can be used by any layer above
- ✅ Fully testable in isolation

**Example**:
```javascript
// core/validators/column-validator.js
export const validateColumn = (column, index) => {
  const errors = [];
  if (!column.title) {
    errors.push(`Column ${index + 1}: Title is required`);
  }
  return errors;
};
```

### Features Layer (`/src/features`)

**Responsibility**: Contains feature-specific use cases and components.

**Contains**:
- `/configuration` - Configuration wizard feature
- `/preview` - API preview and testing feature
- `/columns` - Column management feature
- `/events` - Events configuration feature

**Rules**:
- ✅ Can depend on core layer
- ✅ Contains feature-specific UI components
- ✅ Encapsulates feature logic
- ❌ Should NOT depend on other features

**Example**:
```javascript
// features/preview/hooks/use-api-test.js
import { validateUrl } from '../../../core/validators/...';

export const useApiTest = () => {
  // Feature-specific API testing logic
  // Uses core validators
};
```

### Components Layer (`/src/components`)

**Responsibility**: Reusable UI components used across features.

**Contains**:
- `/dxp-table` - Main table component
- `/shared` - Shared UI components
- `/configuration-form` - Configuration form sections

**Rules**:
- ✅ Can depend on core and features
- ✅ Focused on presentation
- ✅ Reusable across different features
- ❌ Minimal business logic

### Services Layer (`/src/services`)

**Responsibility**: External integrations and infrastructure concerns.

**Contains**:
- `config-storage.js` - localStorage operations
- `liferay-api.js` - Liferay API client
- `external-api.js` - External API client

**Rules**:
- ✅ Abstracts external dependencies
- ✅ Can be swapped/mocked easily
- ✅ Single responsibility per service

## Project Structure

```
/src
  /core                             # 🟢 CORE LAYER
    /hooks
      ├── use-configuration-state.js  # State management
      └── use-column-manager.js       # Column CRUD operations
    /validators
      ├── config-validator.js         # Configuration validation
      ├── column-validator.js         # Column validation
      └── mapping-validator.js        # Response mapping validation
    /models
      └── configuration.types.js      # Type definitions & constants

  /features                         # 🟡 FEATURES LAYER
    /configuration
      /hooks
        └── use-configuration-wizard.jsx  # Wizard navigation
    /preview
      /components
        ├── api-test-panel.jsx           # API testing UI
        ├── response-mapper-panel.jsx     # Mapping UI
        └── column-suggestions-panel.jsx  # Suggestions UI
      /hooks
        ├── use-api-test.js              # Testing logic
        └── use-response-mapping.js      # Mapping logic
    /columns
      /components
        ├── column-list.jsx              # List view
        ├── column-editor.jsx            # Editor view
        ├── column-json-modal.jsx        # JSON modal
        └── render-config-form.jsx       # Renderer config
    /events
      /components
        ├── row-click-event-section.jsx  # Click events
        └── sorting-config-section.jsx   # Sorting config

  /components                       # 🔵 COMPONENTS LAYER
    /dxp-table                      # Main table
    /shared                         # Shared components
    /configuration-form             # Form sections

  /services                         # ⚡ INFRASTRUCTURE
    ├── config-storage.js           # Storage abstraction
    ├── liferay-api.js             # Liferay client
    └── external-api.js            # External client

  /utils                            # 🛠️ UTILITIES
    ├── api-validator.js
    ├── query-string-parser.js
    └── column-renderers/

  /pages                            # 📄 PAGES
    ├── configuration-page.jsx
    └── datatable-page.jsx
```

## Dependency Flow

### Correct Dependencies ✅

```
configuration-page.jsx
  ↓ uses
useConfigurationState (core/hooks)
  ↓ uses
config-validator (core/validators)

preview-section.jsx
  ↓ uses
ApiTestPanel (features/preview/components)
  ↓ uses
useApiTest (features/preview/hooks)
  ↓ uses
validateUrl (utils/api-validator)
```

### Incorrect Dependencies ❌

```
❌ core/validators → components
❌ core/hooks → features
❌ features/preview → features/columns
```

## Design Patterns

### 1. Custom Hooks Pattern

Encapsulates stateful logic in reusable hooks.

```javascript
// core/hooks/use-configuration-state.js
export const useConfigurationState = () => {
  const [config, setConfig] = useState(defaultConfig);

  const updateApiConfig = (apiConfig) => {
    setConfig(prev => ({ ...prev, ...apiConfig }));
  };

  return { config, updateApiConfig, ... };
};
```

**Benefits**:
- Reusable logic
- Testable in isolation
- Separation of concerns

### 2. Composition Pattern

Build complex UIs from smaller, focused components.

```javascript
// preview-section.jsx (Orchestrator)
const PreviewSection = (props) => (
  <Space>
    <QueryParamsEditor {...queryProps} />
    <ResponseMapperPanel {...mapperProps} />
    <ApiTestPanel {...testProps} />
    <ColumnSuggestionsPanel {...suggestionsProps} />
  </Space>
);
```

**Benefits**:
- Single responsibility
- Easy to understand
- Easy to test

### 3. Factory Pattern

Create column renderers based on type.

```javascript
// utils/column-renderers/index.jsx
export const createColumnRenderer = (type, config) => {
  switch (type) {
    case 'boolean': return new BooleanRenderer(config);
    case 'date': return new DateRenderer(config);
    default: return new DefaultRenderer(config);
  }
};
```

### 4. Observer Pattern

Event handling through callbacks.

```javascript
<DxpTable
  onRowClick={(record) => handleRowClick(record)}
  onSort={(column, order) => handleSort(column, order)}
  onPaginationChange={(page, pageSize) => handlePagination(page, pageSize)}
/>
```

### 5. Strategy Pattern

Different sorting strategies (server/client/disabled).

```javascript
const sortingStrategies = {
  server: ServerSideSorting,
  client: ClientSideSorting,
  disabled: NoSorting,
};

const strategy = sortingStrategies[config.sorting.mode];
strategy.sort(data, column, order);
```

## Component Architecture

### Presentational vs Container Components

**Presentational Components** (Stateless):
- Focus on how things look
- Receive data via props
- No business logic

```javascript
// features/preview/components/api-test-panel.jsx
const ApiTestPanel = ({ testing, testResult, onTest }) => (
  <Space>
    <Button loading={testing} onClick={onTest}>
      Test API
    </Button>
    {testResult && <Alert message={testResult.message} />}
  </Space>
);
```

**Container Components** (Stateful):
- Focus on how things work
- Use hooks for state management
- Orchestrate child components

```javascript
// components/configuration-form/preview-section.jsx
const PreviewSection = (props) => {
  const apiTest = useApiTest();
  const mapping = useResponseMapping();

  return (
    <Space>
      <ApiTestPanel {...apiTest} />
      <ResponseMapperPanel {...mapping} />
    </Space>
  );
};
```

## State Management

### Local State (useState)
- Component-specific state
- Short-lived data
- UI state (loading, errors)

### Custom Hooks (Shared State)
- Business logic state
- Configuration state
- Reusable across components

```javascript
// Centralized configuration state
const configState = useConfigurationState();

// Used in multiple components
<ApiConfigSection onChange={configState.updateApiConfig} />
<ColumnsConfigSection onChange={configState.updateColumns} />
```

### localStorage (Persistence)
- Configuration persistence
- Automatic save
- Load on mount

## Data Flow

### Configuration Flow

```
User Input → Component → Hook → Validator → State → localStorage
                                   ↓
                              Validation Errors
                                   ↓
                              User Feedback
```

### API Test Flow

```
User Click → ApiTestPanel → useApiTest → validateUrl
                                ↓
                          testConnection (service)
                                ↓
                          Response Data
                                ↓
                      parseResponseStructure
                                ↓
                        Column Suggestions
```

### Column Management Flow

```
Add Column → ColumnList → useColumnManager → createNewColumn
                              ↓
                       validateColumn
                              ↓
                      Update State
                              ↓
                     Auto-save Config
```

## File Naming Conventions

- **Components**: `kebab-case.jsx` (e.g., `api-test-panel.jsx`)
- **Hooks**: `use-kebab-case.js` (e.g., `use-api-test.js`)
- **Services**: `kebab-case.js` (e.g., `config-storage.js`)
- **Types**: `kebab-case.types.js` (e.g., `configuration.types.js`)
- **Validators**: `kebab-case-validator.js` (e.g., `column-validator.js`)

## Benefits of This Architecture

### 1. Maintainability
- Clear separation of concerns
- Easy to locate code
- Consistent patterns

### 2. Scalability
- Easy to add new features
- Features are isolated
- Core layer grows slowly

### 3. Testability
- Unit test core layer independently
- Mock services easily
- Test components in isolation

### 4. Reusability
- Hooks can be shared
- Validators are pure functions
- Components are modular

### 5. Team Collaboration
- Clear ownership boundaries
- Parallel development possible
- Less merge conflicts

## Future Architecture Improvements

1. **Add TypeScript** for better type safety
2. **Implement Context API** for deeply nested props
3. **Add Error Boundaries** for better error handling
4. **Implement React Query** for server state management
5. **Add Storybook** for component documentation

## References

- [Clean Architecture (Robert C. Martin)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Clean Code (Robert C. Martin)](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Thinking in React](https://reactjs.org/docs/thinking-in-react.html)
