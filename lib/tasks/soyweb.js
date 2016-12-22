'use strict';

var _ = require('lodash');
var filter = require('gulp-filter');
var frontMatter = require('gulp-front-matter');
var fs = require('fs-extra');
var inject = require('gulp-inject');
var insert = require('gulp-insert');
var path = require('path');
var soynode = require('gulp-soynode');

var markdown = require('../pipelines/markdown');

module.exports = function(options) {
	var gulp = options.gulp;
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

		var srcPath = ['temp/**/*.soy'];

		var plugins = options.plugins;

		if (plugins.length) {
			_.forEach(plugins, function(plugin) {
				srcPath.push('node_modules/**/' + plugin + '/src/**/*.soy');
			});
		}

		return gulp.src(srcPath, {
				base: 'temp/pages'
			})
			.pipe(frontMatter())
			.pipe(soynode({
				renderSoyWeb: true,
				renderSoyWebContext: function(file) {
					var filePath = file.path;

					var siteDataClone = _.cloneDeep(siteData);

					util.setActive(
						siteDataClone.index,
						util.getPageURL(filePath, 'temp/pages')
					);

					file.frontMatter.componentName = util.getNamespaceFromContents(file);

					if (!file.frontMatter.srcFilePath) {
						file.frontMatter.srcFilePath = util.getSrcFilePath(filePath, options.pathSrc);
					}

					return {
						page: file.frontMatter,
						serialized: JSON.stringify({
							page: file.frontMatter,
							site: siteDataClone
						}),
						site: siteDataClone
					}
				}
			}))
			.pipe(htmlFilter)
			.pipe(gulp.dest(options.pathDest));
	});

	gulp.task(taskPrefix + 'soyweb:prep', function() {
		var soywebTemplate = _.template(fs.readFileSync(path.join(__dirname, '../templates/soyweb.tpl')));

		var filterConfig = {restore: true};

		var baseTemplateFilter = filter(path.join(pathSrc, 'layouts/base.soy'), filterConfig);
		var markdownFilter = filter(path.join(pathSrc, 'pages/**/*.md'), filterConfig);
		var pagesFilter = filter(path.join(pathSrc, 'pages/**/*.+(md|soy)'), filterConfig);

		return gulp.src(path.join(pathSrc, '**/*.+(md|soy)'))
			.pipe(markdownFilter)
			.pipe(markdown({
				markdownOptions: options.markdownOptions
			}))
			.pipe(markdownFilter.restore)
			.pipe(pagesFilter)
			.pipe(insert.transform(function(contents, file) {
				return soywebTemplate({
					content: contents
				});
			}))
			.pipe(pagesFilter.restore)
			.pipe(baseTemplateFilter)
			.pipe(inject(gulp.src(path.join(__dirname, '../templates/metal-render.tpl')), {
				endtag: '<!-- endinject -->',
				starttag: '<!-- inject:metal:js -->',
				transform: function(filePath, file) {
					return file.contents.toString();
				}
			}))
			.pipe(baseTemplateFilter.restore)
			.pipe(gulp.dest('temp'));
	});
};
