// ============================================
// ANT DESIGN THEME CONFIGURATION - COMPLETO
// ============================================
// Este arquivo cria o objeto de configuração completo do tema para o Ant Design.
// Use este objeto no ConfigProvider do Ant Design.
// Documentação: https://ant.design/docs/react/customize-theme

import { globalThemeTokens, componentTokens } from './theme-tokens';

/**
 * Configuração completa do tema do Ant Design
 *
 * Estrutura:
 * - token: Configurações globais que afetam todos os componentes
 * - components: Customizações específicas de cada componente
 * - algorithm: Algoritmos de tema (dark, compact, etc) - opcional
 *
 * @type {import('antd').ThemeConfig}
 */
export const antdTheme = {
  // ============================================
  // TOKEN - Configurações Globais do Tema
  // ============================================
  // Estes tokens afetam TODOS os componentes da aplicação.
  // São a base do sistema de design.

  token: {
    // ──────────────────────────────────────────
    // CORES PRINCIPAIS
    // ──────────────────────────────────────────
    // Cores semânticas que definem a identidade visual

    colorPrimary: globalThemeTokens.colorPrimary, // #1890ff - Cor da marca
    colorSuccess: globalThemeTokens.colorSuccess, // #52c41a - Estados positivos
    colorWarning: globalThemeTokens.colorWarning, // #faad14 - Avisos
    colorError: globalThemeTokens.colorError, // #f5222d - Erros
    colorInfo: globalThemeTokens.colorInfo, // #1890ff - Informações

    // ──────────────────────────────────────────
    // CORES DE TEXTO
    // ──────────────────────────────────────────
    // Hierarquia de cores para diferentes níveis de texto

    colorTextBase: globalThemeTokens.colorTextBase, // rgba(0,0,0,0.88) - Texto principal
    colorTextSecondary: globalThemeTokens.colorTextSecondary, // rgba(0,0,0,0.65) - Texto secundário
    colorTextTertiary: globalThemeTokens.colorTextTertiary, // rgba(0,0,0,0.45) - Texto terciário
    colorTextQuaternary: globalThemeTokens.colorTextQuaternary, // rgba(0,0,0,0.25) - Texto desabilitado

    // ──────────────────────────────────────────
    // CORES DE FUNDO
    // ──────────────────────────────────────────

    colorBgBase: globalThemeTokens.colorBgBase, // #ffffff - Fundo base
    colorBgContainer: globalThemeTokens.colorBgContainer, // #ffffff - Fundo de containers
    colorBgElevated: globalThemeTokens.colorBgElevated, // #ffffff - Fundo elevado (modais)
    colorBgLayout: globalThemeTokens.colorBgLayout, // #fafafa - Fundo de layout
    colorBgSpotlight: globalThemeTokens.colorBgSpotlight, // #000000 - Fundo de destaque
    colorBgMask: globalThemeTokens.colorBgMask, // rgba(0,0,0,0.45) - Máscara de overlay

    // ──────────────────────────────────────────
    // CORES DE BORDA
    // ──────────────────────────────────────────

    colorBorder: globalThemeTokens.colorBorder, // #d9d9d9 - Borda principal
    colorBorderSecondary: globalThemeTokens.colorBorderSecondary, // #f0f0f0 - Borda secundária

    // ──────────────────────────────────────────
    // CORES DE PREENCHIMENTO
    // ──────────────────────────────────────────
    // Usadas em skeletons, backgrounds sutis, etc

    colorFill: globalThemeTokens.colorFill, // rgba(0,0,0,0.15)
    colorFillSecondary: globalThemeTokens.colorFillSecondary, // rgba(0,0,0,0.06)
    colorFillTertiary: globalThemeTokens.colorFillTertiary, // rgba(0,0,0,0.04)
    colorFillQuaternary: globalThemeTokens.colorFillQuaternary, // rgba(0,0,0,0.02)

    // ──────────────────────────────────────────
    // CORES DE LINKS
    // ──────────────────────────────────────────

    colorLink: globalThemeTokens.colorLink, // Links normais
    colorLinkHover: globalThemeTokens.colorLinkHover, // Links em hover
    colorLinkActive: globalThemeTokens.colorLinkActive, // Links clicados

    // ──────────────────────────────────────────
    // TIPOGRAFIA
    // ──────────────────────────────────────────

    // Famílias de fonte
    fontFamily: globalThemeTokens.fontFamily,
    fontFamilyCode: globalThemeTokens.fontFamilyCode,

    // Tamanhos de fonte
    fontSize: globalThemeTokens.fontSize, // 14px - Tamanho base
    fontSizeSM: globalThemeTokens.fontSizeSM, // 12px - Pequeno
    fontSizeLG: globalThemeTokens.fontSizeLG, // 16px - Grande
    fontSizeXL: globalThemeTokens.fontSizeXL, // 20px - Extra grande

    // Tamanhos de títulos
    fontSizeHeading1: globalThemeTokens.fontSizeHeading1, // 38px - H1
    fontSizeHeading2: globalThemeTokens.fontSizeHeading2, // 30px - H2
    fontSizeHeading3: globalThemeTokens.fontSizeHeading3, // 24px - H3
    fontSizeHeading4: globalThemeTokens.fontSizeHeading4, // 20px - H4
    fontSizeHeading5: globalThemeTokens.fontSizeHeading5, // 16px - H5

    // Pesos de fonte
    fontWeightStrong: globalThemeTokens.fontWeightStrong, // 600 - Negrito

    // Alturas de linha
    lineHeight: globalThemeTokens.lineHeight, // 1.5715 - Padrão
    lineHeightSM: globalThemeTokens.lineHeightSM, // 1.2 - Compacto
    lineHeightLG: globalThemeTokens.lineHeightLG, // 1.8 - Relaxado
    lineHeightHeading: globalThemeTokens.lineHeightHeading, // 1.35 - Para títulos

    // ──────────────────────────────────────────
    // ESPAÇAMENTO - TAMANHOS
    // ──────────────────────────────────────────

    sizeXXS: globalThemeTokens.sizeXXS, // 4px
    sizeXS: globalThemeTokens.sizeXS, // 8px
    sizeSM: globalThemeTokens.sizeSM, // 12px
    size: globalThemeTokens.size, // 16px - Padrão
    sizeMD: globalThemeTokens.size, // 16px - Alias
    sizeLG: globalThemeTokens.sizeLG, // 24px
    sizeXL: globalThemeTokens.sizeXL, // 32px
    sizeXXL: globalThemeTokens.sizeXXL, // 48px

    // ──────────────────────────────────────────
    // ALTURAS DE CONTROLES
    // ──────────────────────────────────────────
    // Alturas padrão para inputs, buttons, selects

    controlHeight: globalThemeTokens.controlHeight, // 40px - Padrão
    controlHeightSM: globalThemeTokens.controlHeightSM, // 32px - Pequeno
    controlHeightXS: globalThemeTokens.controlHeightXS, // 24px - Extra pequeno
    controlHeightLG: globalThemeTokens.controlHeightLG, // 48px - Grande

    // ──────────────────────────────────────────
    // PADDING
    // ──────────────────────────────────────────

    padding: globalThemeTokens.padding, // 16px - Padrão
    paddingXS: globalThemeTokens.paddingXS, // 8px
    paddingSM: globalThemeTokens.paddingSM, // 12px
    paddingLG: globalThemeTokens.paddingLG, // 24px
    paddingContentHorizontal: globalThemeTokens.paddingContentHorizontal, // 24px
    paddingContentVertical: globalThemeTokens.paddingContentVertical, // 16px

    // ──────────────────────────────────────────
    // MARGIN
    // ──────────────────────────────────────────

    margin: globalThemeTokens.margin, // 16px - Padrão
    marginXS: globalThemeTokens.marginXS, // 8px
    marginSM: globalThemeTokens.marginSM, // 12px
    marginLG: globalThemeTokens.marginLG, // 24px
    marginXL: globalThemeTokens.marginXL, // 32px

    // ──────────────────────────────────────────
    // SOMBRAS E BORDAS
    // ──────────────────────────────────────────

    boxShadow: globalThemeTokens.boxShadow, // Sombra padrão
    boxShadowSecondary: globalThemeTokens.boxShadowSecondary, // Sombra média
    boxShadowTertiary: globalThemeTokens.boxShadowTertiary, // Sombra alta

    borderRadius: globalThemeTokens.borderRadius, // 6px - Padrão
    borderRadiusXS: globalThemeTokens.borderRadiusXS, // 2px
    borderRadiusSM: globalThemeTokens.borderRadiusSM, // 4px
    borderRadiusLG: globalThemeTokens.borderRadiusLG, // 8px
    borderRadiusOuter: globalThemeTokens.borderRadiusOuter, // 6px
  },

  // ============================================
  // COMPONENTS - Customizações por Componente
  // ============================================
  // Cada componente pode ter suas próprias customizações
  // que sobrescrevem os tokens globais.

  components: {
    // ──────────────────────────────────────────
    // BUTTON - Botões
    // ──────────────────────────────────────────
    Button: componentTokens.Button,

    // ──────────────────────────────────────────
    // TABLE - Tabelas
    // ──────────────────────────────────────────
    Table: componentTokens.Table,

    // ──────────────────────────────────────────
    // INPUT - Campos de Entrada
    // ──────────────────────────────────────────
    Input: componentTokens.Input,

    // ──────────────────────────────────────────
    // ALERT - Alertas e Notificações
    // ──────────────────────────────────────────
    Alert: componentTokens.Alert,

    // ──────────────────────────────────────────
    // SPACE - Espaçamento entre Elementos
    // ──────────────────────────────────────────
    Space: componentTokens.Space,

    // ──────────────────────────────────────────
    // SWITCH - Interruptores
    // ──────────────────────────────────────────
    Switch: componentTokens.Switch,

    // ──────────────────────────────────────────
    // TAG - Tags
    // ──────────────────────────────────────────
    Tag: componentTokens.Tag,

    // ──────────────────────────────────────────
    // TOOLTIP - Tooltips
    // ──────────────────────────────────────────
    Tooltip: componentTokens.Tooltip,

    // ──────────────────────────────────────────
    // MESSAGE - Mensagens de Feedback
    // ──────────────────────────────────────────
    Message: componentTokens.Message,
  },
};
