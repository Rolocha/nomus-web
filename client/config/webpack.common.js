// webpack.common.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const PATHS = {
  src: path.resolve(__dirname, '../src'),
  build: path.resolve(__dirname, '../build'),
  public: path.resolve(__dirname, '../public'),
}

module.exports = {
  entry: path.resolve(PATHS.src, 'index.tsx'),
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        include: PATHS.src,
        loader: require.resolve('babel-loader'),
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  resolve: {
    modules: [PATHS.src, 'node_modules'],
    extensions: ['.tsx', '.ts', '.wasm', '.mjs', '.js', '.jsx', '.json'],
    alias: {
      src: PATHS.src,
    },
  },
  output: {
    filename: 'bundle.[fullhash].js',
    path: PATHS.build,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(PATHS.public, 'index.html'),
    }),
  ],
}
