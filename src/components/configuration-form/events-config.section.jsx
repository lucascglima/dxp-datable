/**
 * Events Configuration Section (Refactored)
 *
 * Orchestrates row click and sorting configuration.
 * Reduced from 366 lines to ~70 lines using composition.
 */

import { useMemo, useCallback } from 'react';
import { Space, Alert } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import RowClickEventSection from '../../features/events/components/row-click-event-section';
import SortingConfigSection from '../../features/events/components/sorting-config-section';
import { ErrorBoundary } from '../error-boundary';

const EventsConfigSection = ({ value = {}, onChange }) => {
  /**
   * Default events configuration
   * Memoized to prevent unnecessary object recreation
   */
  const defaultEvents = useMemo(() => ({
    onRowClick: {
      enabled: false,
      code: "console.log('Row clicked:', record);",
    },
    sorting: {
      mode: 'server',
      serverConfig: {
        columnParam: '_columnSort',
        orderParam: '_sort',
        orderFormat: 'numeric',
        orderValues: {
          ascend: '1',
          descend: '-1',
        },
      },
    },
  }), []);

  const currentEvents = value || defaultEvents;

  /**
   * Handles row click event change
   * Memoized to prevent unnecessary re-renders
   */
  const handleRowClickChange = useCallback((onRowClick) => {
    onChange({
      ...currentEvents,
      onRowClick,
    });
  }, [currentEvents, onChange]);

  /**
   * Handles sorting configuration change
   * Memoized to prevent unnecessary re-renders
   */
  const handleSortingChange = useCallback((sorting) => {
    onChange({
      ...currentEvents,
      sorting,
    });
  }, [currentEvents, onChange]);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="Configuração de Eventos"
        description="Configure manipuladores de eventos personalizados para sua tabela. Use JavaScript para definir o que acontece quando os usuários interagem com seus dados."
        type="info"
      />

      <ErrorBoundary>
        <RowClickEventSection value={currentEvents.onRowClick} onChange={handleRowClickChange} />
      </ErrorBoundary>

      <ErrorBoundary>
        <SortingConfigSection value={currentEvents.sorting} onChange={handleSortingChange} />
      </ErrorBoundary>
    </Space>
  );
};

export default EventsConfigSection;
