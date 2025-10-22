# DxpTable - Liferay Client Extension

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![React](https://img.shields.io/badge/react-18.3.1-61dafb.svg)
![Liferay](https://img.shields.io/badge/liferay-7.4%20GA129%2B-0b63ce.svg)

**DataTable configurável via wizard visual - Client Extension para Liferay DXP**

Componente reutilizável que permite criar tabelas dinâmicas através de uma interface visual sem código, pronto para deployment como Custom Element no Liferay DXP 7.4+. Construído seguindo princípios de **Clean Architecture** e **Clean Code**.

---

## O que é este projeto?

Um DataTable inteligente que você configura visualmente através de um wizard de 6 passos, sem escrever código. Ideal para exibir dados de APIs REST (Liferay Headless ou externas) em páginas do Liferay DXP.

**Use cases principais:**

- Exibir dados de APIs Headless do Liferay (usuários, posts, documentos)
- Integrar APIs REST externas no Liferay
- Criar dashboards e relatórios configuráveis
- Tabelas com paginação, ordenação e filtros dinâmicos

---

## Principais Features

### Configuração Visual (No-Code)

- ✨ **Wizard de 6 passos** - Configure tudo pela interface
- 🔌 **Teste de API** - Preview da resposta antes de salvar
- 🎯 **Sugestão automática de colunas** - A partir do JSON de resposta
- 📤 **Import/Export** - Configurações em JSON

### Funcionalidades da Tabela

- 📊 **Paginação flexível** - Client-side ou server-side
- 🔄 **Ordenação** - Por coluna, client ou server
- 🎨 **Renderers customizados** - Boolean, Date, Custom
- 🔍 **Parâmetros dinâmicos** - Filtros e buscas que atualizam a tabela
- 🖱️ **Eventos de clique** - Execute código JavaScript personalizado
- 🗺️ **Response Mapping** - Suporte para dados aninhados (ex: `data.items[]`)

### Integração Liferay

- ⚡ **Custom Element** - Tag HTML `<dxp-datatable>`
- 🔐 **OAuth integrado** - Autenticação automática com Liferay
- 📦 **Deploy simples** - Via Liferay Workspace ou manual
- 🎯 **Múltiplas instâncias** - Várias tabelas na mesma página

---

## Requisitos

- **Node.js** 16+ e npm
- **Liferay DXP** 7.4 GA129 ou superior
- Navegador moderno com suporte a ES Modules

---

## Instalação e Desenvolvimento

### 1. Clone e instale dependências

```bash
git clone <repository-url>
cd datatable-simple
npm install
```

### 2. Configure variáveis de ambiente

Copie `.env.example` para `.env.local`:

```env
VITE_LIFERAY_API_URL=http://localhost:8080
VITE_LIFERAY_TOKEN=your-oauth-token-here
VITE_APP_TITLE=DxpTable Component
```

### 3. Execute em desenvolvimento

```bash
npm run dev
# Abre em http://localhost:3000
```

### 4. Build para produção

```bash
npm run build
# Gera dist/main.js e dist/main.css
```

---

## Deploy no Liferay DXP

### Build do projeto

```bash
npm run build
```

Após o build, a pasta `dist/` conterá:

- `main.js` - Bundle completo da aplicação (~1.2MB minified)
- `main.css` - Estilos (~8KB)

### Opção 1: Deploy via Liferay Workspace

```bash
# Copie o projeto para o workspace
cp -r . /path/to/liferay-workspace/client-extensions/dxp-datatable

# Build e deploy
cd /path/to/liferay-workspace
blade gw deploy
```

### Opção 2: Deploy Manual (ZIP)

```bash
# Crie um ZIP do projeto
cd ..
zip -r dxp-datatable.zip datatable-simple/

# No Liferay: Control Panel → Apps → App Manager → Upload
```

### Opção 3: Liferay CLI

```bash
npm run build
lcp deploy --project=dxp-datatable
```

---

## Usando no Liferay

### Como Widget em uma página

1. Edite uma página de conteúdo
2. Abra o painel "Widgets"
3. Procure por "DxpTable Component" em "Client Extensions"
4. Arraste para a página

### Em templates FreeMarker

```html
<dxp-datatable></dxp-datatable>
```

### Com atributos de configuração

```html
<dxp-datatable
  data-liferay-config='{"apiEndpoint": "/o/headless-admin-user/v1.0/user-accounts"}'
></dxp-datatable>
```

---

## Configuração via Wizard Visual

O wizard possui 6 etapas:

1. **API Configuration** - Configure endpoint, autenticação, headers
2. **Preview & Test** - Teste a API e visualize a resposta
3. **Columns** - Adicione/configure colunas (ou use sugestões automáticas)
4. **Pagination** - Configure paginação (client/server/disabled)
5. **Events** - Configure cliques em linhas e ordenação
6. **Dynamic Params** - Adicione filtros de busca e parâmetros dinâmicos

Após configurar, a tabela é salva no localStorage e exibida automaticamente.

### Exemplo de Configuração

Um arquivo de exemplo está disponível em:

```
src/utils/examples/stackexchange.users.json
```

Este exemplo demonstra:

- Configuração de API externa (StackExchange)
- Parâmetros de URL e query
- Colunas com renderer boolean
- Paginação via API
- Response mapping para dados aninhados

---

## Arquitetura do Projeto

O projeto segue **Clean Architecture** com separação clara de responsabilidades:

```
/src
  /core                 # Lógica de negócio (framework-independent)
    /hooks              # Hooks compartilhados
    /validators         # Validadores de regras de negócio
    /models             # Types e constants

  /features             # Módulos de funcionalidades (use cases)
    /configuration      # Wizard de configuração
    /preview            # Teste e preview de API
    /columns            # Gerenciamento de colunas
    /events             # Configuração de eventos

  /components           # Componentes UI reutilizáveis
    /dxp-table          # Componente principal da tabela
    /configuration-form # Seções do formulário
    /shared             # Componentes compartilhados

  /services             # Serviços externos
    /config-storage.js  # Gerenciamento localStorage
    /liferay-api.js     # Cliente API Liferay
    /external-api.js    # Cliente API externa

  /utils                # Funções utilitárias
  /pages                # Páginas da aplicação
  /styles               # SCSS e sistema de temas
```

### Princípios aplicados:

- **Separation of Concerns** - Lógica separada da UI
- **Dependency Rule** - Dependências apontam para dentro
- **Single Responsibility** - Cada módulo tem uma razão para mudar
- **Testability** - Componentes isolados e testáveis

---

## Endpoints Liferay Comuns

Exemplos de endpoints Headless API:

- **Usuários**: `/o/headless-admin-user/v1.0/user-accounts`
- **Blog Posts**: `/o/headless-delivery/v1.0/sites/{siteId}/blog-postings`
- **Conteúdo Estruturado**: `/o/headless-delivery/v1.0/sites/{siteId}/structured-contents`
- **Documentos**: `/o/headless-delivery/v1.0/sites/{siteId}/documents`

---

## Troubleshooting

### Build falha ou assets não carregam

**Problema**: `main.js` ou `main.css` não encontrados no Liferay

**Solução**:

- Verifique `base: './'` em [vite.config.js](vite.config.js)
- Rebuild: `npm run build`
- Confirme que `dist/main.js` e `dist/main.css` existem

### Custom Element não é definido

**Problema**: Erro no console do navegador

**Solução**:

- Verifique browser console para erros de carregamento
- Confirme que o deploy foi bem-sucedido no Liferay
- Limpe cache do navegador

### Erros de OAuth/Autenticação

**Problema**: 401 ou 403 ao acessar APIs Liferay

**Solução**:

- Verifique se `oAuthApplicationUserAgent` está definido em [client-extension.yaml](client-extension.yaml)
- Confirme que o token OAuth está válido (se usando em dev)

### API retorna 404

**Problema**: Endpoint não encontrado

**Solução**:

- Valide a URL do endpoint no teste de API
- Verifique se os parâmetros de URL estão corretos (ex: `{siteId}`)
- Confirme que a API existe no Liferay

### Configuração não persiste

**Problema**: Configuração é perdida ao recarregar

**Solução**:

- Abra DevTools → Application → Local Storage
- Procure por chave `dxp-table-config`
- Use botão "Limpar Configuração" e reconfigure

### Erros de build - SCSS

**Problema**: Erro ao compilar arquivos SCSS

**Solução**:

```bash
# Reinstale dependências
rm -rf node_modules package-lock.json
npm install

# Limpe cache do Vite
rm -rf .vite node_modules/.vite
npm run dev
```

---

## Sistema de Temas (SCSS)

O projeto usa um sistema de temas baseado em SCSS tokens integrado com Ant Design.

**Estrutura:**

- `/src/styles/theme/global/` - Tokens globais (cores, tipografia, spacing)
- `/src/styles/theme/components/` - Tokens por componente
- `/src/config/theme-tokens.js` - Conversor SCSS → JS
- `/src/config/antd-theme.js` - Configuração Ant Design

**Para customizar:**

Edite os arquivos SCSS em `src/styles/theme/global/`:

```scss
// _colors.module.scss
$color-primary: #1890ff; // Mude a cor primária
```

Mudanças propagam automaticamente via hot reload.

---

## Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento (porta 3000)
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Verifica código com ESLint
npm run lint:fix     # Corrige problemas automaticamente
npm run format       # Formata código com Prettier
npm run format:check # Verifica formatação
```

---

## Stack Tecnológico

- [React](https://reactjs.org/) 18.3.1 - Framework UI
- [Ant Design](https://ant.design/) 5.27.6 - Biblioteca de componentes
- [Vite](https://vitejs.dev/) 6.4.1 - Build tool
- [Axios](https://axios-http.com/) - Cliente HTTP
- [date-fns](https://date-fns.org/) - Formatação de datas
- [Sass](https://sass-lang.com/) - Pré-processador CSS

---

## Documentação Adicional

- [VALIDATORS.md](VALIDATORS.md) - Documentação dos validadores de negócio
- [LIFERAY-MIGRATION.md](LIFERAY-MIGRATION.md) - Guia de migração para Liferay

---

## Licença

MIT

---

## Contribuições

Contribuições são bem-vindas! Para adicionar features ou corrigir bugs:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

**Convenções:**

- Siga Clean Architecture (core → features → components)
- Use hooks customizados para lógica stateful
- Mantenha componentes pequenos e focados
- Adicione validadores em `/core/validators/`

---

**Desenvolvido para Liferay DXP - Client Extension**
