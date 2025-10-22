/**
 * Response Mapper Panel Component
 *
 * Permite configurar onde estão os dados e o total de registros
 * dentro da resposta da API, usados pela tabela.
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
    <Card title="Mapeamento da resposta da API" size="small">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Checkbox checked={enableMapping} onChange={(e) => onToggleMapping(e.target.checked)}>
          Ativar mapeamento da resposta
        </Checkbox>

        {!enableMapping && (
          <Alert
            message="Se o mapeamento estiver desativado, a tabela usará diretamente os dados retornados pela API."
            showIcon
          />
        )}

        {enableMapping && (
          <>
        <Space direction="vertical" size="middle" style={{ width: '50%' }}>
            <div>
              <Text strong>Local da lista de itens na resposta:</Text>
              <Input
                placeholder='Exemplo: data.items ou results'
                value={dataPath}
                onChange={(e) => onDataPathChange(e.target.value)}
                style={{ marginTop: 4  }}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Informe o caminho onde estão os dados da listagem.
              </Text>
            </div>

            <div>
              <Text strong>Local do total de registros na resposta:</Text>
              <Input
                placeholder='Exemplo: data.pagination.total ou total — deixe em branco se não houver'
                value={totalPath}
                onChange={(e) => onTotalPathChange(e.target.value)}
                style={{ marginTop: 4 }}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Use se a API informar a quantidade total de registros se houver.
              </Text>
            </div>
            </Space>

            {mappingValidation && (
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                {mappingValidation.itemsFound && (
                  <Alert
                    message={`Foram encontrados ${mappingValidation.itemsCount} itens em "${dataPath}".`}
                    type="success"
                    showIcon
                    icon={<CheckCircleOutlined />}
                  />
                )}

                {mappingValidation.totalFound && (
                  <Alert
                    message={`Total identificado: ${mappingValidation.totalValue} em "${totalPath}".`}
                    type="success"
                    showIcon
                    icon={<CheckCircleOutlined />}
                  />
                )}

                {!mappingValidation.totalFound && totalPath && (
                  <Alert
                    message="A API não informou o total. Será usado o número de itens retornados."
                    type="info"
                    showIcon
                  />
                )}

                {mappingValidation.errors && mappingValidation.errors.length > 0 && (
                  <Alert
                    message="Erros encontrados no mapeamento da resposta"
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
                    message="Avisos de mapeamento"
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
