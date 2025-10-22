# Contributing Guide

Welcome to the DxpTable Component project! This guide will help you contribute to the project following our Clean Architecture and Clean Code principles.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Architecture](#project-architecture)
- [Development Workflow](#development-workflow)
- [Adding New Features](#adding-new-features)
- [Code Conventions](#code-conventions)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)

---

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn
- Git

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd datatable-simple

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## Project Architecture

This project follows **Clean Architecture** with three main layers:

```
Core Layer (Business Logic)
  ↑
Features Layer (Use Cases)
  ↑
Components Layer (UI)
```

**Dependency Rule**: Outer layers depend on inner layers, never the reverse.

For detailed architecture information, see [ARCHITECTURE.md](ARCHITECTURE.md).

---

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/feature-name` - New features
- `fix/bug-name` - Bug fixes
- `refactor/description` - Code refactoring

### Making Changes

1. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our code conventions

3. **Test your changes**:
   ```bash
   npm run build
   npm run dev
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```

---

## Adding New Features

### 1. Adding a New Feature Module

Follow these steps to add a new feature following Clean Architecture:

#### Step 1: Create Feature Structure

```bash
src/features/your-feature/
  ├── components/
  │   ├── feature-component.jsx
  │   └── index.js
  ├── hooks/
  │   └── use-your-feature.js
  └── index.js
```

#### Step 2: Create Components

**Example: Adding a Filter Feature**

```javascript
// src/features/filters/components/filter-panel.jsx
import React from 'react';
import { Card, Select, Button } from 'antd';

/**
 * FilterPanel - Displays filter controls
 * @param {Object} props
 * @param {Array} props.filters - Available filters
 * @param {Function} props.onApply - Apply callback
 */
const FilterPanel = ({ filters, onApply }) => {
  return (
    <Card title="Filters">
      {/* Filter controls */}
      <Button onClick={onApply}>Apply Filters</Button>
    </Card>
  );
};

export default FilterPanel;
```

#### Step 3: Create Custom Hook

```javascript
// src/features/filters/hooks/use-filters.js
import { useState } from 'react';

/**
 * Custom hook for filter management
 * @returns {Object} Filter state and handlers
 */
export const useFilters = () => {
  const [filters, setFilters] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});

  const addFilter = (filter) => {
    setFilters(prev => [...prev, filter]);
  };

  const removeFilter = (filterId) => {
    setFilters(prev => prev.filter(f => f.id !== filterId));
  };

  const applyFilters = () => {
    // Apply logic
  };

  return {
    filters,
    activeFilters,
    addFilter,
    removeFilter,
    applyFilters,
  };
};
```

#### Step 4: Add Barrel Exports

```javascript
// src/features/filters/index.js
export { default as FilterPanel } from './components/filter-panel';
export { useFilters } from './hooks/use-filters';
```

### 2. Adding a New Core Hook

Core hooks contain business logic independent of features.

```javascript
// src/core/hooks/use-data-fetcher.js
import { useState, useEffect } from 'react';

/**
 * Generic data fetching hook
 * @param {string} url - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Object} Data, loading, error state
 */
export const useDataFetcher = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(url, options);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchData();
    }
  }, [url]);

  return { data, loading, error };
};
```

### 3. Adding a New Validator

Validators should be pure functions in the core layer.

```javascript
// src/core/validators/filter-validator.js

/**
 * Validates a filter configuration
 * @param {Object} filter - Filter to validate
 * @returns {Array<string>} Array of error messages
 */
export const validateFilter = (filter) => {
  const errors = [];

  if (!filter.field) {
    errors.push('Filter field is required');
  }

  if (!filter.operator) {
    errors.push('Filter operator is required');
  }

  if (filter.value === undefined || filter.value === null) {
    errors.push('Filter value is required');
  }

  return errors;
};

/**
 * Validates an array of filters
 * @param {Array} filters - Filters to validate
 * @returns {Object} Validation result
 */
