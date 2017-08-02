'use strict';

const _ = require('lodash');
const documentation = require('gulp-documentation');
const path = require('path');
const streamSeries = require('stream-series');

const api = require('../pipelines/api');
const download = require('../download');

const TEMP_DIR = '.temp/task/soyweb/site/pages/api';

module.exports = function(options) {
	const apiConfig = options.apiConfig;
	const gulp = options.gulp;
	const pathDest = options.pathDest;
	const runSequence = options.runSequence;
	const taskPrefix = options.taskPrefix;

	if (apiConfig) {
		apiConfig.layout = apiConfig.layout || 'main';
	}

	gulp.task(taskPrefix + 'api', function(cb) {
		runSequence(
			taskPrefix + 'api:download',
			taskPrefix + 'api:prep',
			taskPrefix + 'api:search-data',
			cb
		);
	});

	gulp.task(taskPrefix + 'api:download', function(cb) {
		download(apiConfig.project, function(err) {
			cb(err);
		});
	});

	gulp.task(taskPrefix + 'api:prep', function() {
		const project = apiConfig.project;

		const streams = _.map(project.refs, function(ref) {
			const refProject = _.assign({}, project, {
				ref: ref
			});

			let src = project.src;

			const srcArray = _.isArray(src) ? src : [src];

			src = _.map(srcArray, function(srcPath) {
				return path.join('.temp', 'project', ref, srcPath);
			});

			return gulp
				.src(src)
				.pipe(
					documentation('json', {
						access: ['public', 'private', 'protected', 'undefined'],
						private: true
					})
				)
				.pipe(api(refProject, options))
				.pipe(gulp.dest(path.join(TEMP_DIR, ref)));
		});

		return streamSeries.apply(this, streams); // eslint-disable-line
	});

	gulp.task(taskPrefix + 'api:search-data', function() {
		return gulp
			.src(path.join(TEMP_DIR, '**/API.json'))
			.pipe(gulp.dest(path.join(pathDest, 'api')));
	});
};
