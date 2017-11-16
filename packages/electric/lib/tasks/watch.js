'use strict';

const path = require('path');

module.exports = function(options) {
	const gulp = options.gulp;
	const pathSrc = options.pathSrc;
	const taskPrefix = options.taskPrefix;

	gulp.task(taskPrefix + 'watch', function() {
		options.util.watch();

		gulp.watch(path.join(pathSrc, 'styles/**/*'), [taskPrefix + 'styles']);
		gulp.watch(
			[
				path.join(pathSrc, '**/*.+(html|md|soy|js|fm)'),
				path.join(pathSrc, 'site.json')
			],
			[taskPrefix + 'build']
		);
		gulp.watch(options.staticSrc, [taskPrefix + 'static']);
	});
};
