'use strict';

var path = require('path');

module.exports = function(options) {
	var gulp = options.gulp;
	var pathSrc = options.pathSrc;
	var taskPrefix = options.taskPrefix;

	gulp.task(taskPrefix + 'watch', function() {
		options.util.watch();

		gulp.watch(path.join(pathSrc, 'styles/**/*'), [taskPrefix + 'styles']);
		gulp.watch([
			path.join(pathSrc, '**/*.+(html|md|soy|js|fm)'),
			path.join(pathSrc, 'site.json'
		)], [taskPrefix + 'build']);
		gulp.watch(options.staticSrc, [taskPrefix + 'static']);
	});
};
