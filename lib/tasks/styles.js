'use strict';

let path = require('path');
let sass = require('gulp-sass');

module.exports = function(options) {
	let gulp = options.gulp;
	let pathDest = options.pathDest;
	let pathSrc = options.pathSrc;
	let sassOptions = options.sassOptions;
	let taskPrefix = options.taskPrefix;

	gulp.task(taskPrefix + 'styles', function() {
		return gulp
			.src(path.join(pathSrc, 'styles/**/*.scss'))
			.pipe(sass(sassOptions).on('error', sass.logError))
			.pipe(gulp.dest(path.join(pathDest, 'styles')));
	});
};
