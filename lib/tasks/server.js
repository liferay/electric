'use strict';

var httpServer = require('http-server');

module.exports = function(options) {
	var gulp = options.gulp;
	var taskPrefix = options.taskPrefix;

	gulp.task(taskPrefix + 'server', function() {
		httpServer.createServer({
			root: options.pathDest
		}).listen(8888);
	});
};
