'use strict';

var ghPages = require('gulp-gh-pages');
var path = require('path');

module.exports = function(options) {
	var gulp = options.gulp;
	var taskPrefix = options.taskPrefix;

	gulp.task(taskPrefix + 'deploy', [taskPrefix + 'build'], function() {
		return gulp.src(path.join(options.pathDest, '**/*'))
			.pipe(ghPages(options.deployOptions));
	});
};
