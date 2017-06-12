'use strict';

let path = require('path');
let requireDirectory = require('require-directory');

let normalizeOptions = require('./options');
let registerPlugins = require('./registerPlugins');

let registerTasks = function(options) {
	options = normalizeOptions(options);

	registerPlugins(options);

	let tasks = requireDirectory(module, path.join(__dirname, 'tasks'), {
		recurse: false
	});

	Object.keys(tasks).forEach(function(name) {
		tasks[name](options);
	});
};

module.exports.registerTasks = registerTasks;
