import globals from 'globals';
import pluginImport from 'eslint-plugin-import';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      import: pluginImport,
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      'no-var': 'error',

      'no-console': 'off',
      'no-const-assign': 'error',
      'no-duplicate-imports': 'error',
      'no-await-in-loop': 'warn',

      'import/first': 'error',
      'import/newline-after-import': 'error',
    },
  },
];
