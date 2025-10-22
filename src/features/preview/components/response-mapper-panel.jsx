/**
 * Response Mapper Panel Component
 *
 * Handles response mapping configuration and validation display.
 * Extracted from preview-section.jsx.
 */

import { Card, Space, Checkbox, Input, Alert, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ResponseMapperPanel = ({
  enableMapping,
  dataPath,
  totalPath,
  mappingValidation,
  onToggleMapping,
  onDataPathChange,
  onTotalPathChange,
}) => {
  return (
    <Card title="Mapeamento de Resposta" size="small">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Checkbox checked={enableMapping} onChange={(e) => onToggleMapping(e.target.checked)}>
          Habilitar Mapeamento de Resposta Personalizado
        </Checkbox>

        {!enableMapping && (
          <Alert
            message="A resposta da API será tratada como um array direto de itens"
            type="info"
            showIcon
          />
        )}

        {enableMapping && (
          <>
            <div>
              <Text strong>Caminho da Lista de Itens (obrigatório)</Text>
              <Input
                placeholder='Caminho em notação dot, ex.: "data.items", "results"'
                value={dataPath}
                onChange={(e) => onDataPathChange(e.target.value)}
                style={{ marginTop: 4 }}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Caminho em notação dot para o array de itens
              </Text>
            </div>

            <div>
              <Text strong>Caminho da Contagem Total (opcional)</Text>
              <Input
                placeholder='ex.: "data.pagination.total", "total", deixe em branco se não estiver disponível'
                value={totalPath}
                onChange={(e) => onTotalPathChange(e.target.value)}
                style={{ marginTop: 4 }}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Deixe em branco se a API não retornar a contagem total
              </Text>
            </div>

            {mappingValidation && (
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                {mappingValidation.itemsFound && (
                  <Alert
                    message={`Encontrados ${mappingValidation.itemsCount} itens em "${dataPath}"`}
                    type="success"
                    showIcon
                    icon={<CheckCircleOutlined />}
                  />
                )}

                {mappingValidation.totalFound && (
                  <Alert
                    message={`Total encontrado: ${mappingValidation.totalValue} em "${totalPath}"`}
                    type="success"
                    showIcon
                    icon={<CheckCircleOutlined />}
                  />
                )}

                {!mappingValidation.totalFound && totalPath && (
                  <Alert
                    message="Contagem total não disponível (usando o tamanho dos itens)"
                    type="info"
                    showIcon
                  />
                )}

                {mappingValidation.errors && mappingValidation.errors.length > 0 && (
                  <Alert
                    message="Erros de Mapeamento"
                    description={
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {mappingValidation.errors.map((error, i) => (
                          <li key={i}>{error}</li>
                        ))}
                      </ul>
                    }
                    type="error"
                    showIcon
                  />
                )}

                {mappingValidation.warnings && mappingValidation.warnings.length > 0 && (
                  <Alert
                    message="Avisos"
                    description={
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {mappingValidation.warnings.map((warning, i) => (
                          <li key={i}>{warning}</li>
                        ))}
                      </ul>
                    }
                    type="warning"
                    showIcon
                  />
                )}
              </Space>
            )}
          </>
        )}
      </Space>
    </Card>
  );
};

export default ResponseMapperPanel;
