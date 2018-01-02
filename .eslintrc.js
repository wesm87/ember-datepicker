module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['prettier'],
  env: {
    browser: true,
  },
  rules: {
    'prefer-const': 'error',
    'prettier/prettier': ['error', {
      singleQuote: true,
      trailingComma: 'all',
    }],
  },
  overrides: [
    {
      files: 'tests/**/*.js',
      env: {
        node: true,
        embertest: true,
      },
    },
    {
      files: [
        'config/**/*.js',
        'ember-cli-build.js',
        'testem.js',
        'index.js',
      ],
      env: {
        node: true,
      },
    },
  ],
};
