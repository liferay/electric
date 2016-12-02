'use strict';

var _ = require('lodash');
var data = require('gulp-data');
var frontMatter = require('gulp-front-matter');
var fs = require('fs-extra');
var path = require('path');
var pluck = require('gulp-pluck');

var pkg = require(path.join(process.cwd(), 'package.json'));

module.exports = function(options) {
	var gulp = options.gulp;
	var taskPrefix = options.taskPrefix;
	var util = options.util;

	gulp.task(taskPrefix + 'front-matter', function() {
		return gulp.src(path.join(options.pathSrc, 'pages/**/*.+(fm|md|soy)'))
			.pipe(frontMatter())
			.pipe(data(function(file) {
				file.frontMatter.srcFilePath = util.getSrcFilePath(file.path);

				if (!file.frontMatter.url) {
					file.frontMatter.url = util.getPageURL(file.path);
				}
			}))
			.pipe(pluck('frontMatter', 'site.json'))
			.pipe(data(function(file) {
				var frontMatterTree = _.reduce(file.frontMatter, function(tree, item, index) {
					var treeLocation = util.getTreeLocation(item.srcFilePath);

					_.merge(tree, _.set({}, treeLocation, item));

					return tree;
				}, {});

				util.sortChildren(frontMatterTree.index);

				var repo;

				if (pkg && pkg.repository) {
					repo = pkg.repository.url || pkg.repository;
				}

				frontMatterTree.repo = repo;

				file.contents = new Buffer(JSON.stringify(frontMatterTree, null, '\t'))
			}))
			.pipe(gulp.dest(options.pathDest));
	});
};