export const validateFilters = (filters) => {
  const errors = [];

  if (!Array.isArray(filters)) {
    return { valid: false, errors: ['Filters must be an array'] };
  }

  filters.forEach((filter, index) => {
    const filterErrors = validateFilter(filter);
    if (filterErrors.length > 0) {
      errors.push(`Filter ${index + 1}: ${filterErrors.join(', ')}`);
    }
  });

  // Check for duplicate fields
  const fields = filters.map(f => f.field);
  const duplicates = fields.filter((field, index) => fields.indexOf(field) !== index);

  if (duplicates.length > 0) {
    errors.push(`Duplicate filter fields: ${duplicates.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
};
```

### 4. Adding a New Component

#### Presentational Component (Stateless)

```javascript
// src/components/shared/status-badge.jsx
import React from 'react';
import { Badge } from 'antd';

/**
 * StatusBadge - Displays a status indicator
 * @param {Object} props
 * @param {string} props.status - Status value (active, inactive, pending)
 * @param {string} props.text - Display text
 */
const StatusBadge = ({ status, text }) => {
  const statusColors = {
    active: 'green',
    inactive: 'red',
    pending: 'orange',
  };

  return (
    <Badge
      status={statusColors[status] || 'default'}
      text={text || status}
    />
  );
};

export default StatusBadge;
```

#### Container Component (Stateful)

```javascript
// src/features/status/components/status-manager.jsx
import React from 'react';
import { Space, Button } from 'antd';
import { useStatusManager } from '../hooks/use-status-manager';
import StatusBadge from '../../../components/shared/status-badge';

/**
 * StatusManager - Manages item status
 */
const StatusManager = ({ itemId }) => {
  const {
    status,
    updateStatus,
    loading
  } = useStatusManager(itemId);

  return (
    <Space>
      <StatusBadge status={status} />
      <Button
        loading={loading}
        onClick={() => updateStatus('active')}
      >
        Activate
      </Button>
    </Space>
  );
};

export default StatusManager;
```

---

## Code Conventions

### File Naming

- **Components**: `kebab-case.jsx` (e.g., `api-test-panel.jsx`)
- **Hooks**: `use-kebab-case.js` (e.g., `use-configuration-state.js`)
- **Validators**: `kebab-case-validator.js` (e.g., `column-validator.js`)
- **Services**: `kebab-case.js` (e.g., `config-storage.js`)
- **Types**: `kebab-case.types.js` (e.g., `configuration.types.js`)

### JavaScript/JSX

#### Variable Naming

```javascript
// ✅ Good
const apiEndpoint = 'https://api.example.com';
const userColumns = [];
const isLoading = false;

// ❌ Bad
const api_endpoint = 'https://api.example.com';
const UserColumns = [];
const loading = false; // Not descriptive
```

#### Function Naming

```javascript
// ✅ Good - Verb-based, descriptive
const handleSubmit = () => {};
const validateConfiguration = () => {};
const fetchUserData = () => {};

// ❌ Bad
const submit = () => {};
const config = () => {};
const data = () => {};
```

#### Component Props

```javascript
// ✅ Good - Destructured props with defaults
const MyComponent = ({
  title = 'Default Title',
  onSubmit,
  loading = false
}) => {
  // Component logic
};

// ❌ Bad - Using props object
const MyComponent = (props) => {
  return <div>{props.title}</div>;
};
```

#### Hook Returns

```javascript
// ✅ Good - Return object with named properties
export const useMyHook = () => {
  return {
    data,
    loading,
    error,
    refetch,
  };
};

// ❌ Bad - Return array (hard to extend)
export const useMyHook = () => {
  return [data, loading, error];
};
```

### Code Organization

#### Import Order

```javascript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Third-party libraries
import { Card, Button, Space } from 'antd';
import axios from 'axios';

// 3. Core imports
import { validateConfiguration } from '../../core/validators/config-validator';
import { useConfigurationState } from '../../core/hooks/use-configuration-state';

// 4. Feature imports
import { useApiTest } from '../../features/preview/hooks/use-api-test';

// 5. Components
import { QueryParamsEditor } from '../shared';

// 6. Styles
import './preview-section.scss';
```

#### Component Structure

```javascript
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Component documentation
 */
const MyComponent = ({ prop1, prop2, onAction }) => {
  // 1. Hooks
  const [state, setState] = useState(null);

  // 2. Effects
  useEffect(() => {
    // Effect logic
  }, []);

  // 3. Event handlers
  const handleClick = () => {
    // Handler logic
  };

  // 4. Render helpers
  const renderContent = () => {
    // Render logic
  };

  // 5. Main render
  return (
    <div>
      {renderContent()}
    </div>
  );
};

// PropTypes
MyComponent.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
  onAction: PropTypes.func,
};

// Default props
MyComponent.defaultProps = {
  prop2: 0,
  onAction: () => {},
};

export default MyComponent;
```

### Comments and Documentation

```javascript
/**
 * Multi-line JSDoc comment for functions/components
 * @param {string} param1 - Description
 * @param {Object} param2 - Description
 * @returns {boolean} Description
 */
export const myFunction = (param1, param2) => {
  // Single-line comment for implementation details
  const result = doSomething();

  return result;
};
```

### Clean Code Principles

#### 1. Single Responsibility

```javascript
// ✅ Good - Each function does one thing
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8;
};

// ❌ Bad - Function does too much
const validateUser = (user) => {
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email);
  const isPasswordValid = user.password.length >= 8;
  const isNameValid = user.name.length > 0;
  return isEmailValid && isPasswordValid && isNameValid;
};
```

#### 2. Meaningful Names

```javascript
// ✅ Good
const activeUserCount = users.filter(u => u.active).length;
const fetchUsersByRole = (role) => {};

// ❌ Bad
const n = users.filter(u => u.active).length;
const fetch = (r) => {};
```

#### 3. Small Functions

```javascript
// ✅ Good - Small, focused functions
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

const applyDiscount = (total, discountPercent) => {
  return total * (1 - discountPercent / 100);
};

const calculateFinalPrice = (items, discountPercent) => {
  const total = calculateTotal(items);
  return applyDiscount(total, discountPercent);
};
```

#### 4. DRY (Don't Repeat Yourself)

```javascript
// ✅ Good - Extracted common logic
const createColumn = (title, dataIndex, options = {}) => ({
  key: `${dataIndex}-${Date.now()}`,
  title,
  dataIndex,
  ...options
});

const nameColumn = createColumn('Name', 'name', { sortable: true });
const emailColumn = createColumn('Email', 'email');

// ❌ Bad - Repeated logic
const nameColumn = {
  key: `name-${Date.now()}`,
  title: 'Name',
  dataIndex: 'name',
  sortable: true
};

const emailColumn = {
  key: `email-${Date.now()}`,
  title: 'Email',
  dataIndex: 'email'
};
```

---

## Testing

### Unit Testing Validators

```javascript
// tests/validators/column-validator.test.js
import { validateColumn, validateColumns } from '../../src/core/validators/column-validator';

describe('validateColumn', () => {
  it('should return no errors for valid column', () => {
    const column = {
      title: 'Name',
      dataIndex: 'name',
      width: 150
    };

    const errors = validateColumn(column, 0);
    expect(errors).toHaveLength(0);
  });

  it('should return error when title is missing', () => {
    const column = {
      dataIndex: 'name'
    };

    const errors = validateColumn(column, 0);
    expect(errors).toContain('Column 1: Title is required');
  });
});
```

### Unit Testing Hooks

```javascript
// tests/hooks/use-column-manager.test.js
import { renderHook, act } from '@testing-library/react';
import { useColumnManager } from '../../src/core/hooks/use-column-manager';

describe('useColumnManager', () => {
  it('should add a column', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() => useColumnManager([], onChange));

    act(() => {
      result.current.addColumn();
    });

    expect(result.current.columns).toHaveLength(1);
    expect(onChange).toHaveBeenCalled();
  });

  it('should remove a column', () => {
    const initialColumns = [
      { key: '1', title: 'Col 1', dataIndex: 'col1' }
    ];
    const onChange = jest.fn();
    const { result } = renderHook(() => useColumnManager(initialColumns, onChange));

    act(() => {
      result.current.removeColumn(0);
    });

    expect(result.current.columns).toHaveLength(0);
  });
});
```

### Component Testing

```javascript
// tests/components/api-test-panel.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ApiTestPanel from '../../src/features/preview/components/api-test-panel';

describe('ApiTestPanel', () => {
  it('should render test button', () => {
    render(
      <ApiTestPanel
        apiEndpoint="https://api.example.com"
        testing={false}
        testResult={null}
        onTest={jest.fn()}
      />
    );

    expect(screen.getByText('Testar Conexão')).toBeInTheDocument();
  });

  it('should call onTest when button clicked', () => {
    const onTest = jest.fn();
    render(
      <ApiTestPanel
        apiEndpoint="https://api.example.com"
        testing={false}
        testResult={null}
        onTest={onTest}
      />
    );

    fireEvent.click(screen.getByText('Testar Conexão'));
    expect(onTest).toHaveBeenCalled();
  });
});
```

---

## Pull Request Process

### Before Submitting

1. ✅ Run build: `npm run build`
2. ✅ Test locally: `npm run dev`
3. ✅ Follow code conventions
4. ✅ Update documentation if needed
5. ✅ Write meaningful commit messages

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**:
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `docs:` - Documentation changes
- `test:` - Adding tests
- `chore:` - Maintenance tasks

**Examples**:
```
feat(columns): add JSON import/export functionality

fix(api-test): handle timeout errors correctly

refactor(preview): extract API test logic to custom hook

docs(readme): update architecture documentation
```

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Refactoring
- [ ] Documentation update

## Changes Made
- List of changes
- Another change

## Testing
- How was this tested?
- What scenarios were covered?

## Checklist
- [ ] Code follows project conventions
- [ ] Build passes (`npm run build`)
- [ ] Self-review completed
- [ ] Documentation updated (if needed)
```

---

## Common Tasks

### Adding a New Column Renderer

1. Create renderer file:
```javascript
// src/utils/column-renderers/image-renderer.jsx
export const ImageRenderer = (config) => {
  return (value, record) => {
    return <img src={value} alt={config.alt || 'Image'} />;
  };
};
```

2. Register in index:
```javascript
// src/utils/column-renderers/index.jsx
export { ImageRenderer } from './image-renderer';
```

3. Add to renderer config:
```javascript
// Update relevant configuration
const rendererTypes = [
  // ...
  { value: 'image', label: 'Image' }
];
```

### Adding a New Configuration Step

1. Update wizard hook:
```javascript
// src/features/configuration/hooks/use-configuration-wizard.jsx
const stepDefinitions = [
  // ... existing steps
  {
    key: 'newStep',
    title: 'New Step',
    icon: <YourIcon />
  },
];
```

2. Create step component:
```javascript
// src/components/configuration-form/new-step-section.jsx
const NewStepSection = ({ value, onChange }) => {
  // Step implementation
};
```

3. Add to configuration page:
```javascript
// src/pages/configuration-page.jsx
{currentStep === 5 && (
  <NewStepSection
    value={config.newStep}
    onChange={handleNewStepChange}
  />
)}
```

---

## Resources

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [React Documentation](https://reactjs.org/)
- [Ant Design](https://ant.design/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

## Getting Help

- Check [ARCHITECTURE.md](ARCHITECTURE.md) for architecture questions
- Check [HOOKS.md](HOOKS.md) for custom hooks documentation
- Check [COMPONENTS.md](COMPONENTS.md) for component documentation
- Check [VALIDATORS.md](VALIDATORS.md) for validation patterns
- Open an issue for bugs or feature requests

---

## License

[Your License Here]
