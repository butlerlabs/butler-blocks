const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
mode: 'development',
entry: './index.jsx',
devtool: 'inline-source-map',
output: {
path: path.join(__dirname, '/dist'),
filename: 'bundle.js'
},
devtool: 'inline-source-map',
devServer: {
static: './dist',
},
module: {
rules: [
{
test: /\.jsx?$/,
exclude: /node_modules/,
loader: 'babel-loader'
},
]
},
resolve: {
extensions: ['.jsx', '.ts', '.js'],
},
plugins:[
new HtmlWebpackPlugin({
template: './index.html'
})
]
}
