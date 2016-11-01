'use strict';

var requireDir = require('require-dir');

var util = require('./util');

var registerTasks = function(options) {
	var gulp = options.gulp;

	options.util = util;

	var tasks = requireDir('./tasks');

	Object.keys(tasks).forEach(function(name, index) {
		tasks[name](options);
	});
};

module.exports = registerTasks;
