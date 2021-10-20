// SPDX-FileCopyrightText: © 2017 Liferay International Ltd. <https://liferay.com>
//
// SPDX-License-Identifier: BSD-3-Clause

'use strict';

module.exports = function(generator, options, callback) {
	var env = require('yeoman-environment').createEnv();

	env.lookup(function() {
		env.run(generator, options, callback);
	});
};
