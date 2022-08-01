import '@material-ui/core/styles';

// Extends the Palette interface imported from material UI
// To allow for custom color sections to be defined.
declare module '@material-ui/core/styles/createPalette' {
  interface TypeBackground {
    secondary: string;
    dark: string;
    light: string;
  }
  interface Palette {
    icon: Palette['background'];
    brand: Palette['primary'];
  }
  interface PaletteOptions {
    icon: PaletteOptions['background'];
    brand: PaletteOptions['primary'];
  }

  interface PaletteColor {
    teal?: string;
  }

  interface SimplePaletteColorOptions {
    teal?: string;
  }
}
