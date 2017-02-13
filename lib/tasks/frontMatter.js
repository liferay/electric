'use strict';

var _ = require('lodash');
var data = require('gulp-data');
var frontMatter = require('gulp-front-matter');
var path = require('path');
var pluck = require('gulp-pluck');

var metaData = require('../pipelines/metaData');
var util = require('../util');

module.exports = function(options) {
	var gulp = options.gulp;
	var pathSrc = options.pathSrc;
	var taskPrefix = options.taskPrefix;

	gulp.task(taskPrefix + 'front-matter', function() {
		return gulp.src(path.join(pathSrc, 'pages/**/*.+(fm|md|soy)'))
			.pipe(frontMatter())
			.pipe(metaData())
			.pipe(pluck('frontMatter', 'site.json'))
			.pipe(data(function(file) {
				var siteData = normalizeSiteData(file, require(path.join(process.cwd(), pathSrc, 'site.json')));

				addRepoData(siteData);

				file.contents = new Buffer(JSON.stringify(siteData));
			}))
			.pipe(gulp.dest(options.pathDest));
	});
};

function addRepoData(siteData) {
	var url;

	try {
		var pkg = require(path.join(process.cwd(), 'package.json'));

		if (pkg && pkg.repository) {
			url = resolveRepositoryURL(pkg.repository);
		}
	}
	catch (e) {}

	siteData.repo = url;
}

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

function resolveRepositoryURL(repository) {
	var url;

	if (repository.url) {
		url = repository.url;
	}
	else {
		var repositoryArray = repository.split(':');
		var type = 'github';

		if (repositoryArray.length === 2) {
			type = repositoryArray[0];
			repository = repositoryArray[1];
		}
		else {
			repository = repositoryArray[0];
		}

		if (type === 'github' || type === 'gitlab') {
			url = 'https://' + type + '.com/' + repository;
		}
		else if (type === 'bitbucket') {
			url = 'https://bitbucket.org/' + repository;
		}
	}

	return url;
}
