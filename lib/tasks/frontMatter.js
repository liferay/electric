'use strict';

var _ = require('lodash');
var data = require('gulp-data');
var frontMatter = require('gulp-front-matter');
var fs = require('fs-extra');
var path = require('path');

module.exports = function(options) {
	var gulp = options.gulp;
	var util = options.util;

	gulp.task('front-matter', function() {
		var frontMatterTree = {};

		return gulp.src('src/pages/**/*.soy')
			.pipe(frontMatter())
			.pipe(data(function(file) {
				var filePath = file.path;

				var fileFrontMatter = file.frontMatter;

				fileFrontMatter.url = util.getPageURL(filePath);

				_.merge(
					frontMatterTree,
					_.set({}, util.getTreeLocation(filePath), fileFrontMatter)
				);

				return file;
			}))
			.on('end', function() {
				var children = frontMatterTree.index.children;

				if (children) {
					frontMatterTree.index.children = util.sortChildren(children);
				}

				fs.outputFileSync(
					path.join(process.cwd(), 'dist/site.json'),
					JSON.stringify(frontMatterTree, null, '\t')
				);
			});
	});
};
