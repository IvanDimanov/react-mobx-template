const webpack = require('webpack')
const merge = require('webpack-merge')

const common = require('./webpack.config.common')
const getEnv = require('./getEnv')

module.exports = merge(common, {
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      ecma: 8,
      compress: {
        warnings: false
      }
    }),

    new webpack.DefinePlugin({
      'process.env': getEnv()
    })
  ]
})
