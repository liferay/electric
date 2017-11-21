'use strict';

const _ = require('lodash');
const data = require('gulp-data');
const filter = require('gulp-filter');
const frontMatter = require('gulp-front-matter');
const path = require('path');
const soynode = require('gulp-soynode');

const baseInject = require('../pipelines/base_inject');
const getTemplate = require('../get_template');
const handleError = require('../handle_error');
const layout = require('../pipelines/layout');
const markdown = require('../pipelines/markdown');
const tokenReplace = require('../pipelines/token_replace');

const REGEX_SOYWEB = /{template\s\.soyweb}/;

const TEMP_DIR = '.temp/task/soyweb';

const TEMP_DIR_SITE = TEMP_DIR + '/site';

const TEMP_DIR_SOY = TEMP_DIR + '/soy';

module.exports = function(options) {
	const gulp = options.gulp;
	const pathDest = options.pathDest;
	const pathSrc = options.pathSrc;
	const runSequence = options.runSequence;
	const taskPrefix = options.taskPrefix;
	const util = options.util;

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
		const siteData = util.getSiteData(pathDest);

		const htmlFilter = filter('**/*.html', {
			dot: true
		});

		let srcPath = [path.join(TEMP_DIR_SITE, '**/*.soy')];

		const metalSoyPaths = util.resolveMetalSoyPaths(options.metalComponents);

		if (metalSoyPaths.length) {
			srcPath = srcPath.concat(metalSoyPaths);
		}

		return gulp
			.src(srcPath, {
				base: path.join(TEMP_DIR_SITE, 'pages')
			})
			.on('error', handleError)
			.pipe(
				soynode({
					outputDir: path.join(process.cwd(), TEMP_DIR_SOY),
					renderSoyWeb: true,
					renderSoyWebContext: function(file) {
						const ref = util.getRefFromPath(file.path);
						const siteDataClone = _.cloneDeep(siteData);

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
		const baseTemplateFilter = filter(path.join(pathSrc, 'layouts/base.soy'), {
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
		const soywebTemplate = getTemplate('soyweb');

		const markdownFilter = filter(path.join(pathSrc, 'pages/**/*.md'), {
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
					const contents = file.contents.toString();

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
			.pipe(tokenReplace(options))
			.pipe(frontMatter({
				remove: true
			}))
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
		const url = util.getPageURL(file.path, path.join(TEMP_DIR_SITE, 'pages'));

		util.setActive(siteData.index, url);
		util.configureTopbar(siteData);

		const page = _.omit(util.getPageByURL(siteData.index, url), ['content']);

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
		const apiData = require(path.join(
			process.cwd(),
			TEMP_DIR_SITE,
			'pages/api',
			ref,
			'API.json'
		));

		const refProject = _.assign({}, options.apiConfig.project, {
			ref: ref
		});

		const fileName = path.basename(file.path, path.extname(file.path));
		const entityData =
			_.find(apiData, function(entity) {
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
