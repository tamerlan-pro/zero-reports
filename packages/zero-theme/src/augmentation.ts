import type { HeroUIColors } from './tokens/colors.ts';
import type { ZeroCustomTokens } from './types.ts';

declare module '@mui/material/Alert' {
  interface AlertPropsColorOverrides {
    secondary: true;
    default: true;
  }
}

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    interactive: true;
    metric: true;
  }
}

declare module '@mui/material/styles' {
  interface Palette {
    surface: {
      level1: string;
      level2: string;
      level3: string;
      level4: string;
      level5: string;
      level6: string;
      level7: string;
    };
  }
  interface PaletteOptions {
    surface?: {
      level1?: string;
      level2?: string;
      level3?: string;
      level4?: string;
      level5?: string;
      level6?: string;
      level7?: string;
    };
  }
  interface TypeText {
    caption: string;
  }
  interface Theme {
    heroui: HeroUIColors;
    custom: ZeroCustomTokens;
  }
  interface ThemeOptions {
    heroui?: HeroUIColors;
    custom?: Partial<ZeroCustomTokens>;
  }
}

export {};
