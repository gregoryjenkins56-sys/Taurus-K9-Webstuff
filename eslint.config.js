import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['server/worker/**/*.ts', 'portal/js/*.js', 'tests/fixtures/*.js', 'tests/portal.spec.js'],
    languageOptions: { globals: globals.browser }
  },
  {
    files: ['scripts/**/*.mjs', 'tests/*.js', 'playwright.config.js'],
    languageOptions: { globals: globals.node }
  },
  { rules: { 'no-unused-vars': 'off', '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }] } }
];
