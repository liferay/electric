'use strict';

var del = require('del');

module.exports = function(options) {
	var gulp = options.gulp;
	var runSequence = options.runSequence;
	var taskPrefix = options.taskPrefix;

	gulp.task(taskPrefix + 'clean', function(cb) {
		runSequence(taskPrefix + 'clean:temp', cb);
	});

	gulp.task(taskPrefix + 'clean:temp', function(cb) {
		del('temp/**/*').then(function() {
			cb();
		});
	});
};
