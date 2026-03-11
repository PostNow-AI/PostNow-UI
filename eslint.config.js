import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Allow @ts-nocheck, @ts-ignore, @ts-expect-error with description
      '@typescript-eslint/ban-ts-comment': ['error', {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': 'allow-with-description',
        'ts-nocheck': 'allow-with-description',
        'ts-check': false,
        minimumDescriptionLength: 3,
      }],
      // Allow unused vars if prefixed with _
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
      // Warn instead of error for explicit any (gradual migration)
      '@typescript-eslint/no-explicit-any': 'warn',
      // Allow exports alongside components (common pattern)
      'react-refresh/only-export-components': ['warn', {
        allowConstantExport: true,
        allowExportNames: ['meta', 'links', 'headers', 'loader', 'action'],
      }],
      // Warn for missing deps instead of error (can cause infinite loops if blindly fixed)
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
])
