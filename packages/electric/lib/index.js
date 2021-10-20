// SPDX-FileCopyrightText: © 2016 Liferay International Ltd. <https://liferay.com>
//
// SPDX-License-Identifier: BSD-3-Clause

'use strict';

const path = require('path');
const requireDirectory = require('require-directory');

const normalizeOptions = require('./options');
const registerPlugins = require('./register_plugins');

const registerTasks = function(options) {
	options = normalizeOptions(options);

	registerPlugins(options);

	const tasks = requireDirectory(module, path.join(__dirname, 'tasks'), {
		recurse: false
	});

	Object.keys(tasks).forEach(function(name) {
		tasks[name](options);
	});
};

module.exports.registerTasks = registerTasks;
