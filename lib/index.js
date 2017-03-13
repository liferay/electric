'use strict';

var requireDir = require('require-dir');

var normalizeOptions = require('./options');
var registerPlugins = require('./registerPlugins');

var registerTasks = function(options) {
	options = normalizeOptions(options);

	registerPlugins(options);

	var tasks = requireDir('./tasks');

	Object.keys(tasks).forEach(function(name) {
		tasks[name](options);
	});
};

module.exports.registerTasks = registerTasks;
