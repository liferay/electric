// SPDX-FileCopyrightText: © 2017 Liferay International Ltd. <https://liferay.com>
//
// SPDX-License-Identifier: BSD-3-Clause

'use strict';

var runTask = require('../runTask');
var configExists = require('../configExists');

module.exports = {
	desc: 'Builds site, and starts up watch task along with development server.',
	name: 'run',
	run: function(options) {
		if (configExists()) {
			runTask('build', ['watch', 'server'], {
				env: options.env,
				port: options.port,
				skipBundle: options.skipBundle
			});
		}
	}
};
