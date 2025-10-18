# DataTable Configuration Improvements

Este documento descreve todas as melhorias implementadas no sistema de configuração visual do DxpTable.

## 🐛 Correções de Bugs

### 1. Corrigido: Input do Data Field Name digitava apenas um caractere

**Problema:** Ao digitar no campo "Data Field Name", apenas um caractere era aceito por vez, tornando impossível digitar normalmente.

**Causa:** O componente usava `column.key` como `key` prop do Card no React, e quando o `dataIndex` mudava, o `key` também mudava, causando uma remontagem completa do componente.

**Solução:**
- Adicionado campo `id` separado para cada coluna, usado como `key` estável no React
- O campo `key` continua existindo para a configuração da tabela, mas não afeta mais o React
- Mudança na função `handleColumnChange` para usar `.map()` em vez de mutar o array diretamente

**Arquivo:** `src/components/configuration-form/columns-config-section.jsx`

```javascript
// Antes (problemático)
key={column.key || index}  // key mudava quando dataIndex mudava

// Depois (corrigido)
id: `col_${timestamp}`,  // ID estável para React
key={column.id || index}  // Usa ID estável
```

---

## ✨ Novas Funcionalidades

### 2. Import/Export de Configuração de Colunas via JSON

**Descrição:** Permite que usuários importem e exportem configurações de colunas em formato JSON, facilitando:
- Backup de configurações
- Compartilhamento entre equipes
- Edição avançada em editores de texto
- Cópia rápida de configurações

**Funcionalidades:**
- **Import JSON:** Modal com textarea para colar/editar JSON
- **Export JSON:** Baixa arquivo `.json` com configuração atual
- **Validação:** Verifica estrutura e campos obrigatórios
- **Copy to Clipboard:** Copia JSON para área de transferência

**Uso:**
```json
[
  {
    "title": "Name",
    "dataIndex": "name",
    "sortable": true,
    "clickable": true,
    "width": 200
  },
  {
    "title": "Email",
    "dataIndex": "email",
    "icon": "MailOutlined",
    "iconClickable": true
  }
]
```

**Arquivo:** `src/components/configuration-form/columns-config-section.jsx`

---

### 3. Configuração de Ícones nas Colunas

**Descrição:** Adiciona suporte para ícones do Ant Design nas colunas, com ações de click configuráveis.

**Funcionalidades:**
- **20 ícones disponíveis:** User, Mail, Phone, Edit, Delete, View, etc.
- **Icon Clickable:** Checkbox para tornar o ícone clicável
- **Seletor visual:** Dropdown com busca para escolher ícone
- **Ações personalizáveis:** Quando clicado, dispara eventos customizados

**Ícones Disponíveis:**
- UserOutlined, MailOutlined, PhoneOutlined
- HomeOutlined, EditOutlined, DeleteOutlined
- EyeOutlined, DownloadOutlined, UploadOutlined
- StarOutlined, HeartOutlined, CheckOutlined
- CloseOutlined, SettingOutlined, SearchOutlined
- PlusOutlined, MinusOutlined, InfoCircleOutlined
- WarningOutlined, LinkOutlined

**Configuração:**
```javascript
{
  "title": "Actions",
  "dataIndex": "id",
  "icon": "EditOutlined",
  "iconClickable": true
}
```

**Arquivo:** `src/components/configuration-form/columns-config-section.jsx`

---

### 4. Auto-Geração de Colunas

**Descrição:** Quando nenhuma coluna está configurada, o sistema automaticamente gera colunas baseadas na primeira linha de dados da API.

**Funcionalidades:**
- **Detecção automática:** Analisa primeiro registro da resposta
- **Tipos suportados:** string, number, boolean
- **Ignora objetos/arrays:** Apenas campos primitivos viram colunas
- **Nomes formatados:** Converte `first_name` para "First Name"

**Lógica:**
```javascript
// Se não há colunas configuradas E há dados
if (columns.length === 0 && data.length > 0) {
  columns = autoGenerateColumns(data);
}
```

**Arquivo:** `src/services/external-api.js` (função `autoGenerateColumns`)

---

