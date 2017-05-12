'use strict';

var _ = require('lodash');
var data = require('gulp-data');
var frontMatter = require('gulp-front-matter');
var path = require('path');
var pluck = require('gulp-pluck');

var handleError = require('../handleError');
var metaData = require('../pipelines/metaData');
var util = require('../util');

module.exports = function(options) {
	var gulp = options.gulp;
	var pathSrc = options.pathSrc;
	var taskPrefix = options.taskPrefix;

	gulp.task(taskPrefix + 'front-matter', function() {
		return gulp.src(path.join(pathSrc, 'pages/**/*.+(html|fm|md|soy)'))
			.pipe(frontMatter())
			.on('error', handleError)
			.pipe(metaData())
			.pipe(pluck('frontMatter', 'site.json'))
			.pipe(data(function(file) {
				var siteData = normalizeSiteData(file, util.getSiteData(pathSrc));

				if (options.frontMatterHook) {
					siteData = options.frontMatterHook(siteData);
				}

				file.contents = new Buffer(JSON.stringify(siteData));
			}))
			.pipe(gulp.dest(options.pathDest));
	});
};

function normalizeSiteData(file, json) {
	var siteData = _.reduce(file.frontMatter, function(result, item) {
		var treeLocation = util.getTreeLocation(item.srcFilePath);

		_.merge(result, _.set({}, treeLocation, item));

		return result;
	}, json);

	util.sortChildren(siteData.index);

	util.configureBlog(siteData.index);

	return siteData;
}
