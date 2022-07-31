import { ButlerColorPalette } from 'common/theme/color';

const fontSize = 14;
const fontWeightLight = 300;
const fontWeightRegular = 400;
const fontWeightMedium = 500;
const fontWeightBold = 700;
const fontFamily = 'Poppins;';
const defaultFontColor = ButlerColorPalette.text.primary;

export const ButlerTypography = {
  fontFamily: fontFamily,
  fontSize: fontSize,
  fontWeightLight: fontWeightLight,
  fontWeightRegular: fontWeightRegular,
  fontWeightMedium: fontWeightMedium,
  fontWeightBold: fontWeightBold,
  h1: {
    color: defaultFontColor,
    fontWeight: fontWeightLight,
    fontSize: 96,
    letterSpacing: '-1.5px',
  },
  h2: {
    color: defaultFontColor,
    fontWeight: fontWeightLight,
    fontSize: 60,
    letterSpacing: '-0.5px',
  },
  h3: {
    color: defaultFontColor,
    fontWeight: fontWeightRegular,
    fontSize: 48,
  },
  h4: {
    color: defaultFontColor,
    fontWeight: fontWeightRegular,
    fontSize: 34,
  },
  h5: {
    color: defaultFontColor,
    fontWeight: fontWeightRegular,
    fontSize: 24,
    letterSpacing: '0.18px',
  },
  h6: {
    color: defaultFontColor,
    fontWeight: fontWeightMedium,
    fontSize: 20,
    letterSpacing: '0.15px',
  },
  subtitle1: {
    color: defaultFontColor,
    fontWeight: fontWeightRegular,
    fontSize: 16,
    letterSpacing: '0.15px',
  },
  subtitle2: {
    color: defaultFontColor,
    fontWeight: fontWeightMedium,
    fontSize: 14,
    letterSpacing: '0.1px',
  },
  body1: {
    color: defaultFontColor,
    fontWeight: fontWeightRegular,
    fontSize: 16,
    letterSpacing: '0.5px',
  },
  body2: {
    color: defaultFontColor,
    fontWeight: fontWeightRegular,
    fontSize: 14,
    letterSpacing: '0.25px',
  },
  button: {
    color: defaultFontColor,
    fontWeight: fontWeightMedium,
    fontSize: 14,
    letterSpacing: '1.25px',
  },
  caption: {
    color: defaultFontColor,
    fontWeight: fontWeightRegular,
    fontSize: 12,
    letterSpacing: '0.4px',
  },
  overline: {
    color: defaultFontColor,
    fontWeight: fontWeightMedium,
    fontSize: 10,
    letterSpacing: '1.5px',
  },
};
