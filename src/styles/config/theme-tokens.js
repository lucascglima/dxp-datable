// ============================================
// THEME TOKENS - CONVERSÃO SCSS PARA JS
// ============================================
// Este arquivo importa as variáveis SCSS e as converte para JavaScript.
// Usa o recurso :export do SCSS para expor as variáveis.

import * as globalColors from '../theme/global/_colors.module.scss';
import * as globalTypography from '../theme/global/_typography.module.scss';
import * as globalSpacing from '../theme/global/_spacing.module.scss';
import * as globalShadows from '../theme/global/_shadows.module.scss';

import * as buttonTokens from '../theme/components/_button.module.scss';
import * as tableTokens from '../theme/components/_table.module.scss';
import * as inputTokens from '../theme/components/_input.module.scss';
import * as alertTokens from '../theme/components/_alert.module.scss';
import * as messageTokens from '../theme/components/_message.module.scss';
import * as spaceTokens from '../theme/components/_space.module.scss';
import * as switchTokens from '../theme/components/_switch.module.scss';
import * as tagTokens from '../theme/components/_tag.module.scss';
import * as tooltipTokens from '../theme/components/_tooltip.module.scss';

// ============================================
// TOKENS GLOBAIS
// ============================================

export const globalThemeTokens = {
  // Cores
  colorPrimary: globalColors.colorPrimary,
  colorSuccess: globalColors.colorSuccess,
  colorWarning: globalColors.colorWarning,
  colorError: globalColors.colorError,
  colorInfo: globalColors.colorInfo,
  colorTextBase: globalColors.colorText,
  colorTextSecondary: globalColors.colorTextSecondary,
  colorTextTertiary: globalColors.colorTextTertiary,
  colorTextQuaternary: globalColors.colorTextQuaternary,
  colorBgBase: globalColors.colorBgBase,
  colorBgContainer: globalColors.colorBgContainer,
  colorBgElevated: globalColors.colorBgElevated,
  colorBgLayout: globalColors.colorBgLayout,
  colorBgSpotlight: globalColors.colorBgSpotlight,
  colorBgMask: globalColors.colorBgMask,
  colorBorder: globalColors.colorBorder,
  colorBorderSecondary: globalColors.colorBorderSecondary,
  colorFill: globalColors.colorFill,
  colorFillSecondary: globalColors.colorFillSecondary,
  colorFillTertiary: globalColors.colorFillTertiary,
  colorFillQuaternary: globalColors.colorFillQuaternary,
  colorLink: globalColors.colorLink,
  colorLinkHover: globalColors.colorLinkHover,
  colorLinkActive: globalColors.colorLinkActive,

  // Tipografia
  fontFamily: globalTypography.fontFamily,
  fontFamilyCode: globalTypography.fontFamilyCode,
  fontSize: parseFloat(globalTypography.fontSize),
  fontSizeSM: parseFloat(globalTypography.fontSizeSM),
  fontSizeLG: parseFloat(globalTypography.fontSizeLG),
  fontSizeXL: parseFloat(globalTypography.fontSizeXL),
  fontSizeHeading1: parseFloat(globalTypography.fontSizeHeading1),
  fontSizeHeading2: parseFloat(globalTypography.fontSizeHeading2),
  fontSizeHeading3: parseFloat(globalTypography.fontSizeHeading3),
  fontSizeHeading4: parseFloat(globalTypography.fontSizeHeading4),
  fontSizeHeading5: parseFloat(globalTypography.fontSizeHeading5),
  fontWeightStrong: parseFloat(globalTypography.fontWeightStrong),
  lineHeight: parseFloat(globalTypography.lineHeight),
  lineHeightSM: parseFloat(globalTypography.lineHeightSM),
  lineHeightLG: parseFloat(globalTypography.lineHeightLG),
  lineHeightHeading: parseFloat(globalTypography.lineHeightHeading),

  // Espaçamento
  sizeXXS: parseFloat(globalSpacing.sizeXXS),
  sizeXS: parseFloat(globalSpacing.sizeXS),
  sizeSM: parseFloat(globalSpacing.sizeSM),
  size: parseFloat(globalSpacing.size),
  sizeLG: parseFloat(globalSpacing.sizeLG),
  sizeXL: parseFloat(globalSpacing.sizeXL),
  sizeXXL: parseFloat(globalSpacing.sizeXXL),
  controlHeight: parseFloat(globalSpacing.controlHeight),
  controlHeightSM: parseFloat(globalSpacing.controlHeightSM),
  controlHeightXS: parseFloat(globalSpacing.controlHeightXS),
  controlHeightLG: parseFloat(globalSpacing.controlHeightLG),
  padding: parseFloat(globalSpacing.padding),
  paddingXS: parseFloat(globalSpacing.paddingXS),
  paddingSM: parseFloat(globalSpacing.paddingSM),
  paddingLG: parseFloat(globalSpacing.paddingLG),
  paddingContentHorizontal: parseFloat(globalSpacing.paddingContentHorizontal),
  paddingContentVertical: parseFloat(globalSpacing.paddingContentVertical),
  margin: parseFloat(globalSpacing.margin),
  marginXS: parseFloat(globalSpacing.marginXS),
  marginSM: parseFloat(globalSpacing.marginSM),
  marginLG: parseFloat(globalSpacing.marginLG),
  marginXL: parseFloat(globalSpacing.marginXL),

  // Sombras e Bordas
  boxShadow: globalShadows.boxShadow,
  boxShadowSecondary: globalShadows.boxShadowSecondary,
  boxShadowTertiary: globalShadows.boxShadowTertiary,
  borderRadius: parseFloat(globalShadows.borderRadius),
  borderRadiusXS: parseFloat(globalShadows.borderRadiusXS),
  borderRadiusSM: parseFloat(globalShadows.borderRadiusSM),
  borderRadiusLG: parseFloat(globalShadows.borderRadiusLG),
  borderRadiusOuter: parseFloat(globalShadows.borderRadiusOuter),
};

