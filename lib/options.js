'use strict';

var util = require('./util');

var normalizeOptions = function(options) {
	options = options || {};

	options.buildDest = options.buildDest || 'dist';
	options.buildSrc = options.buildSrc || 'src';

	options.runSequence = require('run-sequence').use(gulp);
	options.util = util;

	return options;
};

module.exports = normalizeOptions;
