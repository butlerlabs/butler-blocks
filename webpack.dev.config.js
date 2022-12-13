const commonWebpackConfig = require('./webpack.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	...commonWebpackConfig,
  mode: 'development',
  entry: './index.js',
  devServer: {
    static: './',
		hot: true,
  },
	plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      chunks: ['main']
    }),  
  ],
}
