'use strict';

var del = require('del');
var path = require('path');

module.exports = function(options) {
	var gulp = options.gulp;
	var runSequence = options.runSequence;
	var taskPrefix = options.taskPrefix;

	gulp.task(taskPrefix + 'clean', function(cb) {
		runSequence([taskPrefix + 'clean:dest', taskPrefix + 'clean:temp'], cb);
	});

	gulp.task(taskPrefix + 'clean:dest', function(cb) {
		del(path.join(options.pathDest, '**/*')).then(function() {
			cb();
		});
	});

	gulp.task(taskPrefix + 'clean:temp', function(cb) {
		del('temp/**/*').then(function() {
			cb();
		});
	});
};
