const path = require('path')
const webpackCommon = require('./webpack.common')

module.exports = {
  ...webpackCommon,
  mode: 'development',
  target: 'web',
  devServer: {
    contentBase: path.join(__dirname, '../public'),
    compress: true,
    host: '0.0.0.0',
    open: true,
    useLocalIp: true,
    hot: true,
    port: 4000,
    public: 'localhost:4000',
    historyApiFallback: true,
  },
  devtool: 'eval-source-map',
}
