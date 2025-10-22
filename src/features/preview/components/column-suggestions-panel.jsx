/**
 * Column Suggestions Panel Component
 *
 * Displays response structure and column suggestions.
 * Extracted from preview-section.jsx.
 */

import { Card, Space, Alert, Button, Collapse, Tag, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

const ColumnSuggestionsPanel = ({ parsedStructure, onApplySuggestions, fullResponse }) => {
  if (!parsedStructure || !parsedStructure.isValid) {
    return null;
  }

  return (
    <Card title="Estrutura da Resposta" size="small">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Alert
          message={`Encontrados ${parsedStructure.fields.length} campos na resposta da API`}
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
        />

        <Collapse
          items={[
            {
              key: 'fields',
              label: 'Campos Disponíveis',
              children: (
                <Space direction="vertical" style={{ width: '100%' }}>
                  {parsedStructure.fields.map((field) => (
                    <Card key={field.name} size="small" type="inner">
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Space>
                          <Text strong>{field.name}</Text>
                          <Tag color="blue">{field.type}</Tag>
                          {field.suggestAsColumn && (
                            <Tag color="green">Recomendado para coluna</Tag>
                          )}
                        </Space>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {JSON.stringify(field.sampleValue)}
                        </Text>
                      </Space>
                    </Card>
                  ))}
                </Space>
              ),
            },
            {
              key: 'json',
              label: 'Item retornado (JSON)',
              children: (
                <pre
                  style={{
                    background: '#f5f5f5',
                    padding: '12px',
                    borderRadius: '4px',
                    overflow: 'auto',
                    maxHeight: '300px',
                  }}
                >
                  {JSON.stringify(parsedStructure.sampleData, null, 2)}
                </pre>
              ),
            },
            fullResponse && {
              key: 'fullResponse',
              label: 'Resposta Completa',
              children: (
                <pre
                  style={{
                    background: '#f5f5f5',
                    padding: '12px',
                    borderRadius: '4px',
                    overflow: 'auto',
                    maxHeight: '300px',
                  }}
                >
                  {JSON.stringify(fullResponse, null, 2)}
                </pre>
              ),
            },
          ].filter(Boolean)}
        />

        {parsedStructure.suggestedColumns && parsedStructure.suggestedColumns.length > 0 && (
          <>
            <Alert
              message="Sugestões de Colunas encontradas"
              description={`Identificamos ${parsedStructure.suggestedColumns.length} campos que podem ser usados como colunas da tabela. Clique abaixo para aplicá-los automaticamente.`}
              type="info"              
            />

            <Button type="primary" onClick={onApplySuggestions} block>
              Aplicar Colunas Sugeridas ({parsedStructure.suggestedColumns.length})
            </Button>

            <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: 8 }}>
              Isso substituirá sua configuração de coluna atual por colunas sugeridas com base
              na resposta da API.
            </Paragraph>
          </>
        )}
      </Space>
    </Card>
  );
};

export default ColumnSuggestionsPanel;
