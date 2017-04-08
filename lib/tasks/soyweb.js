'use strict';

var _ = require('lodash');
var data = require('gulp-data');
var filter = require('gulp-filter');
var frontMatter = require('gulp-front-matter');
var path = require('path');
var soynode = require('gulp-soynode');

var baseInject = require('../pipelines/baseInject');
var getTemplate = require('../getTemplate');
var handleError = require('../handleError');
var layout = require('../pipelines/layout');
var markdown = require('../pipelines/markdown');

var REGEX_SOYWEB = /{template\s\.soyweb}/;

var TEMP_DIR = 'temp/soyweb';

module.exports = function(options) {
	var gulp = options.gulp;
	var pathDest = options.pathDest;
	var pathSrc = options.pathSrc;
	var runSequence = options.runSequence;
	var taskPrefix = options.taskPrefix;
	var util = options.util;

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
		var siteData = util.getSiteData(pathDest);

		var htmlFilter = filter('**/*.html');

		var srcPath = [path.join(TEMP_DIR, '**/*.soy')];

		var metalSoyPaths = util.resolveMetalSoyPaths(options.metalComponents);

		if (metalSoyPaths.length) {
			srcPath = srcPath.concat(metalSoyPaths);
		}

		return gulp.src(srcPath, {
				base: path.join(TEMP_DIR, 'pages')
			})
			.pipe(frontMatter())
			.pipe(soynode({
				outputDir: path.join(__dirname, '../../temp/soynode'),
				renderSoyWeb: true,
				renderSoyWebContext: function(file) {
					var ref = util.getRefFromPath(file.path);
					var siteDataClone = _.cloneDeep(siteData);

					if (ref) {
						return getAPIContext(file, siteDataClone, ref);
					}
					else {
						return getPageContext(file, siteDataClone);
					}
				}
			}))
			.on('error', handleError)
			.pipe(htmlFilter)
			.pipe(gulp.dest(pathDest));
	});

	gulp.task(taskPrefix + 'soyweb:prep:layouts', function() {
		var baseTemplateFilter = filter(path.join(pathSrc, 'layouts/base.soy'), {
			restore: true
		});

		return gulp.src(path.join(pathSrc, 'layouts/**/*.soy'), {
				base: pathSrc
			})
			.pipe(baseTemplateFilter)
			.pipe(baseInject(options))
			.pipe(baseTemplateFilter.restore)
			.pipe(gulp.dest(TEMP_DIR));
	});

	gulp.task(taskPrefix + 'soyweb:prep:pages', function() {
		var soywebTemplate = getTemplate('soyweb');

		var markdownFilter = filter(path.join(pathSrc, 'pages/**/*.md'), {
			restore: true
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
			.pipe(data(function(file) {
				var contents = file.contents.toString();

				if (!REGEX_SOYWEB.test(contents)) {
					file.contents = new Buffer(soywebTemplate({
						content: contents
					}));
				}

				return file;
			}))
			.pipe(gulp.dest(TEMP_DIR));
	});

	gulp.task(taskPrefix + 'soyweb:prep:partials', function() {
		return gulp.src(path.join(pathSrc, '+(components|partials)/**/*.soy'), {
				base: pathSrc
			})
			.pipe(gulp.dest(TEMP_DIR));
	});

	function getPageContext(file, siteData) {
		var url = util.getPageURL(file.path, path.join(TEMP_DIR, 'pages'));

		util.setActive(siteData.index, url);

		var page = _.omit(util.getPageByURL(siteData.index, url), ['content']);

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
		var apiData = require(path.join(process.cwd(), TEMP_DIR, 'pages/api', ref, 'API.json'));

		var refProject = _.assign({}, options.apiConfig.project, {
			ref: ref
		});

		var fileName = path.basename(file.path, path.extname(file.path));
		var entityData = _.find(apiData, function(entity) {
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
