'use strict';

module.exports = function(options) {
	var gulp = options.gulp;
	var taskPrefix = options.taskPrefix;

	gulp.task(taskPrefix + 'watch', function() {
		gulp.watch('src/**/*.+(md|soy|js|fm)', ['generate']);
		gulp.watch('src/styles/**/*', ['styles']);
	});
};
