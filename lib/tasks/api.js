'use strict';

var _ = require('lodash');
var documentation = require('gulp-documentation');
var path = require('path');
var streamSeries = require('stream-series');

var api = require('../pipelines/api');
var download = require('../download');

var TEMP_DIR = 'temp/soyweb/pages/api';

module.exports = function(options) {
	var apiConfig = options.apiConfig;
	var gulp = options.gulp;
	var pathDest = options.pathDest;
	var runSequence = options.runSequence;
	var taskPrefix = options.taskPrefix;

	apiConfig.layout = apiConfig.layout || 'main';

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
		var project = apiConfig.project;

		var streams = _.map(project.refs, function(ref) {
			var refProject = _.assign({}, project, {
				ref: ref
			});

			return gulp.src(path.join('temp', 'project', ref, project.src))
				.pipe(documentation('json', {
					access: ['public', 'private', 'protected', 'undefined'],
					private: true
				}))
				.pipe(api(refProject, options))
				.pipe(gulp.dest(path.join(TEMP_DIR, ref)));
		});

		return streamSeries.apply(this, streams);
	});

	gulp.task(taskPrefix + 'api:search-data', function() {
		return gulp.src(path.join(TEMP_DIR, '**/API.json'))
			.pipe(gulp.dest(path.join(pathDest, 'api')));
	});
};
