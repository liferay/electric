'use strict';

var path = require('path');
var sass = require('gulp-sass');

module.exports = function(options) {
	var gulp = options.gulp;
	var pathDest = options.pathDest;
	var pathSrc = options.pathSrc;
	var taskPrefix = options.taskPrefix;

	gulp.task(taskPrefix + 'static', function() {
		return gulp.src(options.staticSrc)
			.pipe(gulp.dest(pathDest));
	});
};
