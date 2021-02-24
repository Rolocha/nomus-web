module.exports = {
  extends: 'react-app',
  plugins: ['@emotion'],
  rules: {
    camelcase: [
      2,
      {
        properties: 'always',
      },
    ],
    '@emotion/pkg-renaming': 'error',
    'react/react-in-jsx-scope': 'off',
  },
}
