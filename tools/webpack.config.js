'use strict'
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin

module.exports = {
  entry: {
    main: './index.js',
    vendor: ['qs', 'c3', 'd3', 'axios', 'vue', 'vue-router']
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../build'),
    publicPath: '/build'
  },
  module: {
    rules: [
      { test: /\.js$/,
        exclude: /node_modules/,
        options: { presets: ['es2015'] },
        loader: 'babel-loader' },
      { test: /\.html$/,
        loader: 'html-loader' },
      { test: /\.pug$/,
        loader: 'vue-template!pug-html-loader' },
      { test: /\.(woff|woff2)(\?.*)?$/,
        loader: 'url?prefix=font/&limit=5000' },
      { test: /\.ttf(\?.*)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream' },
      { test: /\.svg(\?.*)?$/,
        loader: 'file' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file' },
      { test: /\.css$/,
        use: ExtractTextPlugin.extract({ use: 'css-loader' }) }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].bundle.css'),
    // new ContextReplacementPlugin(/moment[\/\\]locale$/, /en|zh/),
    new CommonsChunkPlugin(['vendor'])
    // new LoaderOptionsPlugin({
    //   minimize: true
    // })
  ],
  devtool: '#source-map',
  devServer: { inline: false }
}
