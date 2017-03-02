'use strict';

function registerPlugins(options) {
	var plugins = options.plugins;

	if (plugins.length) {
		plugins.forEach(function(plugin) {
			require(plugin)(options);
		});
	}
}

module.exports = registerPlugins;