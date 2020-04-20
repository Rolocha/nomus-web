const path = require('path')

module.exports = {
  stories: ['../src/**/*.stories.(js|jsx|tsx)'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/preset-typescript',
  ],
  webpackFinal: async config => {
    // do mutation to the config
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve('./src'),
    ]
    return config
  },
}
