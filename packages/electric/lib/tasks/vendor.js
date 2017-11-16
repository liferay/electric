'use strict';

const _ = require('lodash');
const path = require('path');
const series = require('stream-series');

module.exports = function(options) {
	const gulp = options.gulp;
	const pathDest = options.pathDest;
	const runSequence = options.runSequence;
	const taskPrefix = options.taskPrefix;

	gulp.task(taskPrefix + 'vendor:custom', function() {
		const streams = _.map(options.vendorSrc, function(vendor) {
			let base;
			let dest = path.join(pathDest, 'vendor');
			let src = vendor;

			if (_.isObject(vendor)) {
				base = vendor.base;
				dest = vendor.dest || dest;
				src = vendor.src;
			}

			return gulp
				.src(src, {
					base: base
				})
				.pipe(gulp.dest(dest));
		});

		series.apply(this, streams); // eslint-disable-line
	});

	gulp.task(taskPrefix + 'vendor:codemirror', function() {
		const sources = _.map(options.codeMirrorLanguages, function(language) {
			return require.resolve(
				'codemirror/mode/' + language + '/' + language + '.js'
			);
		}).concat([
			require.resolve('codemirror'),
			require.resolve('codemirror/lib/codemirror.css'),
			require.resolve('codemirror/theme/' + options.codeMirrorTheme + '.css')
		]);

		return gulp
			.src(sources, {
				base: path.dirname(require.resolve('codemirror/package.json'))
			})
			.pipe(gulp.dest(path.join(pathDest, 'vendor', 'codemirror')));
	});

	gulp.task(taskPrefix + 'vendor:senna', function() {
		const sennaPath = path.join(require.resolve('senna/package.json'), '..');

		return gulp
			.src([
				path.join(sennaPath, 'build/globals/senna.js'),
				path.join(sennaPath, 'build/senna.css')
			])
			.pipe(gulp.dest(path.join(pathDest, 'vendor', 'senna')));
	});

	gulp.task(taskPrefix + 'vendor', function(cb) {
		const tasks = [
			taskPrefix + 'vendor:custom',
			taskPrefix + 'vendor:senna'
		];

		if (options.codeMirror) {
			tasks.unshift(taskPrefix + 'vendor:codemirror');
		}

		runSequence(tasks, cb);
	});
};
