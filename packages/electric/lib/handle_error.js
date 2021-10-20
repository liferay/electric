// SPDX-FileCopyrightText: © 2017 Liferay International Ltd. <https://liferay.com>
//
// SPDX-License-Identifier: BSD-3-Clause

'use strict';

const gutil = require('gulp-util');

const util = require('./util');

const handleError = function(err) {
	if (err.toString) {
		err = new Error(err.toString());
	}

	if (util.isWatching()) {
		gutil.log(err);
		this.emit('end'); // eslint-disable-line
	} else {
		throw err;
	}
};

module.exports = handleError;
