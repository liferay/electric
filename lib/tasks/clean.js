'use strict';

var del = require('del');
var path = require('path');

module.exports = function(options) {
	var gulp = options.gulp;
	var runSequence = options.runSequence;

	gulp.task('clean', function(cb) {
		runSequence('clean:dist', 'clean:temp', cb);
	});

	gulp.task('clean:dist', function(cb) {
		del(path.join(options.pathDest, '**/*')).then(function(paths) {
			cb();
		});
	});

	gulp.task('clean:temp', function(cb) {
		del('temp/**/*').then(function(paths) {
			cb();
		});
	});
};
