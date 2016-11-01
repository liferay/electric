'use strict';

module.exports = function(options) {
	var gulp = options.gulp;
	var runSequence = options.runSequence;

	gulp.task('generate', function(cb) {
		runSequence(
			'clean',
			'front-matter',
			'soyweb',
			'clean:temp',
			'metal',
			cb
		);
	});
};
