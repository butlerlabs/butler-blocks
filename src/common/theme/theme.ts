import { createMuiTheme } from '@material-ui/core/styles';
import { ButlerColorPalette } from 'common/theme/color';
import { ButlerTypography } from 'common/theme/font';

/**
 * Can use the material-ui theme editor: https://material.io/resources/color
 */
export const ButlerTheme = createMuiTheme({
  palette: {
    primary: ButlerColorPalette.primary,
    secondary: ButlerColorPalette.secondary,
    error: ButlerColorPalette.error,
    warning: ButlerColorPalette.warning,
    success: ButlerColorPalette.success,
    text: ButlerColorPalette.text,
    divider: ButlerColorPalette.common.divider,
    background: ButlerColorPalette.background,
    icon: ButlerColorPalette.icon,
    brand: ButlerColorPalette.brand,
    common: ButlerColorPalette.common,
  },
  typography: ButlerTypography,
  overrides: {
    MuiTableCell: {
      // NOTE: This is temporary. We will override this in the BTableHeader
      // component as to avoid having to do this globally
      stickyHeader: {
        backgroundColor: ButlerColorPalette.background.paper,
      },
    },
  },
  props: {
    MuiSvgIcon: {
      htmlColor: ButlerColorPalette.icon.default,
    },
  },
});
