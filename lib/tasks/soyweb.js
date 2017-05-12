'use strict';

let _ = require('lodash');
let data = require('gulp-data');
let filter = require('gulp-filter');
let frontMatter = require('gulp-front-matter');
let path = require('path');
let soynode = require('gulp-soynode');

let baseInject = require('../pipelines/baseInject');
let getTemplate = require('../getTemplate');
let handleError = require('../handleError');
let layout = require('../pipelines/layout');
let markdown = require('../pipelines/markdown');

let REGEX_SOYWEB = /{template\s\.soyweb}/;

let TEMP_DIR = 'temp/task/soyweb';

let TEMP_DIR_SITE = TEMP_DIR + '/site';

let TEMP_DIR_SOY = TEMP_DIR + '/soy';

module.exports = function(options) {
	let gulp = options.gulp;
	let pathDest = options.pathDest;
	let pathSrc = options.pathSrc;
	let runSequence = options.runSequence;
	let taskPrefix = options.taskPrefix;
	let util = options.util;

	gulp.task(taskPrefix + 'soyweb', function(cb) {
		runSequence(
			[
				taskPrefix + 'soyweb:prep:layouts',
				taskPrefix + 'soyweb:prep:pages',
				taskPrefix + 'soyweb:prep:partials'
			],
			taskPrefix + 'soyweb:compile',
			cb
		);
	});

	gulp.task(taskPrefix + 'soyweb:compile', function() {
		let siteData = util.getSiteData(pathDest);

		let htmlFilter = filter('**/*.html');

		let srcPath = [path.join(TEMP_DIR_SITE, '**/*.soy')];

		let metalSoyPaths = util.resolveMetalSoyPaths(options.metalComponents);

		if (metalSoyPaths.length) {
			srcPath = srcPath.concat(metalSoyPaths);
		}

		return gulp
			.src(srcPath, {
				base: path.join(TEMP_DIR_SITE, 'pages')
			})
			.pipe(frontMatter())
			.on('error', handleError)
			.pipe(
				soynode({
					outputDir: path.join(process.cwd(), TEMP_DIR_SOY),
					renderSoyWeb: true,
					renderSoyWebContext: function(file) {
						let ref = util.getRefFromPath(file.path);
						let siteDataClone = _.cloneDeep(siteData);

						if (ref) {
							return getAPIContext(file, siteDataClone, ref);
						} else {
							return getPageContext(file, siteDataClone);
						}
					}
				})
			)
			.on('error', handleError)
			.pipe(htmlFilter)
			.pipe(gulp.dest(pathDest));
	});

	gulp.task(taskPrefix + 'soyweb:prep:layouts', function() {
		let baseTemplateFilter = filter(path.join(pathSrc, 'layouts/base.soy'), {
			restore: true
		});

		return gulp
			.src(path.join(pathSrc, 'layouts/**/*.soy'), {
				base: pathSrc
			})
			.pipe(baseTemplateFilter)
			.pipe(baseInject(options))
			.pipe(baseTemplateFilter.restore)
			.pipe(gulp.dest(TEMP_DIR_SITE));
	});

	gulp.task(taskPrefix + 'soyweb:prep:pages', function() {
		let soywebTemplate = getTemplate('soyweb');

		let markdownFilter = filter(path.join(pathSrc, 'pages/**/*.md'), {
			restore: true
		});

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
			.pipe(
				data(function(file) {
					let contents = file.contents.toString();

					if (!REGEX_SOYWEB.test(contents)) {
						file.contents = new Buffer(
							soywebTemplate({
								content: contents
							})
						);
					}

					return file;
				})
			)
			.pipe(gulp.dest(TEMP_DIR_SITE));
	});

	gulp.task(taskPrefix + 'soyweb:prep:partials', function() {
		return gulp
			.src(path.join(pathSrc, '+(components|partials)/**/*.soy'), {
				base: pathSrc
			})
			.pipe(gulp.dest(TEMP_DIR_SITE));
	});

	function getPageContext(file, siteData) {
		let url = util.getPageURL(file.path, path.join(TEMP_DIR_SITE, 'pages'));

		util.setActive(siteData.index, url);

		let page = _.omit(util.getPageByURL(siteData.index, url), ['content']);

		if (page) {
			page.componentName = util.getNamespaceFromContents(file);
		}

		return {
			page: page,
			serialized: JSON.stringify({
				pageLocation: util.getTreeLocation(page.srcFilePath),
				site: siteData
			}),
			site: siteData
		};
	}

	function getAPIContext(file, siteData, ref) {
		let apiData = require(path.join(
			process.cwd(),
			TEMP_DIR_SITE,
			'pages/api',
			ref,
			'API.json'
		));

		let refProject = _.assign({}, options.apiConfig.project, {
			ref: ref
		});

		let fileName = path.basename(file.path, path.extname(file.path));
		let entityData = _.find(apiData, function(entity) {
			return entity.name === fileName;
		}) || {};

		return {
			apiData: apiData,
			entityData: entityData,
			page: {
				title: entityData.name || 'API'
			},
			project: refProject,
			serialized: JSON.stringify({
				pageLocation: '',
				site: siteData
			}),
			site: siteData
		};
	}
};