### 5. Configuração de Nome da Tabela

**Descrição:** Permite configurar um nome/título personalizado para a tabela.

**Funcionalidades:**
- Campo de texto para nome da tabela
- Usado em:
  * Título da página
  * Breadcrumbs
  * Documentação exportada
  * Logs do sistema

**Configuração:**
```javascript
{
  "tableName": "User Management Table"
}
```

**Arquivo:** `src/components/configuration-form/advanced-config-section.jsx`

---

### 6. Parâmetros de API Customizáveis

**Descrição:** Configuração de nomes de parâmetros usados nas requisições à API, permitindo compatibilidade com diferentes APIs.

**Parâmetros Configuráveis:**
- **Page Parameter:** Nome do parâmetro de número da página
- **Page Size Parameter:** Nome do parâmetro de itens por página
- **Sort Parameter:** Nome do parâmetro de ordenação

**Padrões Comuns:**
```javascript
// JSONPlaceholder
{ page: "_page", pageSize: "_limit", sort: "sort" }

// Liferay
{ page: "page", pageSize: "pageSize", sort: "sort" }

// Generic REST
{ page: "page", pageSize: "limit", sort: "order_by" }

// GraphQL Style
{ page: "offset", pageSize: "first", sort: "orderBy" }
```

**Exemplo de URL Gerada:**
```
// Com config: { page: "p", pageSize: "size" }
https://api.example.com/users?p=2&size=20

// Com config padrão
https://api.example.com/users?_page=2&_limit=20
```

**Arquivo:** `src/components/configuration-form/advanced-config-section.jsx`

---

### 7. Configuração de Caminhos de Resposta da API

**Descrição:** Define onde encontrar dados e contagem total na resposta da API, suportando estruturas variadas.

**Configurações:**
- **Data Array Path:** Caminho para array de dados usando notação de ponto
- **Total Count Source:** 'header' ou 'body'
- **Total Count Key:** Nome do header ou propriedade com total

**Padrões Suportados:**

**Pattern 1 - Array Direto:**
```javascript
// Response
[{id: 1, name: "John"}, {id: 2, name: "Jane"}]

// Config
{
  dataKey: "",
  totalSource: "header",
  totalKey: "x-total-count"
}
```

**Pattern 2 - Dados Encapsulados:**
```javascript
// Response
{
  data: [{id: 1}, {id: 2}],
  totalCount: 100
}

// Config
{
  dataKey: "data",
  totalSource: "body",
  totalKey: "totalCount"
}
```

**Pattern 3 - Nested/Liferay Style:**
```javascript
// Response
{
  response: {
    items: [{id: 1}, {id: 2}],
    total: 100
  }
}

// Config
{
  dataKey: "response.items",
  totalSource: "body",
  totalKey: "response.total"
}
```

**Arquivo:** `src/components/configuration-form/advanced-config-section.jsx`

---

## 🔧 Melhorias Técnicas

### Função de Acesso a Propriedades Aninhadas

**Descrição:** Utility function para acessar propriedades aninhadas usando notação de ponto.

```javascript
getNestedValue({data: {items: [1,2,3]}}, 'data.items')
// Returns: [1,2,3]

getNestedValue({user: {profile: {name: "John"}}}, 'user.profile.name')
// Returns: "John"
```

**Uso:**
- Extração de dados da resposta API
- Busca de total count em objetos aninhados
- Navegação em estruturas complexas

**Arquivo:** `src/services/external-api.js`

---

## 📦 Estrutura de Configuração Completa

### Objeto de Configuração Final

