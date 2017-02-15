'use strict';

var _ = require('lodash');
var filter = require('gulp-filter');
var frontMatter = require('gulp-front-matter');
var inject = require('gulp-inject');
var insert = require('gulp-insert');
var path = require('path');
var series = require('stream-series');
var soynode = require('gulp-soynode');

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
		runSequence(taskPrefix + 'soyweb:prep', taskPrefix + 'soyweb:compile', cb);
	});

	gulp.task(taskPrefix + 'soyweb:compile', function() {
		var siteData = require(path.join(process.cwd(), options.pathDest, 'site.json'));

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

					var page = _.omit(util.getPageByURL(siteDataClone.index, url), ['children', 'content']);

					if (page) {
						page.componentName = util.getNamespaceFromContents(file);
					}

					return {
						page: page,
						serialized: JSON.stringify({
							page: page,
							site: siteDataClone
						}),
						site: siteDataClone
					};
				}
			}))
			.pipe(htmlFilter)
			.pipe(gulp.dest(options.pathDest));
	});

	gulp.task(taskPrefix + 'soyweb:prep', function() {
		var siteData = require(path.join(process.cwd(), options.pathDest, 'site.json'));

		var soywebTemplate = getTemplate('soyweb');

		var filterConfig = {restore: true};

		var baseTemplateFilter = filter(path.join(pathSrc, 'layouts/base.soy'), filterConfig);
		var markdownFilter = filter(path.join(pathSrc, 'pages/**/*.md'), filterConfig);
		var pagesFilter = filter(path.join(pathSrc, 'pages/**/*.+(md|soy)'), filterConfig);

		var bundleSrc = util.synthSrc(path.join(process.cwd(), pathDest, 'js/bundle.js'));
		var vendorSrc = gulp.src(path.join(process.cwd(), pathDest, 'vendor/**/*'), {
			read: false
		});

		return gulp.src(path.join(pathSrc, '**/*.+(md|soy)'))
			.pipe(markdownFilter)
			.pipe(markdown({
				markdownOptions: options.markdownOptions
			}))
			.pipe(markdownFilter.restore)
			.pipe(pagesFilter)
			.pipe(insert.transform(function(contents) {
				if (!REGEX_SOYWEB.test(contents)) {
					contents = soywebTemplate({
						content: contents
					});
				}

				return contents;
			}))
			.pipe(pagesFilter.restore)
			.pipe(baseTemplateFilter)
			.pipe(inject(series(bundleSrc, vendorSrc), {
				ignorePath: pathDest
			}))
			.pipe(inject(gulp.src(path.join(__dirname, '../templates/metal-render.tpl')), {
				endtag: '<!-- endinject -->',
				starttag: '<!-- inject:metal:js -->',
				transform: function(filePath, file) {
					return file.contents.toString();
				}
			}))
			.pipe(inject(gulp.src(path.join(__dirname, '../templates/vendor.tpl')), {
				starttag: '<!-- inject:vendor:js -->',
				transform: function(filePath, file) {
					return _.template(file.contents.toString())({
						codeMirror: {
							theme: options.codeMirrorTheme
						},
						googleAnalytics: siteData.googleAnalytics
					});
				}
			}))
			.pipe(baseTemplateFilter.restore)
			.pipe(gulp.dest(TEMP_DIR));
	});
};
