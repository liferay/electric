'use strict';

const del = require('del');
const path = require('path');

module.exports = function(options) {
	const gulp = options.gulp;
	const runSequence = options.runSequence;
	const taskPrefix = options.taskPrefix;

	gulp.task(taskPrefix + 'clean', function(cb) {
		runSequence([taskPrefix + 'clean:dest', taskPrefix + 'clean:temp'], cb);
	});

	gulp.task(taskPrefix + 'clean:deploy', function(cb) {
		del(['.deploy/**/*', '.deploy']).then(function() {
			cb();
		});
	});

	gulp.task(taskPrefix + 'clean:dest', function(cb) {
		del(path.join(options.pathDest, '**/*')).then(function() {
			cb();
		});
	});

	gulp.task(taskPrefix + 'clean:temp', function(cb) {
		del(['.temp/**/*', '.temp']).then(function() {
			cb();
		});
	});
};
