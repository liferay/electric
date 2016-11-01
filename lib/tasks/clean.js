'use strict';

var del = require('del');

module.exports = function(options) {
	var gulp = options.gulp;
	var runSequence = options.runSequence;

	gulp.task('clean', function(cb) {
		runSequence(
			[
				'clean:dist',
				'clean:temp'
			],
			cb
		);
	});

	gulp.task('clean:dist', function(cb) {
		del('dist/**/*').then(function(paths) {
			cb();
		});
	});

	gulp.task('clean:temp', function(cb) {
		del('temp/**/*').then(function(paths) {
			cb();
		});
	});
};
