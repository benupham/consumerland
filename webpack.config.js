const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  mode: 'production',
  devServer: {
    host: 'localhost',
    contentBase: './src',
    port: 3010,
    proxy: [
      {
        context: ['/omnibox','/api', '/products'],
        target: 'http://localhost:8080'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
  })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'}
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'url-loader'
        ]
      }
    ]
  },
};
