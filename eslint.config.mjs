// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tailwind from 'eslint-plugin-tailwindcss';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  ...tailwind.configs['flat/recommended'],
  {
    settings: {
      tailwindcss: {
        // Allow intentional component class names managed by JavaScript
        whitelist: [
          'active',
          'back',
          'back-link',
          'code-container',
          'cta',
          'description',
          'diagram-container',
          'diagram-wrapper',
          'example-btn',
          'examples',
          'future',
          'mermaid',
          'past',
          'positions-container',
          'present',
          'reveal',
          'slides',
          'slide',
          'tab-btn',
          'tab-panel',
          'tabs',
          'view-btn',
          'view-toggle',
          'zoom-btn',
          'zoom-controls',
          'zoom-hint',
        ],
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
