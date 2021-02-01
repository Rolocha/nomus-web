const path = require('path')
const webpackCommon = require('./webpack.common')

module.exports = {
  ...webpackCommon,
  mode: 'development',
  target: 'web',
  devServer: {
    contentBase: path.join(__dirname, '../build'),
    compress: true,
    port: 4000,
    historyApiFallback: true,
  },
  devtool: 'eval-source-map',
}
