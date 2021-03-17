const projectWebpack = require('../config/webpack.common.js')

module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    {
      name: '@storybook/addon-storysource',
      options: {
        loaderOptions: {
          parser: 'typescript',
          prettierConfig: {
            singleQuote: true,
            semi: false,
            printWidth: 80,
            tabWidth: 2,
            arrowParens: 'always',
            trailingComma: 'all',
            bracketSpacing: true,
          },
        },
      },
    },
  ],
  webpackFinal: async (config) => {
    // Configure module resolution/aliases to match project settings so relative imports work
    config.resolve.modules = projectWebpack.resolve.modules
    config.resolve.alias = projectWebpack.resolve.alias

    return config
  },
}
