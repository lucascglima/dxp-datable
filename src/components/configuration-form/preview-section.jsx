/**
 * Preview Section (Refactored)
 *
 * Orchestrates API testing, response mapping, and column suggestions.
 * Reduced from 645 lines to ~180 lines using composition.
 */

import { useState, useCallback, useEffect  } from 'react';
import { Space, Alert } from 'antd';
import { ApiOutlined } from '@ant-design/icons';
import { parseResponseStructure } from '../../services/external-api';
import { QueryParamsEditor } from '../shared';
import ApiTestPanel from '../../features/preview/components/api-test-panel';
import ResponseMapperPanel from '../../features/preview/components/response-mapper-panel';
import ColumnSuggestionsPanel from '../../features/preview/components/column-suggestions-panel';
import { useApiTest } from '../../features/preview/hooks/use-api-test';
import { useResponseMapping } from '../../features/preview/hooks/use-response-mapping';
import { ErrorBoundary } from '../error-boundary';

const PreviewSection = ({
  apiEndpoint,
  authToken,
  onSuggestColumns,
  onResponseMappingChange,
  testQueryParams = [],
  onTestQueryParamsChange,
  defaultQueryParams = [],
  urlParams = [],
  responseDataPath = null,
}) => {
  const [parsedStructure, setParsedStructure] = useState(null);

  // Query parameters for testing - load from saved config or use defaults
  const [queryParams, setQueryParams] = useState(() => {
    // If we have saved testQueryParams, use them
    if (testQueryParams && testQueryParams.length > 0) {
      return testQueryParams;
    }
    // Otherwise use sensible defaults
    return [
      { key: 'page', value: '1' },
      { key: 'pageSize', value: '20' },
    ];
  });

  // Use custom hooks
  const apiTest = useApiTest();
  const mapping = useResponseMapping(responseDataPath, onResponseMappingChange);

  /**
   * Sync local state with props when testQueryParams changes from parent
   */
  useEffect(() => {
    if (testQueryParams && testQueryParams.length > 0) {
      setQueryParams(testQueryParams);
    }
  }, [testQueryParams]);

  /**
   * Handles query params change from editor
   * Memoized to prevent unnecessary re-renders
   */
  const handleQueryParamsChange = useCallback((newParams) => {
    setQueryParams(newParams);
    if (onTestQueryParamsChange) {
      onTestQueryParamsChange(newParams);
    }
  }, [onTestQueryParamsChange]);

  /**
   * Gets nested value from object using dot notation
   * Memoized to prevent unnecessary function recreation
   */
  const getNestedValue = useCallback((obj, path) => {
    if (!path) return obj;
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }, []);

  /**
   * Handles API test
   * Memoized to prevent unnecessary re-renders
   */
  const handleTestConnection = useCallback(async () => {
    setParsedStructure(null);
    mapping.clearValidation();

    const result = await apiTest.runTest({
      apiEndpoint,
      authToken,
      urlParams,
      queryParams,
      defaultQueryParams,
      mappingConfig: mapping.getMappingConfig(),
    });

    if (result.success) {
      // Validate mapping if enabled
      if (mapping.enableMapping && result.fullResponse) {
        const validation = mapping.validateAgainstResponse(result.fullResponse);

        // Parse structure with mapping for column suggestions
        if (validation?.itemsFound) {
          const items = getNestedValue(result.fullResponse, mapping.dataPath);
          if (items && Array.isArray(items) && items.length > 0) {
            const structure = parseResponseStructure(items[0], '');
            setParsedStructure(structure);
          }
        }
      } else {
        // Parse structure without mapping
        if (result.sampleData) {
          const structure = parseResponseStructure(result.sampleData, '');
          setParsedStructure(structure);
        }
      }
    }
  }, [apiEndpoint, authToken, urlParams, queryParams, defaultQueryParams, mapping, apiTest, getNestedValue]);

  /**
   * Applies suggested columns
   * Memoized to prevent unnecessary re-renders
   */
  const handleApplySuggestions = useCallback(() => {
    if (parsedStructure?.suggestedColumns) {
      onSuggestColumns(parsedStructure.suggestedColumns);
    }
  }, [parsedStructure, onSuggestColumns]);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="Testar e Pré-visualizar"
        description="Configure parâmetros de teste, defina o mapeamento de resposta, se necessário, e pré-visualize a estrutura de dados da sua API."
        type='info'
        
        icon={<ApiOutlined />}
      />

      {/* Query Parameters Editor */}
      <ErrorBoundary>
        <QueryParamsEditor value={queryParams} onChange={handleQueryParamsChange} />
      </ErrorBoundary>

      {/* Response Mapping Panel */}
      <ErrorBoundary>
        <ResponseMapperPanel
          enableMapping={mapping.enableMapping}
          dataPath={mapping.dataPath}
          totalPath={mapping.totalPath}
          mappingValidation={mapping.mappingValidation}
          onToggleMapping={mapping.toggleMapping}
          onDataPathChange={mapping.updateDataPath}
          onTotalPathChange={mapping.updateTotalPath}
        />
      </ErrorBoundary>

      {/* API Test Panel */}
      <ErrorBoundary>
        <ApiTestPanel
          apiEndpoint={apiEndpoint}
          testing={apiTest.testing}
          testResult={apiTest.testResult}
          onTest={handleTestConnection}
        />
      </ErrorBoundary>

      {/* Column Suggestions Panel */}
      <ErrorBoundary>
        <ColumnSuggestionsPanel
          parsedStructure={parsedStructure}
          onApplySuggestions={handleApplySuggestions}
          fullResponse={apiTest.testResult?.fullResponse}
        />
      </ErrorBoundary>
    </Space>
  );
};

export default PreviewSection;
