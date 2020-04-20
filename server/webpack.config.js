const path = require('path')
const NodemonPlugin = require('nodemon-webpack-plugin')
const WebpackModules = require('webpack-modules')

module.exports = {
  entry: './src/index.ts',
  target: 'node',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: {
          loader: 'ts-loader',
        },
        exclude: /node_modules/,
      },
      {
        test: /\.graphql$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
    ],
  },
  resolve: {
    modules: [path.resolve(__dirname, './'), 'node_modules'],
    extensions: ['.js', '.json', '.tsx', '.ts'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new NodemonPlugin({
      nodeArgs: ['--inspect=9222', '-r', 'source-map-support/register'],
    }),
    new WebpackModules(),
  ],
  node: {
    dns: 'empty',
    tls: 'empty',
    fs: 'empty',
    net: 'empty',
    module: 'empty',
  },
}
