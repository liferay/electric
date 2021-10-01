// SPDX-FileCopyrightText: © 2017 Liferay International Ltd. <https://liferay.com>
//
// SPDX-License-Identifier: BSD-3-Clause

'use strict';

var runGenerator = require('../runGenerator');

module.exports = {
	desc: 'Initializes a new electric project.',
	name: 'init',
	run: function(options, callback) {
		runGenerator('electric:app', options, function() {
			callback();
		});
	}
};
