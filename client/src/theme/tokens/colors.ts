// HeroUI Dark Colors — full palette from Figma Kit
// https://www.figma.com/design/b0WNgdIvU6J0ZjcCBg4wzV — node 276:20189

export type ColorScale = {
  50: string; 100: string; 200: string; 300: string; 400: string;
  500: string; 600: string; 700: string; 800: string; 900: string;
};

export interface HeroUIColors {
  layout: {
    background: string;
    foreground: string;
    divider: string;
    focus: string;
    appBarHeight: number;
  };
  content: { 1: string; 2: string; 3: string; 4: string };
  spacing: HeroUISpacingNamed;
  radius: HeroUIRadius;
  typography: HeroUITypography;
  shadows: HeroUIShadows;
  transitions: HeroUITransitions;
  default: ColorScale;
  primary: ColorScale;
  secondary: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  danger: ColorScale;
}

export interface HeroUISpacingNamed {
  xs: number; sm: number; md: number; lg: number; xl: number;
  '2xl': number; '3xl': number; '4xl': number; '5xl': number;
  '6xl': number; '7xl': number; '8xl': number; '9xl': number;
}

export interface HeroUIRadius {
  small: number;
  medium: number;
  large: number;
  full: number;
}

export interface HeroUITypographyToken {
  fontSize: string;
  lineHeight: string;
}

export interface HeroUITypography {
  fontFamily: string;
  tiny: HeroUITypographyToken;
  small: HeroUITypographyToken;
  medium: HeroUITypographyToken;
  large: HeroUITypographyToken;
}

export interface HeroUIShadows {
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
}

export interface HeroUITransitions {
  fast: string;
  normal: string;
  slow: string;
  easing: {
    standard: string;
    easeOut: string;
    easeInOut: string;
  };
  duration: {
    fast: number;
    normal: number;
    slow: number;
  };
}

export const heroui: HeroUIColors = {
  layout: {
    background: '#000000',
    foreground: '#ECEDEE',
    divider: 'rgba(255,255,255,0.15)',
    focus: '#006FEE',
    appBarHeight: 48,
  },
  content: {
    1: '#18181B',
    2: '#27272A',
    3: '#3F3F46',
    4: '#52525B',
  },
  spacing: {
    xs: 8, sm: 12, md: 16, lg: 22, xl: 36,
    '2xl': 48, '3xl': 80, '4xl': 120, '5xl': 224,
    '6xl': 288, '7xl': 384, '8xl': 512, '9xl': 640,
  },
  radius: { small: 8, medium: 12, large: 14, full: 9999 },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    tiny:   { fontSize: '0.75rem',  lineHeight: '1rem' },
    small:  { fontSize: '0.875rem', lineHeight: '1.25rem' },
    medium: { fontSize: '1rem',     lineHeight: '1.5rem' },
    large:  { fontSize: '1.125rem', lineHeight: '1.75rem' },
  },
  shadows: {
    sm:    '0px 1px 2px 0px rgba(0,0,0,0.05)',
    base:  '0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)',
    md:    '0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -2px rgba(0,0,0,0.1)',
    lg:    '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)',
    xl:    '0px 20px 25px -5px rgba(0,0,0,0.1), 0px 8px 10px -6px rgba(0,0,0,0.1)',
    '2xl': '0px 25px 50px -12px rgba(0,0,0,0.25)',
    inner: 'inset 0px 2px 4px 0px rgba(0,0,0,0.05)',
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '200ms ease',
    slow: '300ms ease-in-out',
    easing: {
      standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'ease',
      easeInOut: 'ease-in-out',
    },
    duration: {
      fast: 150,
      normal: 200,
      slow: 300,
    },
  },
  default: {
    50:  '#18181B', 100: '#27272A', 200: '#3F3F46', 300: '#52525B', 400: '#71717A',
    500: '#A1A1AA', 600: '#D4D4D8', 700: '#E4E4E7', 800: '#F4F4F5', 900: '#FAFAFA',
  },
  primary: {
    50:  '#001731', 100: '#002E62', 200: '#004493', 300: '#005BC4', 400: '#006FEE',
    500: '#338EF7', 600: '#66AAF9', 700: '#99C7FB', 800: '#CCE3FD', 900: '#E6F1FE',
  },
  secondary: {
    50:  '#180828', 100: '#301050', 200: '#481878', 300: '#6020A0', 400: '#7828C8',
    500: '#9353D3', 600: '#AE7EDE', 700: '#C9A9E9', 800: '#E4D4F4', 900: '#F2EAFA',
  },
  success: {
    50:  '#052814', 100: '#095028', 200: '#0E793C', 300: '#12A150', 400: '#17C964',
    500: '#45D483', 600: '#74DFA2', 700: '#A2E9C1', 800: '#D1F4E0', 900: '#E8FAF0',
  },
  warning: {
    50:  '#312107', 100: '#62420E', 200: '#936316', 300: '#C4841D', 400: '#F5A524',
    500: '#F7B750', 600: '#F9C97C', 700: '#FBDBA7', 800: '#FDEDD3', 900: '#FEFCE8',
  },
  danger: {
    50:  '#310413', 100: '#610726', 200: '#920B3A', 300: '#C20E4D', 400: '#F31260',
    500: '#F54180', 600: '#F871A0', 700: '#FAA0BF', 800: '#FDD0DF', 900: '#FEE7EF',
  },
};
