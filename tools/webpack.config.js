'use strict'
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin

module.exports = {
  entry: {
    main: './src',
    vendor: ['axios', 'vue', 'vue-router', 'chart.js', 'moment', 'bootstrap/less/bootstrap.less']
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../build'),
    publicPath: '/admin/build'
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
      { test: /\.(png|jpe?g|gif|svg|eot|ttf|woff2?)$/,
        loader: 'url-loader',
        options: {limit: 1000}
      },
      // { test: /\.jade$/,
      //   loader: 'vue-template!jade-html-loader' },
        // loader: 'pug-html-loader' },
      // { test: /\.(woff|woff2)(\?.*)?$/,
      //   loader: 'url-loader?prefix=font/&limit=5000' },
      // { test: /\.ttf(\?.*)?$/,
      //   loader: 'url-loader?limit=10000&mimetype=application/octet-stream' },
      // { test: /\.svg(\?.*)?$/,
      //   loader: 'file-loader' },
      // { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      //   loader: 'file-loader' },
      { test: /\.less$/,
        use: ExtractTextPlugin.extract({ use: 'css-loader!less-loader', fallback: 'style-loader' }) },
      { test: /\.styl$/,
        use: ExtractTextPlugin.extract({ use: 'css-loader!stylus-loader', fallback: 'style-loader' }) },
      { test: /\.css$/,
        use: ExtractTextPlugin.extract({ use: 'css-loader', fallback: 'style-loader' }) }
    ]
  },
  resolve: {
    alias: {
      pages: path.resolve(__dirname, '../src/pages'),
      assets: path.resolve(__dirname, '../assets')
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
