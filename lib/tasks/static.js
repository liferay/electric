'use strict';

var path = require('path');
var sass = require('gulp-sass');

module.exports = function(options) {
	var gulp = options.gulp;
	var pathDest = options.pathDest;
	var pathSrc = options.pathSrc;
	var taskPrefix = options.taskPrefix;

	var ignoreDirs = ['components', 'layouts', 'pages', 'partials', 'styles'];

	var ignoreGlob = path.join('!' + pathSrc, '+(' + ignoreDirs.join('|') + ')/');

	var src = [
		path.join(pathSrc, '**/*'),
		path.join('!' + pathSrc, 'site.json'),
		ignoreGlob,
		path.join(ignoreGlob, '**/*')
	];

	gulp.task(taskPrefix + 'static', function() {
		return gulp.src(src)
			.pipe(gulp.dest(pathDest));
	});
};
