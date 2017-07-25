'use strict';

let _ = require('lodash');
let fs = require('fs');
let gutil = require('gulp-util');
let path = require('path');

let util = require('./util');

function applyConfigFile(options) {
	let filePath = path.join(process.cwd(), 'electric.config.js');

	if (fs.existsSync(filePath)) {
		let config = require(filePath);

		if (_.isFunction(config)) {
			options = config(options);
		} else if (_.isObject(config)) {
			options = _.assign(options, config);
		} else {
			throw new gutil.PluginError({
				plugin: 'electric',
				message: 'electric.config.js file must export a function or object.'
			});
		}

		gutil.log('Using electric.config.js:', gutil.colors.cyan(filePath));
	}

	return options;
}

function normalizeOptions(options) {
	options = options || {};

	options = applyConfigFile(options);

	options.codeMirrorLanguages = options.codeMirrorLanguages || [
		'xml',
		'css',
		'javascript'
	];
	options.codeMirrorTheme = options.codeMirrorTheme || 'dracula';
	options.debug = options.debug || false;
	options.deployOptions = _.assign(
		{
			branch: 'wedeploy',
			cacheDir: '.deploy'
		},
		options.deployOptions
	);
	options.markdownOptions = options.markdownOptions;
	options.metalComponents = options.metalComponents || [
		'electric-marble-components'
	];
	options.pathDest = options.pathDest || 'dist';
	options.pathSrc = options.pathSrc || 'src';
	options.plugins = options.plugins || [];
	options.port = options.port || 8888;
	options.rss = _.assign({enabled: false}, options.rss);
	options.taskPrefix = options.taskPrefix || '';
	options.uglifyBundle = options.uglifyBundle || false;
	options.vendorSrc = options.vendorSrc || [];

	if (!options.staticSrc) {
		let pathSrc = options.pathSrc;
		let ignoreDirs = ['components', 'layouts', 'pages', 'partials', 'styles'];

		let ignoreGlob = path.join(
			'!' + pathSrc,
			'+(' + ignoreDirs.join('|') + ')/'
		);

		options.staticSrc = options.staticSrc || [
			path.join(pathSrc, '**/*'),
			path.join('!' + pathSrc, 'site.json'),
			ignoreGlob,
			path.join(ignoreGlob, '**/*')
		];
	}

	options.runSequence = require('run-sequence').use(options.gulp);
	options.util = util;

	return options;
}

module.exports = normalizeOptions;
