// @ts-check
import eslint from '@eslint/js'
import pluginRouter from '@tanstack/eslint-plugin-router'
import configPrettier from 'eslint-config-prettier'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  eslint.configs.recommended,
  // typescript-eslint v8 推奨形: ts/tsx に対象を絞ったうえで spread する
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
  })),
  {
    files: ['scripts/**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  // React / React Hooks / TanStack Router の flat config は files 未指定なので
  // ts/tsx に絞る (eslint-plugin-react README "shareable configs does not
  // preconfigure files" に倣う)。
  { ...reactPlugin.configs.flat.recommended, files: ['**/*.{ts,tsx}'] },
  { ...reactPlugin.configs.flat['jsx-runtime'], files: ['**/*.{ts,tsx}'] },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // TypeScript の型チェックが prop-types の代替となるため無効化
      'react/prop-types': 'off',
    },
  },
  { ...reactHooks.configs.flat.recommended, files: ['**/*.{ts,tsx}'] },
  ...pluginRouter.configs['flat/recommended'].map((c) => ({
    ...c,
    files: ['**/*.{ts,tsx}'],
  })),
  // Prettier と競合するルールを無効化 (最後に置く)
  configPrettier,
  {
    // 自動生成・ビルド成果物・vendor 系。.gitignore / .prettierignore とほぼ同じものを 3 箇所で同期している。
    ignores: [
      'src/routeTree.gen.ts',
      'worker-configuration.d.ts',
      'dist/**/*',
      '.output/**/*',
      '.wrangler/**/*',
      '.vite/**/*',
      '.tanstack/**/*',
    ],
  },
])
