const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const DashboardPlugin = require('webpack-dashboard/plugin')

module.exports = {
	context: path.resolve(__dirname, './src'),
	entry: ['./js/app.js', './sass/app.scss'],
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'bundle.js',
		publicPath: '/wp-content/themes/cg-nn-theme/dist/'
	},
	externals: {
		foundation: 'foundation-sites',
		slick: 'slick-carousel',
		fontawesome: 'fontawesome'
	},
	resolve: {
		modules: [path.resolve(__dirname, './src'), 'node_modules']
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: [/node_modules/],
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['es2015']
						}
					}
				]
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'resolve-url-loader', 'sass-loader?sourceMap']
				})
			},
			{
				test: [/\.(svg|png|jpg|gif)$/],
				loader: 'file-loader',
				options: {
					name: 'img/[name].[ext]'
				}
			},
			{
				test: [/\.(ttf|eot|woff|woff2)$/],
				loader: 'file-loader',
				options: {
					name: 'fonts/[name].[ext]'
				}
			}
		]
	},
	plugins: [new ExtractTextPlugin('css/app.css')]
	// devServer: {
	// 	contentBase: path.resolve(__dirname, './static')
	// }
}

// WIP https://github.com/JonathanMH/webpack-scss-sass-file
