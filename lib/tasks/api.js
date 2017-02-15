'use strict';

var _ = require('lodash');
var async = require('async');
var data = require('gulp-data');
var documentation = require('gulp-documentation');
var filter = require('gulp-filter');
var ghDownload = require('github-download');
var mergeStream = require('merge-stream');
var path = require('path');
var soynode = require('gulp-soynode');

var api = require('../pipelines/api');
var baseInject = require('../pipelines/base-inject');
var projectDownload = require('../project-download');

var TEMP_DIR = 'temp/api';

module.exports = function(options) {
	var gulp = options.gulp;
	var runSequence = options.runSequence;
	var taskPrefix = options.taskPrefix;
	var apiConfig = options.apiConfig;

	gulp.task(taskPrefix + 'api', function(cb) {
		runSequence(
			taskPrefix + 'front-matter',
			taskPrefix + 'api:download',
			[
				taskPrefix + 'api:layouts',
				taskPrefix + 'api:prep',
				taskPrefix + 'api:templates'
			],
			taskPrefix + 'api:render',
			cb
		);
	});

	gulp.task(taskPrefix + 'api:download', function(cb) {
		projectDownload(apiConfig.project, function(err) {
			cb(err);
		});
	});

	gulp.task(taskPrefix + 'api:layouts', function() {
		var streams = _.map(options.apiConfig.project.refs, function(ref) {
			return gulp.src(path.join(options.pathSrc, 'layouts/*.soy'))
				.pipe(baseInject(options))
				.pipe(gulp.dest(path.join(TEMP_DIR, ref, 'layouts')));
		});

		return mergeStream.apply(this, streams);
	});

	gulp.task(taskPrefix + 'api:prep', function() {
		var project = options.apiConfig.project;

		var streams = _.map(project.refs, function(ref) {
			var refProject = _.assign({}, project, {
				ref: ref
			});

			return gulp.src(path.join('temp', 'project', ref, project.src))
				.pipe(documentation('json', {
					access: ['public', 'private', 'protected', 'undefined'],
					private: true
				}))
				.pipe(api(refProject))
				.pipe(gulp.dest(path.join(TEMP_DIR, ref)));
		});

		return mergeStream.apply(this, streams);
	});

	gulp.task(taskPrefix + 'api:templates', function() {
		var stream = gulp.src(path.join(__dirname, '../soy/*.soy'))

		options.apiConfig.project.refs.forEach(function(ref) {
			stream.pipe(gulp.dest(path.join(TEMP_DIR, ref, 'templates')));
		});

		return stream;
	});

	gulp.task(taskPrefix + 'api:render', function(cb) {
		var siteData = require(path.join(process.cwd(), options.pathDest, 'site.json'));

		var plugins = options.plugins;
		var project = options.apiConfig.project;

		if (plugins.length) {
			var pluginSources = _.map(plugins, function(plugin) {
				return 'node_modules/**/' + plugin + '/src/**/*.soy';
			});
		}

		var series = _.map(project.refs, function(ref) {
			return function(end) {
				var refProject = _.assign({}, project, {
					ref: ref
				});

				var apiData = require(path.join(process.cwd(), TEMP_DIR, ref, 'API.json'));
				var srcPath = [path.join(TEMP_DIR, ref, '**/*.soy')];
				var htmlFilter = filter('**/*.html');

				gulp.src(srcPath.concat(pluginSources))
					.pipe(soynode({
						renderSoyWeb: true,
						renderSoyWebContext: function(file) {
							var fileName = path.basename(file.path, path.extname(file.path));

							var entityData = _.find(apiData, function(entity) {
								return entity.name === fileName;
							});

							return {
								apiData: apiData,
								entityData: entityData,
								page: {},
								project: refProject,
								serialized: '{}',
								site: siteData
							};
						}
					}))
					.pipe(htmlFilter)
					.pipe(gulp.dest(path.join(options.pathDest, 'api', ref)))
					.on('end', end);
			}
		});

		async.series(series, cb);
	});
};
