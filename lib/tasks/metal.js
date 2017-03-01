'use strict';

var buildGlobals = require('metal-tools-build-globals/lib/pipelines/buildGlobals');
var compileSoy = require('metal-tools-soy/lib/pipelines/compileSoy');
var data = require('gulp-data');
var filter = require('gulp-filter');
var frontMatter = require('gulp-front-matter');
var fs = require('fs-extra');
var gutil = require('gulp-util');
var path = require('path');

var getTemplate = require('../get-template');
var handleError = require('../handleError');
var markdown = require('../pipelines/markdown');

var TEMP_DIR = 'temp/metal';

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
				taskPrefix + 'metal:prep:pages',
				taskPrefix + 'metal:prep:partials',
				taskPrefix + 'metal:prep:layouts'
			],
			taskPrefix + 'metal:render:globals',
			cb
		);
	});

	gulp.task(taskPrefix + 'metal:prep:pages', function() {
		var componentTemplate = getTemplate('component');
		var importsTemplate = getTemplate('imports');

		if (metalComponents.length) {
			fs.outputFileSync(path.join(process.cwd(), TEMP_DIR, 'imports.js'), importsTemplate({
				metalComponents: metalComponents
			}));
		}

		var markdownFilter = filter(path.join(pathSrc, 'pages/**/*.md'), {
			restore: true
		});

		return gulp.src(path.join(pathSrc, 'pages/**/*.+(js|md|soy)'), {
				base: pathSrc
			})
			.pipe(markdownFilter)
			.pipe(markdown({
				markdownOptions: options.markdownOptions
			}))
			.pipe(markdownFilter.restore)
			.pipe(frontMatter())
			.pipe(data(function(file) {
				var filePath = file.path;
				var namespace = util.getNamespaceFromContents(file);

				var componentContents = componentTemplate({
					name: namespace,
					soyName: path.basename(filePath)
				});

				filePath = path.relative(
					path.join(process.cwd(), pathSrc),
					filePath
				);

				var componentPath = path.join(TEMP_DIR, path.dirname(filePath), namespace + '.js');

				fs.outputFileSync(componentPath, componentContents);

				return file;
			}))
			.pipe(gulp.dest(TEMP_DIR));
	});

	gulp.task(taskPrefix + 'metal:prep:partials', function() {
		return gulp.src(path.join(pathSrc, '+(components|partials)/**/*.+(js|soy)'), {
				base: pathSrc
			})
			.pipe(gulp.dest(TEMP_DIR));
	});

	gulp.task(taskPrefix + 'metal:prep:layouts', function() {
		return gulp.src([path.join(pathSrc, 'layouts/*.soy'), path.join('!' + pathSrc, 'layouts/base.soy')], {
				base: pathSrc
			})
			.pipe(gulp.dest(TEMP_DIR));
	});

	gulp.task(taskPrefix + 'metal:render:globals', [taskPrefix + 'metal:render:soy'], function() {
		return gulp.src(path.join(TEMP_DIR, '**/*.js'))
			.pipe(buildGlobals({
					bundleFileName: 'bundle.js'
				})
				.on('error', handleError))
				.pipe(gulp.dest(path.join(pathDest, 'js')));
	});

	gulp.task(taskPrefix + 'metal:render:soy', function() {
		var soyDeps = 'node_modules/+(metal)*/src/**/*.soy';

		if (metalComponents.length) {
			soyDeps = 'node_modules/+(' + metalComponents.join('|') + '|metal)*/src/**/*.soy';
		}

		return gulp.src(path.join(TEMP_DIR, '**/*.soy'))
			.pipe(compileSoy({
					soyDeps: soyDeps
				})
				.on('error', handleError))
				.pipe(gulp.dest(TEMP_DIR));
	});
};
