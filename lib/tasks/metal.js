'use strict';

var _ = require('lodash');
var compileSoy = require('metal-tools-soy/lib/pipelines/compileSoy');
var data = require('gulp-data');
var filter = require('gulp-filter');
var frontMatter = require('gulp-front-matter');
var fs = require('fs-extra');
var globby = require('globby');
var path = require('path');

var bundle = require('../pipelines/bundle');
var getTemplate = require('../getTemplate');
var handleError = require('../handleError');
var layout = require('../pipelines/layout');
var markdown = require('../pipelines/markdown');

var TEMP_DIR = 'temp/task/metal';

var TEMP_DIR_SITE = TEMP_DIR + '/site';

var TEMP_DIR_SOY = TEMP_DIR + '/soy';

module.exports = function(options) {
	var gulp = options.gulp;
	var pathDest = options.pathDest;
	var pathSrc = options.pathSrc;
	var metalComponents = options.metalComponents;
	var runSequence = options.runSequence;
	var taskPrefix = options.taskPrefix;
	var util = options.util;

	gulp.task(taskPrefix + 'metal', function(cb) {
		runSequence(
			[
				taskPrefix + 'metal:prep:partials',
				taskPrefix + 'metal:prep:layouts'
			],
			taskPrefix + 'metal:prep:pages',
			taskPrefix + 'metal:prep:page-components',
			taskPrefix + 'metal:render:globals',
			cb
		);
	});

	gulp.task(taskPrefix + 'metal:prep:page-components', function() {
		return gulp.src(path.join(pathSrc, 'pages/**/*.js'), {
				base: pathSrc
			})
			.pipe(gulp.dest(TEMP_DIR_SITE));
	});

	gulp.task(taskPrefix + 'metal:prep:pages', function() {
		var cwd = process.cwd();

		var componentTemplate = getTemplate('component');

		var markdownFilter = filter(path.join(pathSrc, 'pages/**/*.md'), {
			restore: true
		});

		var partials = _.map(globby.sync(path.join(TEMP_DIR_SITE, '+(components|layouts|partials)/**/*.soy')), function(filePath) {
			var jsFilePath = path.join(path.dirname(filePath), path.basename(filePath, path.extname(filePath))) + '.js';

			if (fs.existsSync(jsFilePath)) {
				filePath = jsFilePath;
			}
			else if (path.extname(filePath) === '.soy') {
				filePath += '.js';
			}

			return path.join(cwd, filePath);
		});

		return gulp.src(path.join(pathSrc, 'pages/**/*.+(html|md|soy)'), {
				base: pathSrc
			})
			.pipe(markdownFilter)
			.pipe(markdown({
				markdownOptions: options.markdownOptions,
				markdownRenderer: options.markdownRenderer
			}))
			.pipe(markdownFilter.restore)
			.pipe(layout())
			.pipe(frontMatter())
			.pipe(data(function(file) {
				var filePath = file.path;
				var namespace = util.getNamespaceFromContents(file);

				var componentContents = componentTemplate({
					imports: metalComponents.concat(partials),
					name: namespace,
					soyName: path.basename(filePath)
				});

				filePath = path.relative(
					path.join(cwd, pathSrc),
					filePath
				);

				var componentPath = path.join(TEMP_DIR_SITE, path.dirname(filePath), namespace + '.js');

				fs.outputFileSync(componentPath, componentContents);

				return file;
			}))
			.pipe(gulp.dest(TEMP_DIR_SITE));
	});

	gulp.task(taskPrefix + 'metal:prep:partials', function() {
		return gulp.src(path.join(pathSrc, '+(components|partials)/**/*.+(js|soy)'), {
				base: pathSrc
			})
			.pipe(gulp.dest(TEMP_DIR_SITE));
	});

	gulp.task(taskPrefix + 'metal:prep:layouts', function() {
		return gulp.src([path.join(pathSrc, 'layouts/*.soy'), path.join('!' + pathSrc, 'layouts/base.soy')], {
				base: pathSrc
			})
			.pipe(gulp.dest(TEMP_DIR_SITE));
	});

	gulp.task(taskPrefix + 'metal:render:globals', [taskPrefix + 'metal:render:soy'], function() {
		return gulp.src([path.join(TEMP_DIR_SITE, '**/*.js'), '!' + path.join(TEMP_DIR_SITE, '**/*.soy.js')])
			.pipe(bundle({
				dest: pathDest,
				entryPoints: options.entryPoints,
				uglify: options.uglifyBundle
			}));
	});

	gulp.task(taskPrefix + 'metal:render:soy', function() {
		var soyDeps = ['node_modules/+(metal)*/src/**/*.soy'];

		var metalSoyPaths = util.resolveMetalSoyPaths(options.metalComponents);

		if (metalSoyPaths.length) {
			soyDeps = metalSoyPaths;
		}

		return gulp.src(path.join(TEMP_DIR_SITE, '**/*.soy'))
			.pipe(compileSoy({
					outputDir: path.join(process.cwd(), TEMP_DIR_SOY),
					soyDeps: soyDeps
				})
				.on('error', handleError))
				.pipe(gulp.dest(TEMP_DIR_SITE));
	});
};
