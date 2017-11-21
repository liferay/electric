'use strict';

const gutil = require('gulp-util');
const httpServer = require('http-server');

module.exports = function(options) {
	const gulp = options.gulp;
	const taskPrefix = options.taskPrefix;

	const port = options.port;

	gulp.task(taskPrefix + 'server', function() {
		httpServer
			.createServer({
				cache: -1,
				root: options.pathDest
			})
			.listen(port);

		gutil.log(
			gutil.colors.green('Server started', 'http://localhost:' + port)
		);
	});
};
