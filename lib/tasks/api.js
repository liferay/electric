'use strict';

var _ = require('lodash');
var data = require('gulp-data');
var documentation = require('gulp-documentation');
var filter = require('gulp-filter');
var path = require('path');
var soynode = require('gulp-soynode');

var api = require('../pipelines/api');
var baseInject = require('../pipelines/base-inject');

var TEMP_DIR = 'temp/api';

module.exports = function(options) {
	var gulp = options.gulp;
	var runSequence = options.runSequence;
	var taskPrefix = options.taskPrefix;
	var apiConfig = options.apiConfig;

	var apiSources = _.map(apiConfig.projects, function(project, index) {
		return project.src;
	});

	gulp.task(taskPrefix + 'api', function(cb) {
		runSequence(
			[
				taskPrefix + 'api:layouts',
				taskPrefix + 'api:prep',
				taskPrefix + 'api:templates'
			],
			taskPrefix + 'api:render',
			cb
		);
	});

	gulp.task(taskPrefix + 'api:layouts', function(cb) {
		return gulp.src(path.join(options.pathSrc, 'layouts/*.soy'))
			.pipe(baseInject(options))
			.pipe(gulp.dest(TEMP_DIR));
	});

	gulp.task(taskPrefix + 'api:prep', function(cb) {
		return gulp.src(apiSources)
			.pipe(documentation('json', {
				access: ['public', 'private', 'protected', 'undefined'],
				private: true
			}))
			.pipe(api(apiConfig.projects))
			.pipe(gulp.dest(TEMP_DIR));
	});

	gulp.task(taskPrefix + 'api:templates', function(cb) {
		return gulp.src(path.join(__dirname, '../soy/*.soy'))
			.pipe(gulp.dest(path.join(TEMP_DIR, 'templates')));
	});

	gulp.task(taskPrefix + 'api:render', function(cb) {
		var apiData = require(path.join(process.cwd(), TEMP_DIR, 'API.json'));
		var siteData = require(path.join(process.cwd(), options.pathDest, 'site.json'));

		var htmlFilter = filter('**/*.html');

		var srcPath = [path.join(TEMP_DIR, '**/*.soy')];

		var plugins = options.plugins;

		if (plugins.length) {
			_.forEach(plugins, function(plugin) {
				srcPath.push('node_modules/**/' + plugin + '/src/**/*.soy');
			});
		}

		return gulp.src(srcPath)
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
						serialized: '{}',
						site: siteData
					};
				}
			}))
			.pipe(htmlFilter)
			.pipe(gulp.dest(path.join(options.pathDest, 'api')));
	});
};
