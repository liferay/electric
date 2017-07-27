'use strict';

let gutil = require('gulp-util');
let httpServer = require('http-server');

module.exports = function(options) {
	let gulp = options.gulp;
	let taskPrefix = options.taskPrefix;

	const portArgIndex = process.argv.findIndex(function(arg) {
		return arg.includes('--port') || arg.includes('-p');
	});

	const portArg = process.argv[portArgIndex + 1];

	let port = portArg || options.port;

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
