'use strict'
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin

module.exports = {
  entry: {
    main: './src',
    vendor: ['qs', 'c3', 'd3', 'axios', 'vue', 'vue-router']
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../build'),
    publicPath: 'build/'
  },
  module: {
    rules: [
      { test: /\.js$/,
        exclude: /node_modules/,
        options: { presets: ['es2015'] },
        loader: 'babel-loader' },
      { test: /\.html$/,
        loader: 'html-loader' },
      { test: /template\.pug$/,
        loader: 'vue-template-loader!pug-html-loader' },
      // { test: /\.jade$/,
      //   loader: 'vue-template!jade-html-loader' },
        // loader: 'pug-html-loader' },
      { test: /\.(woff|woff2)(\?.*)?$/,
        loader: 'url-loader?prefix=font/&limit=5000' },
      { test: /\.ttf(\?.*)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream' },
      { test: /\.svg(\?.*)?$/,
        loader: 'file-loader' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader' },
      { test: /\.less$/,
        use: ExtractTextPlugin.extract({ use: 'css-loader!less-loader' }) },
      { test: /\.css$/,
        use: ExtractTextPlugin.extract({ use: 'css-loader' }) }
    ]
  },
  resolve: {
    alias: {
      pages: path.resolve(__dirname, '../src/pages')
    }
  },
  plugins: [
    new ExtractTextPlugin('[name].bundle.css'),
    // new ContextReplacementPlugin(/moment[\/\\]locale$/, /en|zh/),
    new CommonsChunkPlugin(['vendor']),
    new webpack.DefinePlugin({
      '__DEBUG__': true
    })
    // new LoaderOptionsPlugin({
    //   minimize: true
    // })
  ],
  devtool: '#source-map',
  devServer: { inline: false }
}
