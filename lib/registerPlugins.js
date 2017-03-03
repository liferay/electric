'use strict';

var path = require('path');

function registerPlugins(options) {
	options.plugins = options.plugins.map(plugin => {
		let pluginPath = path.join(process.cwd(), 'node_modules', plugin);
		return require(pluginPath)(options);
	});
}

module.exports = registerPlugins;
