const path = require('path')

module.exports = {
  stories: ['../src/**/*.stories.(js|jsx|tsx)'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/preset-typescript',
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
    // do mutation to the config
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve('./'),
    ]
    config.module.rules[0].use[0].options.presets = [
      require.resolve('@babel/preset-react'),
      require.resolve('@babel/preset-env'),
      // Emotion preset must run BEFORE reacts preset to properly convert css-prop.
      // Babel preset-ordering runs reversed (from last to first). Emotion has to be after React preset.
      require.resolve('@emotion/babel-preset-css-prop'),
    ]
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve('babel-loader'),
      options: {
        presets: [
          ['react-app', { flow: false, typescript: true }],
          // Emotion preset must run BEFORE reacts preset to properly convert css-prop.
          // Babel preset-ordering runs reversed (from last to first). Emotion has to be after React preset.
          require.resolve('@emotion/babel-preset-css-prop'),
        ],
        // other plugins here...
      },
    })

    return config
  },
}
