import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

/** Custom rule: ban hardcoded color values in component/page files. */
const noHardcodedColors = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Disallow hardcoded hex colors and rgba() in component files. Use theme tokens instead.' },
    messages: {
      noHex: 'Avoid hardcoded hex color "{{value}}". Use a theme token (e.g. theme.heroui.primary[400]).',
      noRgba: 'Avoid hardcoded rgba()/rgb() color. Use a theme token instead.',
    },
    schema: [],
  },
  create(context) {
    const filename = context.filename ?? context.getFilename?.() ?? ''
    // Only enforce in components and pages — theme tokens are authoritative
    const isComponent = /src\/(components|pages)/.test(filename)
    if (!isComponent) return {}

    const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/
    const RGBA_RE = /rgba?\s*\(/

    return {
      Literal(node) {
        if (typeof node.value === 'string' && HEX_RE.test(node.value.trim())) {
          context.report({ node, messageId: 'noHex', data: { value: node.value } })
        }
      },
      TemplateElement(node) {
        const raw = node.value?.raw ?? ''
        if (HEX_RE.test(raw.trim())) {
          context.report({ node, messageId: 'noHex', data: { value: raw.trim() } })
        }
        if (RGBA_RE.test(raw)) {
          context.report({ node, messageId: 'noRgba' })
        }
      },
    }
  },
}

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'zero-theme': { rules: { 'no-hardcoded-colors': noHardcodedColors } },
    },
    rules: {
      // Enforce theme-token usage — no raw color literals in components/pages
      'zero-theme/no-hardcoded-colors': 'warn',

      // Inline style objects obscure theming; encourage sx prop / theme overrides
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'JSXAttribute[name.name="style"][value.type="JSXExpressionContainer"]',
          message: 'Avoid inline style={{}}. Move styles to the MUI theme or sx prop.',
        },
      ],

      // Explicit `any` undermines type safety that the augmentation layer provides
      '@typescript-eslint/no-explicit-any': 'error',

      // Allow files that export both a component and a custom hook (e.g. AppLayout + useAppLayout)
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
])
