// webpack.common.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

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
    publicPath: '/',
  },
  plugins: [
    new CleanWebpackPlugin(),
    // Load the index.html template file
    new HtmlWebpackPlugin({
      template: path.resolve(PATHS.src, 'index.html'),
    }),
    // Copy everything in the public folder to be publicly accessible
    new CopyWebpackPlugin({
      patterns: [
        {
          from: PATHS.public,
          globOptions: {
            // Ignoring index.html since HtmlWebpackPlugin handles it
            ignore: ['index.html'],
          },
        },
      ],
    }),
  ],
}
