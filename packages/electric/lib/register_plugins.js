// SPDX-FileCopyrightText: © 2017 Liferay International Ltd. <https://liferay.com>
//
// SPDX-License-Identifier: BSD-3-Clause

'use strict';

const resolve = require('resolve');

function registerPlugins(options) {
	const cwd = process.cwd();

	options.plugins = options.plugins.map(plugin => {
		return require(resolve.sync(plugin, {
			basedir: cwd
		}))(options);
	});
}

module.exports = registerPlugins;
