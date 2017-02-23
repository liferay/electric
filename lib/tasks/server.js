'use strict';

var gutil = require('gulp-util');
var httpServer = require('http-server');

module.exports = function(options) {
	var gulp = options.gulp;
	var taskPrefix = options.taskPrefix;

	var port = 8888;

	gulp.task(taskPrefix + 'server', function() {
		httpServer.createServer({
			root: options.pathDest
		}).listen(port);

		gutil.log(gutil.colors.green('Server started', 'http://localhost:' + port));
	});
};
