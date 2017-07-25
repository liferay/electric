'use strict';

let _ = require('lodash');
const createRss = require('../createRss');
let data = require('gulp-data');
let frontMatter = require('gulp-front-matter');
let path = require('path');
let pluck = require('gulp-pluck');

let handleError = require('../handleError');
let metaData = require('../pipelines/metaData');
let util = require('../util');

module.exports = function(options) {
	let gulp = options.gulp;
	let pathSrc = options.pathSrc;
	let taskPrefix = options.taskPrefix;

	gulp.task(taskPrefix + 'front-matter', function() {
		return gulp
			.src(path.join(pathSrc, 'pages/**/*.+(html|fm|md|soy)'))
			.pipe(frontMatter())
			.on('error', handleError)
			.pipe(metaData())
			.pipe(pluck('frontMatter', 'site.json'))
			.pipe(
				data(function(file) {
					let siteData = normalizeSiteData(
						file,
						util.getSiteData(pathSrc),
						options
					);

					if (options.frontMatterHook) {
						siteData = options.frontMatterHook(siteData);
					}

					file.contents = new Buffer(JSON.stringify(siteData));
				})
			)
			.pipe(gulp.dest(options.pathDest));
	});
};

function normalizeSiteData(file, json, options) {
	let siteData = _.reduce(
		file.frontMatter,
		function(result, item) {
			let treeLocation = util.getTreeLocation(item.srcFilePath);

			_.merge(result, _.set({}, treeLocation, item));

			return result;
		},
		json
	);

	util.sortChildren(siteData.index);

	util.configureBlog(siteData.index);

	if (options.rss.enabled) {
		createRss(siteData, options);
	}

	return siteData;
}
