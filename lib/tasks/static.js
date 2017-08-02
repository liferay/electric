'use strict';

module.exports = function(options) {
	const gulp = options.gulp;

	gulp.task(options.taskPrefix + 'static', function() {
		return gulp.src(options.staticSrc).pipe(gulp.dest(options.pathDest));
	});
};
