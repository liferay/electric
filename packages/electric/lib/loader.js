// SPDX-FileCopyrightText: © 2017 Liferay International Ltd. <https://liferay.com>
//
// SPDX-License-Identifier: BSD-3-Clause

'use strict';

const fs = require('fs');

module.exports = function() {
	const callback = this.async();

	fs.readFile(
		this.resource + '.js',
		{
			encoding: 'utf8'
		},
		callback
	);
};
