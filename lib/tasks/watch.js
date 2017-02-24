'use strict';

var path = require('path');

module.exports = function(options) {
	var gulp = options.gulp;
	var pathSrc = options.pathSrc;
	var taskPrefix = options.taskPrefix;

	gulp.task(taskPrefix + 'watch', function() {
		gulp.watch(path.join(pathSrc, 'styles/**/*'), ['styles']);
		gulp.watch([
			path.join(pathSrc, '**/*.+(md|soy|js|fm)'),
			path.join(pathSrc, 'site.json'
		)], ['generate']);
		gulp.watch(options.staticSrc, ['static']);
	});
};
