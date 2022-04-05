// webpack.config.js
const path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  resolve: {
    extensions: ['.ts', 'tsx', '.js']
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.(tsx?)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        exclude: [
          [
            path.resolve(__dirname, '.serverless'),
            path.resolve(__dirname, '.webpack'),
          ],
        ],
      },
    ],
  },
};