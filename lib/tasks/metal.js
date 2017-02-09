'use strict';

var _ = require('lodash');
var data = require('gulp-data');
var filter = require('gulp-filter');
var frontMatter = require('gulp-front-matter');
var fs = require('fs-extra');
var metalGlobalTasks = require('gulp-metal/lib/tasks/globals');
var metalSoyTasks = require('gulp-metal/lib/tasks/soy');
var path = require('path');

var markdown = require('../pipelines/markdown');

var TEMP_DIR = 'temp/metal';

module.exports = function(options) {
	var gulp = options.gulp;
	var pathSrc = options.pathSrc;
	var plugins = options.plugins;
	var runSequence = options.runSequence;
	var taskPrefix = options.taskPrefix;
	var util = options.util;

	var soyDeps = 'node_modules/+(metal)*/src/**/*.soy';

	if (plugins.length) {
		soyDeps = 'node_modules/+(' + plugins.join('|') + '|metal)*/src/**/*.soy';
	}

	var metalOptions = {
		buildDest: 'dist/js',
		buildSrc: path.join(TEMP_DIR, '**/*.js'),
		bundleFileName: 'bundle.js',
		gulp: gulp,
		soyDeps: soyDeps,
		soyDest: TEMP_DIR,
		soySrc: path.join(TEMP_DIR, '**/*.soy'),
		taskPrefix: 'metal:'
	};

	metalGlobalTasks(metalOptions);
	metalSoyTasks(metalOptions);

	gulp.task(taskPrefix + 'metal', function(cb) {
		runSequence(taskPrefix + 'metal:prep', 'metal:soy', 'metal:build:globals:js', cb);
	});

	gulp.task(taskPrefix + 'metal:prep', function() {
		var componentTemplate = _.template(fs.readFileSync(path.join(__dirname, '../templates/component.tpl')));
		var importsTemplate = _.template(fs.readFileSync(path.join(__dirname, '../templates/imports.tpl')));

		if (plugins.length) {
			fs.outputFileSync(path.join(process.cwd(), TEMP_DIR, 'imports.js'), importsTemplate({
				plugins: plugins
			}));
		}

		var filterConfig = {restore: true};

		var markdownFilter = filter(path.join(pathSrc, 'pages/**/*.md'), filterConfig);
		var pagesFilter = filter(path.join(pathSrc, '+(layouts|pages)/**/*.soy'), filterConfig);

		return gulp.src([path.join(pathSrc, '**/*.+(js|md|soy)'), path.join('!' + pathSrc, 'layouts/base.soy')])
			.pipe(markdownFilter)
			.pipe(markdown({
				markdownOptions: options.markdownOptions
			}))
			.pipe(markdownFilter.restore)
			.pipe(frontMatter())
			.pipe(pagesFilter)
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
			.pipe(pagesFilter.restore)
			.pipe(gulp.dest(TEMP_DIR));
	});
};
