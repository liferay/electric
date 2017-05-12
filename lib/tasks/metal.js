'use strict';

let _ = require('lodash');
let compileSoy = require('metal-tools-soy/lib/pipelines/compileSoy');
let data = require('gulp-data');
let filter = require('gulp-filter');
let frontMatter = require('gulp-front-matter');
let fs = require('fs-extra');
let globby = require('globby');
let path = require('path');

let bundle = require('../pipelines/bundle');
let getTemplate = require('../getTemplate');
let handleError = require('../handleError');
let layout = require('../pipelines/layout');
let markdown = require('../pipelines/markdown');

let TEMP_DIR = 'temp/task/metal';

let TEMP_DIR_SITE = TEMP_DIR + '/site';

let TEMP_DIR_SOY = TEMP_DIR + '/soy';

module.exports = function(options) {
	let gulp = options.gulp;
	let pathDest = options.pathDest;
	let pathSrc = options.pathSrc;
	let metalComponents = options.metalComponents;
	let runSequence = options.runSequence;
	let taskPrefix = options.taskPrefix;
	let util = options.util;

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
		return gulp
			.src(path.join(pathSrc, 'pages/**/*.js'), {
				base: pathSrc
			})
			.pipe(gulp.dest(TEMP_DIR_SITE));
	});

	gulp.task(taskPrefix + 'metal:prep:pages', function() {
		let cwd = process.cwd();

		let componentTemplate = getTemplate('component');

		let markdownFilter = filter(path.join(pathSrc, 'pages/**/*.md'), {
			restore: true
		});

		let partials = _.map(
			globby.sync(
				path.join(
					TEMP_DIR_SITE, '+(components|layouts|partials)/**/*.soy'
				)
			),
			function(filePath) {
				let jsFilePath =
					path.join(
						path.dirname(filePath),
						path.basename(filePath, path.extname(filePath))
					) + '.js';

				if (fs.existsSync(jsFilePath)) {
					filePath = jsFilePath;
				} else if (path.extname(filePath) === '.soy') {
					filePath += '.js';
				}

				return path.join(cwd, filePath);
			}
		);

		return gulp
			.src(path.join(pathSrc, 'pages/**/*.+(html|md|soy)'), {
				base: pathSrc
			})
			.pipe(markdownFilter)
			.pipe(
				markdown({
					markdownOptions: options.markdownOptions,
					markdownRenderer: options.markdownRenderer
				})
			)
			.pipe(markdownFilter.restore)
			.pipe(layout())
			.pipe(frontMatter())
			.on('error', handleError)
			.pipe(
				data(function(file) {
					let filePath = file.path;
					let namespace = util.getNamespaceFromContents(file);

					let componentContents = componentTemplate({
						imports: metalComponents.concat(partials),
						name: namespace,
						soyName: path.basename(filePath)
					});

					filePath = path.relative(path.join(cwd, pathSrc), filePath);

					let componentPath = path.join(
						TEMP_DIR_SITE,
						path.dirname(filePath),
						namespace + '.js'
					);

					fs.outputFileSync(componentPath, componentContents);

					return file;
				})
			)
			.pipe(gulp.dest(TEMP_DIR_SITE));
	});

	gulp.task(taskPrefix + 'metal:prep:partials', function() {
		return gulp
			.src(path.join(pathSrc, '+(components|partials)/**/*.+(js|soy)'), {
				base: pathSrc
			})
			.pipe(gulp.dest(TEMP_DIR_SITE));
	});

	gulp.task(taskPrefix + 'metal:prep:layouts', function() {
		return gulp
			.src(
			[
				path.join(pathSrc, 'layouts/*.soy'),
				path.join('!' + pathSrc, 'layouts/base.soy')
			],
			{
				base: pathSrc
			}
			)
			.pipe(gulp.dest(TEMP_DIR_SITE));
	});

	gulp.task(
		taskPrefix + 'metal:render:globals',
		[taskPrefix + 'metal:render:soy'],
		function() {
			return gulp
				.src([
					path.join(TEMP_DIR_SITE, '**/*.js'),
					'!' + path.join(TEMP_DIR_SITE, '**/*.soy.js')
				])
				.pipe(
					bundle({
						dest: pathDest,
						entryPoints: options.entryPoints,
						uglify: options.uglifyBundle
					})
				);
		}
	);

	gulp.task(taskPrefix + 'metal:render:soy', function() {
		let soyDeps = ['node_modules/+(metal)*/src/**/*.soy'];

		let metalSoyPaths = util.resolveMetalSoyPaths(options.metalComponents);

		if (metalSoyPaths.length) {
			soyDeps = metalSoyPaths;
		}

		return gulp
			.src(path.join(TEMP_DIR_SITE, '**/*.soy'))
			.pipe(
				compileSoy({
					outputDir: path.join(process.cwd(), TEMP_DIR_SOY),
					soyDeps: soyDeps
				}).on('error', handleError)
			)
			.pipe(gulp.dest(TEMP_DIR_SITE));
	});
};
