import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    '@mui/material',
    '@mui/x-charts',
    '@mui/x-charts-pro',
    '@mui/x-data-grid-pro',
    '@mui/x-tree-view',
    '@emotion/react',
    '@emotion/styled',
    '@emotion/cache',
  ],
});
