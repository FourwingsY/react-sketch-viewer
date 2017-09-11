'use strict';
const fs = require('fs')
const path = require('path')

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const projectRoot = fs.realpathSync(process.cwd())
const resolve = relativePath => path.resolve(projectRoot, relativePath)

module.exports = {
	devtool: 'cheap-module-source-map',
	entry: resolve('src/index.js'),
	cache: true,
	output: {
		path: resolve('public'),
		pathinfo: true,
		filename: 'dist.[name].js',
		publicPath: './',
	},
	resolve: {
		modules: ['node_modules'],
		extensions: ['.js', '.json'],
	},
	module: {
		rules: [
			{
				exclude: [
					/\.html$/,
					/\.js$/,
					/\.css$/,
				],
				loader: require.resolve('file-loader'),
			},
			{
				test: /\.js$/,
				include: resolve('src'),
				loader: require.resolve('babel-loader'),
				options: {
					cacheDirectory: true,
				},
			},
			{
				test: /\.css$/,
				loader: require.resolve('css-loader'),
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			inject: true,
			template: resolve('static/index.html'),
		}),
		new webpack.HotModuleReplacementPlugin(),
	],
}
