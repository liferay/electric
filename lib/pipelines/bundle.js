'use strict';

var gutil = require('gulp-util');
var path = require('path');
var through = require('through2');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var webpack = require('webpack');

function bundle(options) {
	options = options || {};

	var entries = options.entryPoints || {};
	var uglify = options.uglify || false;

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
			new webpack.optimize.CommonsChunkPlugin({
				filename: 'shared.electric.js',
				name: 'shared'
			})
		];

		if (uglify) {
			plugins.push(new UglifyJSPlugin({
				minimize: true
			}));

			gutil.log('Uglifying bundle files for production. This might take a while...');
		}

		webpack({
			entry: entries,
			module: {
				rules: [
					{
						test: /\.soy$/,
						loader: path.join(__dirname, '../loader.js')
					},
					{
						test: /\.js$/,
						exclude: /node_modules/,
						loader: require.resolve('babel-loader'),
						options: {
							presets: [require.resolve('babel-preset-metal')]
						}
					}
				]
			},
			output: {
				filename: '[name].js',
				library: 'pageComponent',
				path: path.join(process.cwd(), options.dest, 'js', 'bundles')
			},
			plugins: plugins
		}, function(err) {
			cb(err);
		});
	});
}

module.exports = bundle;