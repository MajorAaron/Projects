const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const path = require("path");


module.exports = {
  mode: "production",
  entry: {'app.min.js': './src/app.js'},
  output: {
      filename: "[name]",
      path: path.join(__dirname, "dist"),
      publicPath: '/',
      library: "BASEVUEAPP",
      libraryExport: 'default'
  },
  module: {
    rules: [    
      { test: /\.js$/, use: 'babel-loader' },
      { test: /\.vue$/, use: 'vue-loader' },
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader']},
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
        filename: 'styles.css'
    })
  ]
};
  