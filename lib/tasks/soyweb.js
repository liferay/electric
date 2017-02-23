'use strict';

var _ = require('lodash');
var filter = require('gulp-filter');
var frontMatter = require('gulp-front-matter');
var insert = require('gulp-insert');
var path = require('path');
var soynode = require('gulp-soynode');

var baseInject = require('../pipelines/base-inject');
var getTemplate = require('../get-template');
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
		var siteData = require(path.join(process.cwd(), pathDest, 'site.json'));

		var htmlFilter = filter('**/*.html');

		var srcPath = [path.join(TEMP_DIR, '**/*.soy')];

		var plugins = options.plugins;

		if (plugins.length) {
			_.forEach(plugins, function(plugin) {
				srcPath.push('node_modules/**/' + plugin + '/src/**/*.soy');
			});
		}

		return gulp.src(srcPath, {
				base: path.join(TEMP_DIR, 'pages')
			})
			.pipe(frontMatter())
			.pipe(soynode({
				renderSoyWeb: true,
				renderSoyWebContext: function(file) {
					var siteDataClone = _.cloneDeep(siteData);

					var url = util.getPageURL(file.path, path.join(TEMP_DIR, 'pages'));

					util.setActive(siteDataClone.index, url);

					var page = _.omit(util.getPageByURL(siteDataClone.index, url), ['content']);

					if (page) {
						page.componentName = util.getNamespaceFromContents(file);
					}

					return {
						page: page,
						serialized: JSON.stringify({
							pageLocation: util.getTreeLocation(page.srcFilePath),
							site: siteDataClone
						}),
						site: siteDataClone
					};
				}
			}))
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

		return gulp.src(path.join(pathSrc, 'pages/**/*.+(md|soy)'), {
				base: pathSrc
			})
			.pipe(markdownFilter)
			.pipe(markdown({
				markdownOptions: options.markdownOptions
			}))
			.pipe(markdownFilter.restore)
			.pipe(insert.transform(function(contents) {
				if (!REGEX_SOYWEB.test(contents)) {
					contents = soywebTemplate({
						content: contents
					});
				}

				return contents;
			}))
			.pipe(gulp.dest(TEMP_DIR));
	});

	gulp.task(taskPrefix + 'soyweb:prep:partials', function() {
		return gulp.src(path.join(pathSrc, '+(components|partials)/**/*.soy'), {
				base: pathSrc
			})
			.pipe(gulp.dest(TEMP_DIR));
	});
};
