// SPDX-FileCopyrightText: © 2017 Liferay International Ltd. <https://liferay.com>
//
// SPDX-License-Identifier: BSD-3-Clause

'use strict';

var runTask = require('../runTask');
var configExists = require('../configExists');

module.exports = {
	desc: 'Watches for changes to src files.',
	name: 'watch',
	run: function(options) {
		if (configExists()) {
			runTask('watch', null, {
				env: options.env
			});
		}
	}
};
