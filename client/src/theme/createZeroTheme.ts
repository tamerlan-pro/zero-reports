import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-charts-pro/themeAugmentation';
import type {} from '@mui/x-data-grid-pro/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';
import type { ThemeOptions } from '@mui/material/styles';
import { heroui } from './tokens/colors.ts';
import { palette } from './palette.ts';
import { typography } from './typography.ts';
import { custom } from './custom.ts';
import { buttonComponents } from './components/buttons.ts';
import { surfaceComponents } from './components/surfaces.ts';
import { inputComponents } from './components/inputs.ts';
import { feedbackComponents } from './components/feedback.ts';
import { navigationComponents } from './components/navigation.ts';
import { dataDisplayComponents } from './components/dataDisplay.ts';
import { chartComponents } from './components/charts.ts';
import { dataGridComponents } from './components/dataGrid.ts';

export interface ZeroThemeConfig {
  overrides?: ThemeOptions;
}

export function createZeroTheme(config: ZeroThemeConfig = {}) {
  const { overrides = {} } = config;

  return createTheme(
    {
      cssVariables: {
        colorSchemeSelector: 'data-mui-color-scheme',
      },
      defaultColorScheme: 'dark',
      colorSchemes: {
        dark: {
          palette,
        },
      },
      heroui,
      custom,
      typography,
      shape: {
        borderRadius: heroui.radius.medium,
      },
      components: {
        ...feedbackComponents,
        ...buttonComponents,
        ...surfaceComponents,
        ...inputComponents,
        ...navigationComponents,
        ...dataDisplayComponents,
        ...chartComponents,
        ...dataGridComponents,
      },
    },
    overrides,
  );
}
