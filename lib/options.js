'use strict';

var _ = require('lodash');
var fs = require('fs');
var gutil = require('gulp-util');
var path = require('path');

var util = require('./util');

function applyConfigFile(options) {
	var filePath = path.join(process.cwd(), 'electric.config.js');

	if (fs.existsSync(filePath)) {
		var config = require(filePath);

		options = _.assign(options, config);

		gutil.log('Using electric.config.js:', gutil.colors.cyan(filePath));
	}

	return options;
}

function normalizeOptions(options) {
	options = options || {};

	options = applyConfigFile(options);

	options.codeMirrorLanguages = options.codeMirrorLanguages || ['xml', 'css', 'javascript'];
	options.codeMirrorTheme = options.codeMirrorTheme || 'dracula';
	options.markdownOptions = options.markdownOptions;
	options.pathDest = options.pathDest || 'dist';
	options.pathSrc = options.pathSrc || 'src';
	options.plugins = options.plugins || ['electric-marble-components'];
	options.taskPrefix = options.taskPrefix || '';
	options.vendorSrc = options.vendorSrc || [];

	var electricComponentsIndex = options.plugins.indexOf('electric-components');

	if (electricComponentsIndex > -1) {
		options.plugins.splice(electricComponentsIndex, 1, 'electric-marble-components');

		gutil.log(
			gutil.colors.yellow('Warning:'),
			gutil.colors.cyan('electric-components'),
			'is deprecated. Switch to',
			gutil.colors.cyan('electric-marble-components'),
			'in your project\'s',
			gutil.colors.cyan('gulpfile.js')
		);
	}

	options.runSequence = require('run-sequence').use(options.gulp);
	options.util = util;

	return options;
}

module.exports = normalizeOptions;
