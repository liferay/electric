'use strict';

var path = require('path');

function registerPlugins(options) {
	options.plugins = options.plugins.map(plugin => {
		return require(plugin)(options);
	});
}

module.exports = registerPlugins;
