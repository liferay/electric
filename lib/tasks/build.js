'use strict';

module.exports = function(options) {
	let gulp = options.gulp;
	let runSequence = options.runSequence;
	let taskPrefix = options.taskPrefix;
	let plugins = [];

	options.plugins.forEach(plugin => {
		if (plugin.name) {
			plugins.push(plugin.name);
		}
	});

	gulp.task(taskPrefix + 'build', function(cb) {
		let tasks = [
			taskPrefix + 'clean',
			[
				taskPrefix + 'front-matter',
				taskPrefix + 'static',
				taskPrefix + 'styles',
				taskPrefix + 'vendor'
			],
			[taskPrefix + 'soyweb', taskPrefix + 'metal']
		];

		if (options.apiConfig) {
			tasks.splice(2, 0, taskPrefix + 'api');
		}

		if (!options.debug) {
			tasks.push(taskPrefix + 'clean:temp');
		}

		runSequence.apply(null, tasks.concat(plugins, cb));
	});
};
