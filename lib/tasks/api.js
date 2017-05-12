'use strict';

let _ = require('lodash');
let documentation = require('gulp-documentation');
let path = require('path');
let streamSeries = require('stream-series');

let api = require('../pipelines/api');
let download = require('../download');

let TEMP_DIR = 'temp/soyweb/pages/api';

module.exports = function(options) {
	let apiConfig = options.apiConfig;
	let gulp = options.gulp;
	let pathDest = options.pathDest;
	let runSequence = options.runSequence;
	let taskPrefix = options.taskPrefix;

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
		let project = apiConfig.project;

		let streams = _.map(project.refs, function(ref) {
			let refProject = _.assign({}, project, {
				ref: ref
			});

			let src = project.src;

			let srcArray = _.isArray(src) ? src : [src];

			src = _.map(srcArray, function(srcPath) {
				return path.join('temp', 'project', ref, srcPath);
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

		return streamSeries.apply(this, streams);
	});

	gulp.task(taskPrefix + 'api:search-data', function() {
		return gulp
			.src(path.join(TEMP_DIR, '**/API.json'))
			.pipe(gulp.dest(path.join(pathDest, 'api')));
	});
};
