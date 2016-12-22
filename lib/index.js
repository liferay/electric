'use strict';

var requireDir = require('require-dir');

var normalizeOptions = require('./options');

var registerTasks = function(options) {
	options = normalizeOptions(options);

	var tasks = requireDir('./tasks');

	Object.keys(tasks).forEach(function(name) {
		tasks[name](options);
	});
};

module.exports.registerTasks = registerTasks;
