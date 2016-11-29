'use strict';

var _ = require('lodash');
var filter = require('gulp-filter');
var frontMatter = require('gulp-front-matter');
var fs = require('fs-extra');
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

		return gulp.src(['temp/**/*.soy'], {
				base: 'temp/pages'
			})
			.pipe(frontMatter())
			.pipe(soynode({
				renderSoyWeb: true,
				renderSoyWebContext: function(file) {
					var siteDataClone = _.cloneDeep(siteData);

					util.setActive(
						siteDataClone.index,
						util.getPageURL(file.path)
					);

					file.frontMatter.componentName = util.getNamespaceFromContents(file);

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

		var markdownFilter = filter(path.join(pathSrc, 'pages/**/*.md'), {
			restore: true
		});

		var pagesFilter = filter(path.join(pathSrc, 'pages/**/*.+(md|soy)'), {
			restore: true
		});

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
			.pipe(gulp.dest('temp'));
	});
};
