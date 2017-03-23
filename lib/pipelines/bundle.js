'use strict';

var path = require('path');
var through = require('through2');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var webpack = require('webpack');

function bundle(options) {
	options = options || {};

	var entries = {};

	return through.obj(function(file, enc, cb) {
		if (file.isNull()) {
			return cb(null, file);
		}

		if (file.isBuffer()) {
			var name = path.basename(file.path, path.extname(file.path));

			entries[name] = file.path;
		}

		cb(null, file);
	}, function(cb) {
		var plugins = [
			new webpack.optimize.DedupePlugin(),
			new webpack.optimize.CommonsChunkPlugin(
				{
					filename: 'shared.electric.js',
					name: 'shared'
				}
			),
			new UglifyJSPlugin(
				{
					minimize: true
				}
			)
		];

		webpack({
			entry: entries,
			module: {
				rules: [
					{
						test: /\.soy$/,
						loader: path.join(__dirname, '../loader.js')
					}
				]
			},
			output: {
				filename: '[name].js',
				library: 'pageComponent',
				path: path.join(options.dest, 'js', 'bundles')
			},
			plugins: plugins,
			resolve: {
				mainFields: ['jsnext:main', 'module', 'main']
			}
		}, function(err) {
			cb(err);
		});
	});
}

module.exports = bundle;