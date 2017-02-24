'use strict';

module.exports = function(options) {
	var gulp = options.gulp;
	var runSequence = options.runSequence;
	var taskPrefix = options.taskPrefix;

	gulp.task(taskPrefix + 'build', function(cb) {
		runSequence(
			taskPrefix + 'clean',
			[
				taskPrefix + 'front-matter',
				taskPrefix + 'static',
				taskPrefix + 'styles',
				taskPrefix + 'vendor'
			],
			[
				taskPrefix + 'soyweb',
				taskPrefix + 'metal'
			],
			cb
		);
	});
};