// ============================================
// TOKENS DE COMPONENTES
// ============================================

export const componentTokens = {
  Button: {
    // Cores
    colorPrimary: buttonTokens.buttonPrimaryColor,
    colorPrimaryHover: buttonTokens.buttonPrimaryHoverColor,
    colorPrimaryActive: buttonTokens.buttonPrimaryActiveColor,
    colorDanger: buttonTokens.buttonDangerColor,
    colorDangerHover: buttonTokens.buttonDangerHoverColor,
    colorDangerActive: buttonTokens.buttonDangerActiveColor,
    defaultColor: buttonTokens.buttonDefaultColor,
    defaultBg: buttonTokens.buttonDefaultBg,
    defaultBorderColor: buttonTokens.buttonDefaultBorder,

    // Tamanhos
    controlHeight: parseFloat(buttonTokens.buttonHeightBase),
    controlHeightLG: parseFloat(buttonTokens.buttonHeightLG),
    controlHeightSM: parseFloat(buttonTokens.buttonHeightSM),
    paddingContentHorizontal: parseFloat(buttonTokens.buttonPaddingHorizontalBase),

    // Tipografia
    fontSize: parseFloat(buttonTokens.buttonFontSizeBase),
    fontSizeLG: parseFloat(buttonTokens.buttonFontSizeLG),
    fontSizeSM: parseFloat(buttonTokens.buttonFontSizeSM),

    // Bordas
    borderRadius: parseFloat(buttonTokens.buttonBorderRadius),
    borderRadiusSM: parseFloat(buttonTokens.buttonBorderRadiusSM),
    borderRadiusLG: parseFloat(buttonTokens.buttonBorderRadiusLG),

    // Shadows
    defaultShadow: buttonTokens.buttonDefaultShadow,
    primaryShadow: buttonTokens.buttonPrimaryShadow,
    dangerShadow: buttonTokens.buttonDangerShadow,
  },

  Table: {
    // Cores
    headerBg: tableTokens.tableHeaderBg,
    headerColor: tableTokens.tableHeaderColor,
    headerSortActiveBg: tableTokens.tableHeaderSortBg,
    bodySortBg: tableTokens.tableRowHoverBg,
    rowHoverBg: tableTokens.tableRowHoverBg,
    rowSelectedBg: tableTokens.tableSelectedRowBg,
    rowSelectedHoverBg: tableTokens.tableSelectedRowBg,
    borderColor: tableTokens.tableBorderColor,
    footerBg: tableTokens.tableFooterBg,
    footerColor: tableTokens.tableFooterColor,

    // Tipografia
    fontSize: parseFloat(tableTokens.tableFontSize),
    headerFontSize: parseFloat(tableTokens.tableHeaderFontSize),

    // Espaçamento
    cellPaddingBlock: parseFloat(tableTokens.tablePaddingVertical),
    cellPaddingInline: parseFloat(tableTokens.tablePaddingHorizontal),
    cellPaddingBlockSM: parseFloat(tableTokens.tablePaddingVerticalSM),
    cellPaddingInlineSM: parseFloat(tableTokens.tablePaddingHorizontalSM),
    cellPaddingBlockMD: parseFloat(tableTokens.tablePaddingVerticalMD),
    cellPaddingInlineMD: parseFloat(tableTokens.tablePaddingHorizontalMD),

    // Bordas
    borderRadius: parseFloat(tableTokens.tableBorderRadius),
  },

  Input: {
    // Cores
    colorBgContainer: inputTokens.inputBg,
    colorBorder: inputTokens.inputBorderColor,
    colorText: inputTokens.inputColor,
    colorTextPlaceholder: inputTokens.inputPlaceholderColor,
    hoverBorderColor: inputTokens.inputHoverBorderColor,
    activeBorderColor: inputTokens.inputFocusBorderColor,
    colorBgContainerDisabled: inputTokens.inputDisabledBg,
    colorTextDisabled: inputTokens.inputDisabledColor,
    addonBg: inputTokens.inputAddonBg,

    // Tamanhos
    controlHeight: parseFloat(inputTokens.inputHeightBase),
    controlHeightLG: parseFloat(inputTokens.inputHeightLG),
    controlHeightSM: parseFloat(inputTokens.inputHeightSM),
    paddingInline: parseFloat(inputTokens.inputPaddingHorizontal),
    paddingInlineLG: parseFloat(inputTokens.inputPaddingHorizontalLG),
    paddingInlineSM: parseFloat(inputTokens.inputPaddingHorizontalSM),

    // Tipografia
    fontSize: parseFloat(inputTokens.inputFontSize),
    fontSizeLG: parseFloat(inputTokens.inputFontSizeLG),
    fontSizeSM: parseFloat(inputTokens.inputFontSizeSM),

    // Bordas
    borderRadius: parseFloat(inputTokens.inputBorderRadius),
    borderRadiusLG: parseFloat(inputTokens.inputBorderRadiusLG),
    borderRadiusSM: parseFloat(inputTokens.inputBorderRadiusSM),
  },

  // ============================================
  // ALERT - Alertas
  // ============================================
  Alert: {
    // Success
    colorSuccessBg: alertTokens.alertSuccessBg,
    colorSuccessBorder: alertTokens.alertSuccessBorder,
    colorSuccessIcon: alertTokens.alertSuccessIconColor,

    // Info
    colorInfoBg: alertTokens.alertInfoBg,
    colorInfoBorder: alertTokens.alertInfoBorder,
    colorInfoIcon: alertTokens.alertInfoIconColor,

    // Warning
    colorWarningBg: alertTokens.alertWarningBg,
    colorWarningBorder: alertTokens.alertWarningBorder,
    colorWarningIcon: alertTokens.alertWarningIconColor,

    // Error
    colorErrorBg: alertTokens.alertErrorBg,
    colorErrorBorder: alertTokens.alertErrorBorder,
    colorErrorIcon: alertTokens.alertErrorIconColor,

    // Spacing
    padding: parseFloat(alertTokens.alertPadding),
    paddingBlock: parseFloat(alertTokens.alertPaddingVertical),
    paddingInline: parseFloat(alertTokens.alertPaddingHorizontal),

    // Borders
    borderRadius: parseFloat(alertTokens.alertBorderRadius),
  },

  // ============================================
  // MESSAGE - Mensagens de Feedback
  // ============================================
  Message: {
    contentBg: messageTokens.messageBg,
    colorText: messageTokens.messageTextColor,
    contentPadding: `${messageTokens.messageNoticeContentPaddingVertical} ${messageTokens.messageNoticeContentPaddingHorizontal}`,
    borderRadius: parseFloat(messageTokens.messageBorderRadius),
  },

  // ============================================
  // SPACE - Espaçamento entre Elementos
  // ============================================
  Space: {
    // O Space usa principalmente os tokens globais de size
    // Mas podemos definir valores customizados se necessário
    spaceSize: spaceTokens.spaceSize,
    spaceSizeSM: spaceTokens.spaceSizeSM,
    spaceSizeMD: spaceTokens.spaceSizeMD,
    spaceSizeLG: spaceTokens.spaceSizeLG,
    spaceSizeXL: spaceTokens.spaceSizeXL,
  },

  // ============================================
  // SWITCH - Interruptores
  // ============================================
  Switch: {
    // Sizes
    trackHeight: parseFloat(switchTokens.switchHeight),
    trackMinWidth: parseFloat(switchTokens.switchMinWidth),
    trackHeightSM: parseFloat(switchTokens.switchSMHeight),
    trackMinWidthSM: parseFloat(switchTokens.switchSMMinWidth),

    // Colors
    colorPrimary: switchTokens.switchCheckedBg,
    colorTextQuaternary: switchTokens.switchBg,
    handleBg: switchTokens.switchHandleBg,
  },

  // ============================================
  // TAG - Tags
  // ============================================
  Tag: {
    defaultBg: tagTokens.tagDefaultBg,
    defaultColor: tagTokens.tagDefaultColor,
    colorBorder: tagTokens.tagDefaultBorderColor,
    fontSize: parseFloat(tagTokens.tagFontSize),
    lineHeight: parseFloat(tagTokens.tagLineHeight),
    borderRadiusSM: parseFloat(tagTokens.tagBorderRadius),
  },

  // ============================================
  // TOOLTIP - Tooltips
  // ============================================
  Tooltip: {
    colorBgSpotlight: tooltipTokens.tooltipBg,
    colorTextLightSolid: tooltipTokens.tooltipColor,
    borderRadius: parseFloat(tooltipTokens.tooltipBorderRadius),
    paddingXS: parseFloat(tooltipTokens.tooltipPaddingVertical),
    paddingSM: parseFloat(tooltipTokens.tooltipPaddingHorizontal),
  },

  // Adicione os demais componentes aqui conforme criar os arquivos SCSS
  // Card: { ... },
  // Checkbox: { ... },
  // etc.
};
