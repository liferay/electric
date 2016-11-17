'use strict';

var del = require('del');
var path = require('path');

module.exports = function(options) {
	var gulp = options.gulp;
	var runSequence = options.runSequence;

	gulp.task('clean', function(cb) {
		runSequence('clean:temp', cb);
	});

	gulp.task('clean:temp', function(cb) {
		del('temp/**/*').then(function(paths) {
			cb();
		});
	});
};
