'use strict';

var _ = require('lodash');
var path = require('path');

module.exports = function(options) {
	var gulp = options.gulp;
	var pathDest = options.pathDest;
	var runSequence = options.runSequence;
	var taskPrefix = options.taskPrefix;

	gulp.task(taskPrefix + 'vendor:custom', function() {
		return gulp.src(options.vendorSrc)
			.pipe(gulp.dest(path.join(pathDest, 'vendor')));
	});

	gulp.task(taskPrefix + 'vendor:codemirror', function() {
		var sources = _.map(options.codeMirrorLanguages, function(language) {
			return require.resolve('codemirror/mode/' + language + '/' + language + '.js');
		}).concat([
			require.resolve('codemirror'),
			require.resolve('codemirror/lib/codemirror.css'),
			require.resolve('codemirror/theme/' + options.codeMirrorTheme + '.css')
		]);

		return gulp.src(sources, {
				base: path.dirname(require.resolve('codemirror/package.json'))
			})
			.pipe(gulp.dest(path.join(pathDest, 'vendor', 'codemirror')));
	});

	gulp.task(taskPrefix + 'vendor:senna', function() {
		var sennaPath = path.join(require.resolve('senna/package.json'), '..');

		return gulp.src([path.join(sennaPath, 'build/globals/senna.js'), path.join(sennaPath, 'build/senna.css')])
			.pipe(gulp.dest(path.join(pathDest, 'vendor', 'senna')));
	});

	gulp.task(taskPrefix + 'vendor', function(cb) {
		runSequence(
			[
				taskPrefix + 'vendor:codemirror',
				taskPrefix + 'vendor:custom',
				taskPrefix + 'vendor:senna'
			],
			cb
		);
	});
};
