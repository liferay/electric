'use strict';

let requireDir = require('require-dir');

let normalizeOptions = require('./options');
let registerPlugins = require('./registerPlugins');

let registerTasks = function(options) {
	options = normalizeOptions(options);

	registerPlugins(options);

	let tasks = requireDir('./tasks');

	Object.keys(tasks).forEach(function(name) {
		tasks[name](options);
	});
};

module.exports.registerTasks = registerTasks;
