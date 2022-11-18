const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const path = require("path");
const webpack = require('webpack');


module.exports = {
  mode: "development",
  entry: {'app.js':'./src/app.js'},
  output: {
      filename: "[name]",
      path: path.join(__dirname, "dist"),
      publicPath: '/',
      library: "BASEVUEAPP",
      libraryExport: 'default'
  },
  watchOptions: {
    poll: true,
    ignored: /node_modules/
  },
  devServer: {
		port: 8080,
		contentBase: path.resolve('dist'),
		hot: false,
		https: true,
		host: 'localhost',
		inline: true,
		disableHostCheck: true
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
    }),
    new webpack.DefinePlugin({
			assetPath: JSON.stringify("https://localhost:8080/img/")
		})
  ]
};
  