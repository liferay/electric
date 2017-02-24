'use strict';

var path = require('path');
var sass = require('gulp-sass');

module.exports = function(options) {
	var gulp = options.gulp;
	var pathDest = options.pathDest;
	var pathSrc = options.pathSrc;
	var sassOptions = options.sassOptions;
	var taskPrefix = options.taskPrefix;

	gulp.task(taskPrefix + 'styles', function() {
		return gulp.src(path.join(pathSrc, 'styles/**/*.scss'))
			.pipe(sass(sassOptions))
			.pipe(gulp.dest(path.join(pathDest, 'styles')));
	});
};
