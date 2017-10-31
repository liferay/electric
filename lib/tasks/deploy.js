'use strict';

const ghPages = require('gh-pages');
const path = require('path');

module.exports = function(options) {
	const gulp = options.gulp;
	const runSequence = options.runSequence;
	const taskPrefix = options.taskPrefix;

	gulp.task(taskPrefix + 'deploy', function(cb) {
		const tasks = [taskPrefix + 'build', taskPrefix + 'deploy:gh'];

		if (!options.debug) {
			tasks.push(taskPrefix + 'clean:deploy');
		}

		runSequence.apply(null, tasks.concat(cb));
	});

	gulp.task(taskPrefix + 'deploy:gh', function(cb) {
		options.deployOptions.message = options.deployOptions.message ||
			'Update ' + new Date().toString();

		ghPages.publish(
			path.join(options.pathDest),
			options.deployOptions,
			cb
		);
	});
};
