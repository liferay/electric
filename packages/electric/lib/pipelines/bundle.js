'use strict';

const gutil = require('gulp-util');
const path = require('path');
const through = require('through2');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

function bundle(options) {
	options = options || {};

	const entries = options.entryPoints || {};
	const modules = options.modules || ['node_modules'];
	const uglify = options.uglify || false;

	return through.obj(
		function(file, enc, cb) {
			if (file.isNull()) {
				return cb(null, file);
			}

			if (file.isBuffer()) {
				const name = path.basename(file.path, path.extname(file.path));

				entries[name] = file.path;
			}

			cb(null, file);
		},
		function(cb) {
			const plugins = [
				new webpack.optimize.DedupePlugin(),
				new webpack.optimize.CommonsChunkPlugin({
					filename: 'shared.electric.js',
					name: 'shared'
				})
			];

			if (uglify) {
				plugins.push(
					new UglifyJSPlugin({
						minimize: true
					})
				);

				gutil.log(
					'Uglifying bundle files for production. This might take a while...'
				);
			}

			webpack(
				{
					entry: entries,
					module: {
						rules: [
							{
								loader: path.join(__dirname, '../loader.js'),
								test: /\.soy$/
							},
							{
								exclude: [/node_modules/, /\.soy.js$/],
								loader: require.resolve('babel-loader'),
								options: {
									presets: [require.resolve('babel-preset-metal')]
								},
								test: /\.js$/
							}
						]
					},
					output: {
						filename: '[name].js',
						library: 'pageComponent',
						path: path.join(process.cwd(), options.dest, 'js', 'bundles')
					},
					plugins: plugins,
					resolve: {
						modules: modules
					}
				},
				function(err) {
					cb(err);
				}
			);
		}
	);
}

module.exports = bundle;
