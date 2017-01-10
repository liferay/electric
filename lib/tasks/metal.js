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

module.exports = function(options) {
	var gulp = options.gulp;
	var pathSrc = options.pathSrc;
	var runSequence = options.runSequence;
	var taskPrefix = options.taskPrefix;
	var util = options.util;

	var metalOptions = {
		buildDest: 'dist/js',
		buildSrc: 'temp/**/*.js',
		bundleFileName: 'bundle.js',
		gulp: gulp,
		soyDeps: 'node_modules/+(electric|metal)*/src/**/*.soy',
		soyDest: 'temp',
		soySrc: 'temp/**/*.soy',
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

		var plugins = options.plugins;

		if (plugins.length) {
			fs.writeFileSync(path.join(process.cwd(), 'temp/imports.js'), importsTemplate({
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

				var componentPath = path.join('temp', path.dirname(filePath), namespace + '.js');

				fs.outputFileSync(componentPath, componentContents);

				return file;
			}))
			.pipe(pagesFilter.restore)
			.pipe(gulp.dest('temp'));
	});
};
