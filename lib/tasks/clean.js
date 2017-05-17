'use strict';

let del = require('del');
let path = require('path');

module.exports = function(options) {
	let gulp = options.gulp;
	let runSequence = options.runSequence;
	let taskPrefix = options.taskPrefix;

	gulp.task(taskPrefix + 'clean', function(cb) {
		runSequence([taskPrefix + 'clean:dest', taskPrefix + 'clean:temp'], cb);
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
