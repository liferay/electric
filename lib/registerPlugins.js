'use strict';

var path = require('path');
var resolve = require('resolve');

function registerPlugins(options) {
	options.plugins = options.plugins.map(plugin => {
		return require(resolve.sync(plugin, { basedir: process.cwd() }));
	});
}

module.exports = registerPlugins;
