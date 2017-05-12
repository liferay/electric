'use strict';

let ghPages = require('gulp-gh-pages');
let path = require('path');

module.exports = function(options) {
	let gulp = options.gulp;
	let taskPrefix = options.taskPrefix;

	gulp.task(taskPrefix + 'deploy', [taskPrefix + 'build'], function() {
		return gulp
			.src(path.join(options.pathDest, '**/*'))
			.pipe(ghPages(options.deployOptions));
	});
};
