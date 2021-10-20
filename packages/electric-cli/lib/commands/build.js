// SPDX-FileCopyrightText: © 2017 Liferay International Ltd. <https://liferay.com>
//
// SPDX-License-Identifier: BSD-3-Clause

'use strict';

var runTask = require('../runTask');
var configExists = require('../configExists');

module.exports = {
	desc: 'Builds site and places files in dist.',
	name: 'build',
	run: function(options, callback) {
		if (configExists()) {
			runTask('build', null, {
				env: options.env
			}, function() {
				callback();
			});
		}
	}
};
