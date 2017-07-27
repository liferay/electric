'use strict';

const _ = require('lodash');
const data = require('gulp-data');
const frontMatter = require('gulp-front-matter');
const path = require('path');
const pluck = require('gulp-pluck');

const handleError = require('../handleError');
const metaData = require('../pipelines/metaData');
const util = require('../util');

module.exports = function(options) {
	const gulp = options.gulp;
	const pathSrc = options.pathSrc;
	const taskPrefix = options.taskPrefix;

	gulp.task(taskPrefix + 'front-matter', function() {
		return gulp
			.src(path.join(pathSrc, 'pages/**/*.+(html|fm|md|soy)'))
			.pipe(frontMatter())
			.on('error', handleError)
			.pipe(metaData())
			.pipe(pluck('frontMatter', 'site.json'))
			.pipe(
				data(function(file) {
					let siteData = normalizeSiteData(file, util.getSiteData(pathSrc));

					if (options.frontMatterHook) {
						siteData = options.frontMatterHook(siteData);
					}

					file.contents = new Buffer(JSON.stringify(siteData));
				})
			)
			.pipe(gulp.dest(options.pathDest));
	});
};

function normalizeSiteData(file, json) {
	const siteData = _.reduce(
		file.frontMatter,
		function(result, item) {
			const treeLocation = util.getTreeLocation(item.srcFilePath);

			_.merge(result, _.set({}, treeLocation, item));

			return result;
		},
		json
	);

	util.sortChildren(siteData.index);

	util.configureBlog(siteData.index);

	return siteData;
}
