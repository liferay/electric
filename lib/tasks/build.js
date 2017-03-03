'use strict';

module.exports = function(options) {
	var gulp = options.gulp;
	var runSequence = options.runSequence;
	var taskPrefix = options.taskPrefix;
	var plugins = [];

	options.plugins.forEach(plugin => {
		if (plugin.name) {
			plugins.push(plugin.name);
		}
	});

	gulp.task(taskPrefix + 'build', function(cb) {
		var tasks = [
			taskPrefix + 'clean',
			[
				taskPrefix + 'front-matter',
				taskPrefix + 'static',
				taskPrefix + 'styles',
				taskPrefix + 'vendor'
			],
			[
				taskPrefix + 'soyweb',
				taskPrefix + 'metal'
			]
		];

		runSequence.apply(null, tasks.concat(plugins, cb));
	});
};
