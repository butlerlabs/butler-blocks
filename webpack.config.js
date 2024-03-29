const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  entry: './src/butlerBlocks.tsx',
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'butlerBlocks.js',
    library: 'ButlerBlocks',
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true,
  },
  devServer: {
    static: './dist',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.(woff|woff2)$/,
        loader: 'base64-inline-loader',
        type: 'javascript/auto',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new ESLintPlugin({ extensions: ['js', 'jsx', 'ts', 'tsx'], quiet: true }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
};
