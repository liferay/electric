'use strict';

var gutil = require('gulp-util');
var prettyTime = require('pretty-hrtime');

var chalk = gutil.colors;

function formatError(e) {
	if (!e.err) {
		return e.message;
	}

	if (typeof e.err.showStack === 'boolean') {
		return e.err.toString();
	}

	if (e.err.stack) {
		return e.err.stack;
	}

	return new Error(String(e.err)).stack;
}

function logger(gulp) {
	gulp.on('task_start', function(e) {
		gutil.log('Starting', '\'' + chalk.cyan(e.task) + '\'...');
	});

	gulp.on('task_stop', function(e) {
		var time = prettyTime(e.hrDuration);
		gutil.log(
			'Finished', '\'' + chalk.cyan(e.task) + '\'',
			'after', chalk.magenta(time)
		);
	});

	gulp.on('task_err', function(e) {
		var msg = formatError(e);
		var time = prettyTime(e.hrDuration);
		gutil.log(
			'\'' + chalk.cyan(e.task) + '\'',
			chalk.red('errored after'),
			chalk.magenta(time)
		);
		gutil.log(msg);
	});

	gulp.on('task_not_found', function(err) {
		gutil.log(
			chalk.red('Task \'' + err.task + '\' is not in your gulpfile')
		);
		gutil.log('Please check the documentation for proper gulpfile formatting');
		process.exit(1);
	});
}

module.exports = logger;
