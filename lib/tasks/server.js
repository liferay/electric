'use strict';

let gutil = require('gulp-util');
let httpServer = require('http-server');

module.exports = function(options) {
	let gulp = options.gulp;
	let taskPrefix = options.taskPrefix;

	let port = options.port;

	gulp.task(taskPrefix + 'server', function() {
		httpServer
			.createServer({
				root: options.pathDest
			})
			.listen(port);

		gutil.log(
			gutil.colors.green('Server started', 'http://localhost:' + port)
		);
	});
};
