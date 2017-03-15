'use strict';

var resolve = require('resolve');

function registerPlugins(options) {
	var cwd = process.cwd();

	options.plugins = options.plugins.map(plugin => {
		return require(resolve.sync(plugin, {
			basedir: cwd
		}));
	});
}

module.exports = registerPlugins;
