'use strict';

const path = require('path');
const sass = require('gulp-sass');

module.exports = function(options) {
	const gulp = options.gulp;
	const pathDest = options.pathDest;
	const pathSrc = options.pathSrc;
	const sassOptions = options.sassOptions;
	const taskPrefix = options.taskPrefix;

	gulp.task(taskPrefix + 'styles', function() {
		return gulp
			.src(path.join(pathSrc, 'styles/**/*.scss'))
			.pipe(sass(sassOptions).on('error', sass.logError))
			.pipe(gulp.dest(path.join(pathDest, 'styles')));
	});
};
