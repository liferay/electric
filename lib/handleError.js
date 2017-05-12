'use strict';

let gutil = require('gulp-util');

let util = require('./util');

let handleError = function(err) {
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
