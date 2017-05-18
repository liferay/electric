'use strict';

let gutil = require('gulp-util');
let path = require('path');
let through = require('through2');
let UglifyJSPlugin = require('uglifyjs-webpack-plugin');
let webpack = require('webpack');

function bundle(options) {
	options = options || {};

	let entries = options.entryPoints || {};
	let uglify = options.uglify || false;

	return through.obj(
		function(file, enc, cb) {
			if (file.isNull()) {
				return cb(null, file);
			}

			if (file.isBuffer()) {
				let name = path.basename(file.path, path.extname(file.path));

				entries[name] = file.path;
			}

			cb(null, file);
		},
		function(cb) {
			let plugins = [
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
					plugins: plugins
				},
				function(err) {
					cb(err);
				}
			);
		}
	);
}

module.exports = bundle;
