'use strict';

var _ = require('lodash');
var filter = require('gulp-filter');
var frontMatter = require('gulp-front-matter');
var fs = require('fs-extra');
var insert = require('gulp-insert');
var path = require('path');
var soynode = require('gulp-soynode');

module.exports = function(options) {
	var gulp = options.gulp;
	var util = options.util;

	var runSequence = require('run-sequence').use(gulp);

	gulp.task('soyweb', function(cb) {
		runSequence('soyweb:prep', 'soyweb:compile', cb);
	});

	gulp.task('soyweb:compile', function() {
		var siteData = require(path.join(process.cwd(), 'dist/site.json'));

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
						frontMatter: file.frontMatter,
						serialized: JSON.stringify(siteDataClone),
						site: siteDataClone
					}
				}
			}))
			.pipe(htmlFilter)
			.pipe(gulp.dest('dist'));
	});

	gulp.task('soyweb:prep', function() {
		var soywebTemplate = _.template(fs.readFileSync(path.join(__dirname, '../templates/soyweb.tpl')));

		var pagesFilter = filter('src/pages/**/*.soy', {
			restore: true
		});

		return gulp.src('src/**/*.soy')
			.pipe(pagesFilter)
			.pipe(insert.transform(function(contents, file) {
				return contents + soywebTemplate();
			}))
			.pipe(pagesFilter.restore)
			.pipe(gulp.dest('temp'));
	});
};
