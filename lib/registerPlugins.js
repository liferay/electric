'use strict';

let resolve = require('resolve');

function registerPlugins(options) {
	let cwd = process.cwd();

	options.plugins = options.plugins.map(plugin => {
		return require(resolve.sync(plugin, {
			basedir: cwd
		}))(options);
	});
}

module.exports = registerPlugins;
