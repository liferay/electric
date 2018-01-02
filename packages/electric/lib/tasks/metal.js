'use strict';

const _ = require('lodash');
const compileSoy = require('metal-tools-soy/lib/pipelines/compileSoy');
const data = require('gulp-data');
const filter = require('gulp-filter');
const frontMatter = require('gulp-front-matter');
const fs = require('fs-extra');
const globby = require('globby');
const path = require('path');

const bundle = require('../pipelines/bundle');
const getTemplate = require('../get_template');
const handleError = require('../handle_error');
const layout = require('../pipelines/layout');
const markdown = require('../pipelines/markdown');
const tokenReplace = require('../pipelines/token_replace');

const TEMP_DIR = '.temp/task/metal';

const TEMP_DIR_SITE = TEMP_DIR + '/site';

const TEMP_DIR_SOY = TEMP_DIR + '/soy';

module.exports = function(options) {
	const gulp = options.gulp;
	const pathDest = options.pathDest;
	const pathSrc = options.pathSrc;
	const metalComponents = options.metalComponents;
	const runSequence = options.runSequence;
	const taskPrefix = options.taskPrefix;
	const util = options.util;

	gulp.task(taskPrefix + 'metal', function(cb) {
		runSequence(
			[taskPrefix + 'metal:prep:partials', taskPrefix + 'metal:prep:layouts'],
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
		const cwd = process.cwd();

		const componentTemplate = getTemplate('component');

		const markdownFilter = filter(path.join(pathSrc, 'pages/**/*.md'), {
			restore: true
		});

		const partials = _.map(
			globby.sync(
				path.join(TEMP_DIR_SITE, '+(components|layouts|partials)/**/*.soy')
			),
			function(filePath) {
				const jsFilePath =
					path.join(
						path.dirname(filePath),
						path.basename(filePath, path.extname(filePath))
					) + '.js';

				if (fs.existsSync(jsFilePath)) {
					filePath = jsFilePath;
				} else if (path.extname(filePath) === '.soy') {
					filePath += '.js';
				}

				return path.join(cwd, filePath).split(path.sep).join('/');
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
					const namespace = util.getNamespaceFromContents(file);

					const componentContents = componentTemplate({
						imports: metalComponents.concat(partials),
						name: namespace,
						soyName: path.basename(filePath)
					});

					filePath = path.relative(path.join(cwd, pathSrc), filePath);

					const componentPath = path.join(
						TEMP_DIR_SITE,
						path.dirname(filePath),
						namespace + '.js'
					);

					fs.outputFileSync(componentPath, componentContents);

					return file;
				})
			)
			.pipe(tokenReplace(options))
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
						modules: options.resolveModules,
						uglify: options.uglifyBundle
					})
				);
		}
	);

	gulp.task(taskPrefix + 'metal:render:soy', function() {
		let soyDeps = ['node_modules/+(metal)*/src/**/*.soy'];

		const metalSoyPaths = util.resolveMetalSoyPaths(options.metalComponents);

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
