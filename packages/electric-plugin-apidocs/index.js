'use strict';

var _ = require('lodash');
var async = require('async');
var data = require('gulp-data');
var documentation = require('gulp-documentation');
var filter = require('gulp-filter');
var gutil = require('gulp-util');
var path = require('path');
var soynode = require('gulp-soynode');
var streamSeries = require('stream-series');
var baseInject = require('electric/lib/pipelines/baseInject');

var api = require('./lib/pipelines/api');
var download = require('./lib/download');

var TEMP_DIR = 'temp/api';

module.exports = function(options) {
	var apiConfig = options.apiConfig;
	var gulp = options.gulp;
	var pathDest = options.pathDest;
	var runSequence = options.runSequence;
	var taskPrefix = options.taskPrefix;
	var util = options.util;

	apiConfig.layout = apiConfig.layout || 'main';

	gulp.task(taskPrefix + 'api', function(cb) {
		runSequence(
			[
				taskPrefix + 'api:download',
				taskPrefix + 'api:metal'
			],
			[
				taskPrefix + 'api:layouts',
				taskPrefix + 'api:prep',
				taskPrefix + 'api:templates'
			],
			[
				taskPrefix + 'api:render',
				taskPrefix + 'api:search-data'
			],
			cb
		);
	});

	gulp.task(taskPrefix + 'api:download', function(cb) {
		download(apiConfig.project, function(err) {
			cb(err);
		});
	});

	gulp.task(taskPrefix + 'api:layouts', function() {
		var streams = _.map(apiConfig.project.refs, function(ref) {
			return gulp.src(path.join(options.pathSrc, 'layouts/*.soy'))
				.pipe(baseInject(_.assign({}, options)))
				.pipe(gulp.dest(path.join(TEMP_DIR, ref, 'layouts')));
		});

		return streamSeries.apply(this, streams);
	});

	gulp.task(taskPrefix + 'api:metal', function() {
		return gulp.src(path.join(__dirname, 'build/*'))
			.pipe(gulp.dest(path.join(pathDest, 'js')));
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
			.pipe(gulp.dest(path.join(pathDest, 'api')))
	});

	gulp.task(taskPrefix + 'api:templates', function() {
		var stream = gulp.src(path.join(__dirname, 'src/*.soy'))

		apiConfig.project.refs.forEach(function(ref) {
			stream.pipe(gulp.dest(path.join(TEMP_DIR, ref, 'templates')));
		});

		return stream;
	});

	gulp.task(taskPrefix + 'api:render', function(cb) {
		var siteData = require(path.join(process.cwd(), pathDest, 'site.json'));
		var project = apiConfig.project;

		siteData.project = project;

		var metalSoyPaths = util.resolveMetalSoyPaths(options.metalComponents);

		var series = _.map(project.refs, function(ref) {
			return function(end) {
				var refProject = _.assign({}, project, {
					ref: ref
				});

				var apiData = require(path.join(process.cwd(), TEMP_DIR, ref, 'API.json'));
				var srcPath = [path.join(TEMP_DIR, ref, '**/*.soy')];
				var htmlFilter = filter('**/*.html');

				gulp.src(srcPath.concat(metalSoyPaths))
					.pipe(soynode({
						renderSoyWeb: true,
						renderSoyWebContext: function(file) {
							var fileName = path.basename(file.path, path.extname(file.path));

							var entityData = _.find(apiData, function(entity) {
								return entity.name === fileName;
							}) || {};

							var filter = {
								deprecated: true,
								private: true,
								protected: true,
								public: true
							};

							var serialized = JSON.stringify({
								entityData: entityData,
								filter: filter,
								project: refProject
							});

							return {
								apiData: apiData,
								entityData: entityData,
								page: {
									title: entityData.name
								},
								filter: filter,
								project: refProject,
								serialized: serialized,
								site: siteData
							};
						}
					}))
					.on('error', function(err) {
						this.emit('end');
					})
					.pipe(htmlFilter)
					.pipe(gulp.dest(path.join(pathDest, 'api', ref)))
					.on('end', end);
			}
		});

		async.series(series, cb);
	});

	return {
		name: taskPrefix + 'api'
	}
};
