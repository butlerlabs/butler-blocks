const commonWebpackConfig = require("./webpack.config.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  ...commonWebpackConfig,
  mode: "development",
  entry: "./client/client.js",
  devServer: {
    static: "./client",
    hot: true,
  },
  plugins: [
    ...commonWebpackConfig.plugins,
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./client/index.html",
      chunks: ["main"],
    }),
  ],
};