```javascript
{
  // Basic Configuration
  "apiEndpoint": "https://api.example.com/users",
  "authToken": "Bearer xyz123",

  // Table Configuration
  "tableName": "User Management",

  // Columns Configuration
  "columns": [
    {
      "id": "col_1234567890",
      "key": "id",
      "title": "ID",
      "dataIndex": "id",
      "sortable": true,
      "clickable": false,
      "width": 80
    },
    {
      "id": "col_1234567891",
      "key": "name",
      "title": "Name",
      "dataIndex": "name",
      "sortable": true,
      "clickable": true,
      "icon": "UserOutlined",
      "iconClickable": false
    },
    {
      "id": "col_1234567892",
      "key": "email",
      "title": "Email",
      "dataIndex": "email",
      "sortable": true,
      "clickable": true,
      "icon": "MailOutlined",
      "iconClickable": true,
      "width": 250
    }
  ],

  // Pagination Configuration
  "pagination": {
    "pageSize": 20,
    "showPagination": true
  },

  // Advanced API Configuration
  "apiParamNames": {
    "page": "_page",
    "pageSize": "_limit",
    "sort": "sort"
  },

  // Response Data Path Configuration
  "responseDataPath": {
    "dataKey": "",
    "totalKey": "x-total-count",
    "totalSource": "header"
  },

  // Metadata
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T11:45:00Z"
}
```

---

## 🎯 Casos de Uso

### Caso 1: API RESTful Padrão
```javascript
{
  "apiEndpoint": "https://jsonplaceholder.typicode.com/users",
  "tableName": "JSONPlaceholder Users",
  "apiParamNames": {
    "page": "_page",
    "pageSize": "_limit"
  },
  "responseDataPath": {
    "dataKey": "",
    "totalSource": "header",
    "totalKey": "x-total-count"
  }
}
```

### Caso 2: Liferay Headless API
```javascript
{
  "apiEndpoint": "https://liferay.com/o/headless-admin-user/v1.0/user-accounts",
  "authToken": "Bearer abc123",
  "tableName": "Liferay Users",
  "apiParamNames": {
    "page": "page",
    "pageSize": "pageSize"
  },
  "responseDataPath": {
    "dataKey": "items",
    "totalSource": "body",
    "totalKey": "totalCount"
  }
}
```

### Caso 3: API Customizada com Nested Data
```javascript
{
  "apiEndpoint": "https://api.mycompany.com/v2/employees",
  "authToken": "Bearer xyz789",
  "tableName": "Company Employees",
  "apiParamNames": {
    "page": "pageNumber",
    "pageSize": "recordsPerPage",
    "sort": "orderBy"
  },
  "responseDataPath": {
    "dataKey": "response.data.employees",
    "totalSource": "body",
    "totalKey": "response.meta.totalRecords"
  }
}
```

---

## 🚀 Guia de Migração

### Para Usuários de Configurações Antigas

Se você tinha configurações salvas antes dessas melhorias:

1. **Colunas sem ID:** Sistema auto-gera IDs na importação
2. **Sem configurações avançadas:** Valores padrão são aplicados automaticamente
3. **Ícones:** Campo opcional, não afeta configurações existentes

**Migração Automática:**
O sistema detecta configurações antigas e adiciona campos faltantes automaticamente.

---

## 📚 Documentação Adicional

### Arquivos Modificados/Criados

1. `src/components/configuration-form/columns-config-section.jsx` - Componente de colunas melhorado
2. `src/components/configuration-form/advanced-config-section.jsx` - NOVO: Configurações avançadas
3. `src/services/external-api.js` - API service com parâmetros customizáveis
4. `src/services/config-storage.js` - Atualizado para novos campos

### Compatibilidade

- ✅ Retrocompatível com configurações antigas
- ✅ Funciona com ou sem configurações avançadas
- ✅ Valores padrão inteligentes
- ✅ Validação robusta de JSON

---

## 🎉 Resumo das Melhorias

| Melhoria | Status | Arquivo Principal |
|----------|--------|-------------------|
| Fix input de um caractere | ✅ Concluído | columns-config-section.jsx |
| Import/Export JSON | ✅ Concluído | columns-config-section.jsx |
| Configuração de ícones | ✅ Concluído | columns-config-section.jsx |
| Auto-geração de colunas | ✅ Concluído | external-api.js |
| Nome da tabela | ✅ Concluído | advanced-config-section.jsx |
| Parâmetros de API customizáveis | ✅ Concluído | advanced-config-section.jsx |
| Caminhos de resposta configuráveis | ✅ Concluído | advanced-config-section.jsx |

**Todas as 7 melhorias solicitadas foram implementadas com sucesso!** 🎊

