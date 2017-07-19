'use strict';

let ghPages = require('gulp-gh-pages');
let path = require('path');

module.exports = function(options) {
	let gulp = options.gulp;
	let runSequence = options.runSequence;
	let taskPrefix = options.taskPrefix;

	gulp.task(taskPrefix + 'deploy', function(cb) {
		let tasks = [taskPrefix + 'build', taskPrefix + 'deploy:gh'];

		if (!options.debug) {
			tasks.push(taskPrefix + 'clean:deploy');
		}

		runSequence(...tasks.concat(cb));
	});

	gulp.task(taskPrefix + 'deploy:gh', function() {
		return gulp
			.src(path.join(options.pathDest, '**/*'))
			.pipe(ghPages(options.deployOptions));
	});
};
