'use strict';

var _ = require('lodash');
var data = require('gulp-data');
var frontMatter = require('gulp-front-matter');
var path = require('path');
var pluck = require('gulp-pluck');

module.exports = function(options) {
	var gulp = options.gulp;
	var pathSrc = options.pathSrc;
	var taskPrefix = options.taskPrefix;
	var util = options.util;

	gulp.task(taskPrefix + 'front-matter', function() {
		return gulp.src(path.join(pathSrc, 'pages/**/*.+(fm|md|soy)'))
			.pipe(frontMatter())
			.pipe(data(function(file) {
				file.frontMatter.srcFilePath = util.getSrcFilePath(file.path);

				var url = util.getPageURL(file.path);

				if (!file.frontMatter.url) {
					file.frontMatter.url = url;
				}
				else {
					file.frontMatter.location = url;
				}
			}))
			.pipe(pluck('frontMatter', 'site.json'))
			.pipe(data(function(file) {
				const siteJSON = require(path.join(process.cwd(), pathSrc, 'site.json'));

				var siteData = _.reduce(file.frontMatter, function(result, item) {
					var treeLocation = util.getTreeLocation(item.srcFilePath);

					_.merge(result, _.set({}, treeLocation, item));

					return result;
				}, siteJSON);

				util.sortChildren(siteData.index);

				var repo;

				try {
					var pkg = require(path.join(process.cwd(), 'package.json'));

					if (pkg && pkg.repository) {
						repo = pkg.repository.url || pkg.repository;
					}
				}
				catch (e) {}

				siteData.repo = repo;

				file.contents = new Buffer(JSON.stringify(siteData, null, '\t'));
			}))
			.pipe(gulp.dest(options.pathDest));
	});
};
