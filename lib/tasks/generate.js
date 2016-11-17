'use strict';

module.exports = function(options) {
	var gulp = options.gulp;
	var runSequence = options.runSequence;
	var taskPrefix = options.taskPrefix;

	gulp.task(taskPrefix + 'generate', function(cb) {
		runSequence(
			taskPrefix + 'clean',
			taskPrefix + 'front-matter',
			taskPrefix + 'soyweb',
			taskPrefix + 'clean:temp',
			taskPrefix + 'metal',
			cb
		);
	});
};
