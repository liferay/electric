'use strict';

var gutil = require('gulp-util');

var util = require('./util');

var handleError = function(err) {
	if (err.toString) {
		err = new Error(err.toString());
	}

	if (util.isWatching()) {
		gutil.log(err);
		this.emit('end');
	}
	else {
		throw err;
	}
};

module.exports = handleError;
