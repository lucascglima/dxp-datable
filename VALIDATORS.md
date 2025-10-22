# Validators Documentation

Documentation for validation utilities used to ensure data integrity and enforce business rules.

## Table of Contents

- [Configuration Validator](#configuration-validator)
- [Column Validator](#column-validator)
- [Mapping Validator](#mapping-validator)
- [Validation Patterns](#validation-patterns)

---

## Configuration Validator

**Location**: `src/core/validators/config-validator.js`

### validateConfiguration

Validates the complete configuration object.

**Signature**:

```javascript
validateConfiguration(config: Object): {
  valid: boolean,
  errors: string[]
}
```

**Validates**:

- API endpoint presence and format
- Columns configuration
- Pagination settings
- Events configuration

**Example**:

```javascript
import { validateConfiguration } from '../core/validators/config-validator';

const config = {
  apiEndpoint: 'https://api.example.com/users',
  columns: [...],
  pagination: { pageSize: 20 },
  events: {...}
};

const result = validateConfiguration(config);
if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```

### validateUrlParams

Validates URL parameters array.

**Signature**:

```javascript
validateUrlParams(urlParams: Array): {
  valid: boolean,
  errors: string[]
}
```

**Example**:

```javascript
const urlParams = [
  { name: 'userId', value: '123' },
  { name: 'version', value: 'v1' },
];

const result = validateUrlParams(urlParams);
```

### validateQueryParams

Validates query parameters array for duplicates and required fields.

**Signature**:

```javascript
validateQueryParams(queryParams: Array): {
  valid: boolean,
  errors: string[]
}
```

---

## Column Validator

**Location**: `src/core/validators/column-validator.js`

### validateColumn

Validates a single column configuration.

**Signature**:

```javascript
validateColumn(column: Object, index: number): string[]
```

**Validates**:

- Title is required
- DataIndex is required
- Width is within valid range (50-1000px)
- Render configuration is valid

**Example**:

```javascript
import { validateColumn } from '../core/validators/column-validator';

const column = {
  title: 'User Name',
  dataIndex: 'name',
  width: 150,
  sortable: true,
  render: { type: 'default', config: {} },
};

const errors = validateColumn(column, 0);
if (errors.length > 0) {
  console.error('Column errors:', errors);
}
```

### validateColumns

Validates an array of columns, including duplicate checks.

**Signature**:

```javascript
validateColumns(columns: Array): {
  valid: boolean,
  errors: string[]
}
```

**Example**:

```javascript
const columns = [
  { title: 'ID', dataIndex: 'id' },
  { title: 'Name', dataIndex: 'name' },
  { title: 'Email', dataIndex: 'email' },
];

const result = validateColumns(columns);
```

### validateColumnsJson

Validates JSON string for column import.

**Signature**:

```javascript
validateColumnsJson(jsonText: string): {
  valid: boolean,
  errors: string[],
  data: Array|null
}
```

**Example**:

```javascript
const jsonText = '[{"title":"Name","dataIndex":"name"}]';
const result = validateColumnsJson(jsonText);

if (result.valid) {
  console.log('Parsed columns:', result.data);
}
```

---

## Mapping Validator

**Location**: `src/core/validators/mapping-validator.js`

### validateMapping

Validates response mapping paths against actual response data.

**Signature**:

```javascript
validateMapping(
  responseData: Object,
  itemsPath: string,
  totalPath: string
): {
  itemsFound: boolean,
  itemsCount: number,
  itemsIsArray: boolean,
  totalFound: boolean,
  totalValue: number|null,
  errors: string[],
  warnings: string[]
}
```

**Example**:

```javascript
import { validateMapping } from '../core/validators/mapping-validator';

const response = {
  data: {
    items: [{ id: 1 }, { id: 2 }],
    pagination: { total: 100 },
  },
};

const result = validateMapping(response, 'data.items', 'data.pagination.total');

if (result.itemsFound) {
  console.log(`Found ${result.itemsCount} items`);
}
if (result.totalFound) {
  console.log(`Total: ${result.totalValue}`);
}
```

### validateMappingConfig

Validates mapping configuration before API test.

**Signature**:

```javascript
validateMappingConfig(mappingConfig: Object|null): {
  valid: boolean,
  errors: string[]
}
```

**Example**:

```javascript
const mappingConfig = {
  dataKey: 'data.items',
  totalKey: 'data.total',
  totalSource: 'body',
};

const result = validateMappingConfig(mappingConfig);
```

### extractItemsFromResponse

Utility function to extract items array from response using mapping.

**Signature**:

```javascript
extractItemsFromResponse(
  responseData: Object,
  mappingConfig: Object|null
): Array|null
```

### extractTotalFromResponse

Utility function to extract total count from response using mapping.

**Signature**:

```javascript
extractTotalFromResponse(
  responseData: Object,
  mappingConfig: Object|null,
  fallbackCount: number
): number
```

---

## Validation Patterns

### 1. Early Return Pattern

Validate early and return error messages immediately:

```javascript
export const validateColumn = (column) => {
  const errors = [];

  if (!column.title) {
    errors.push('Title is required');
  }

  if (!column.dataIndex) {
    errors.push('DataIndex is required');
  }

  return errors;
};
```

### 2. Accumulate Errors Pattern

Collect all errors before returning:

```javascript
export const validateColumns = (columns) => {
  const errors = [];

  columns.forEach((col, index) => {
    const colErrors = validateColumn(col, index);
    errors.push(...colErrors);
  });

  // Additional validations
  const duplicates = checkDuplicates(columns);
  if (duplicates.length > 0) {
    errors.push(`Duplicates found: ${duplicates.join(', ')}`);
  }

  return { valid: errors.length === 0, errors };
};
```

### 3. Structured Result Pattern

Return structured validation results:

```javascript
return {
  valid: boolean,      // Overall validation status
  errors: string[],    // Error messages
  warnings: string[],  // Warning messages
  data: Object|null,   // Validated/parsed data
};
```

### 4. Context-Aware Validation

Validators accept context for better error messages:

```javascript
export const validateColumn = (column, index = 0) => {
  const errors = [];
  const columnLabel = `Column ${index + 1}`;

  if (!column.title) {
    errors.push(`${columnLabel}: Title is required`);
  }

  return errors;
};
```

---

## Validator Best Practices

### 1. Pure Functions

Validators should be pure functions with no side effects:

```javascript
// ✅ Good - Pure function
export const validateColumn = (column) => {
  // Returns errors without modifying input
  return errors;
};

// ❌ Bad - Modifies input
export const validateColumn = (column) => {
  column.validated = true; // Side effect!
  return errors;
};
```

### 2. Consistent Return Types

Always return the same structure:

```javascript
// ✅ Good - Consistent
export const validateConfig = (config) => {
  return { valid: boolean, errors: [] };
};

// ❌ Bad - Inconsistent
export const validateConfig = (config) => {
  if (hasErrors) return false;
  return { valid: true };
};
```

### 3. Descriptive Error Messages

Provide clear, actionable error messages:

```javascript
// ✅ Good
errors.push('Column 3: Title is required');

// ❌ Bad
errors.push('Invalid');
```

### 4. Composable Validators

Build complex validators from simple ones:

```javascript
const validateTitle = (title) => {...};
const validateDataIndex = (dataIndex) => {...};

export const validateColumn = (column) => {
  return [
    ...validateTitle(column.title),
    ...validateDataIndex(column.dataIndex),
  ];
};
```

---

## Testing Validators

### Unit Testing Example

```javascript
import { validateColumn } from '../column-validator';

describe('validateColumn', () => {
  it('should return error when title is missing', () => {
    const column = { dataIndex: 'name' };
    const errors = validateColumn(column, 0);

    expect(errors).toContain('Column 1: Title is required');
  });

  it('should return no errors for valid column', () => {
    const column = {
      title: 'Name',
      dataIndex: 'name',
    };
    const errors = validateColumn(column, 0);

    expect(errors).toHaveLength(0);
  });
});
```

---

## Related Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture overview
- [HOOKS.md](HOOKS.md) - Custom hooks that use validators
- [CONTRIBUTING.md](CONTRIBUTING.md) - How to add new validators
