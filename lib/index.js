'use strict';

var requireDir = require('require-dir');

var util = require('./util');
var normalizeOptions = require('./options');

var registerTasks = function(options) {
	options = normalizeOptions(options);

	var gulp = options.gulp;

	var tasks = requireDir('./tasks');

	Object.keys(tasks).forEach(function(name, index) {
		tasks[name](options);
	});
};

module.exports.registerTasks = registerTasks;
