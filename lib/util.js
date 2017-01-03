'use strict';

var _ = require('lodash');
var path = require('path');

var REGEX_FILE_EXT = /\.[\w]+$/;

var REGEX_NAMESPACE = /{namespace\s([a-zA-Z]+)}/;

var util = {
	getFilePathArray: function(filePath, basePath) {
		basePath = basePath !== undefined ? basePath : 'src/pages';

		filePath = path.relative(
			path.join(process.cwd(), basePath),
			filePath
		);

		return filePath.split(path.sep);
	},

	getNamespaceFromContents: function(file) {
		return file.contents.toString().match(REGEX_NAMESPACE)[1];
	},

	getPageURL: function(filePath, basePath) {
		if (_.endsWith(filePath, '.fm')) {
			return;
		}

		var filePathArray = util.getFilePathArray(filePath, basePath);

		var pageURL = filePathArray.join('/');

		if (path.basename(pageURL, path.extname(pageURL)) === 'index') {
			pageURL = path.dirname(pageURL);
		}

		return '/' + pageURL.replace(REGEX_FILE_EXT, '.html');
	},

	getSrcFilePath: function(filePath, srcPath) {
		return util.getFilePathArray(filePath, '').join('/').replace('temp', srcPath);
	},

	getTreeLocation: function(filePath) {
		filePath = filePath.replace(REGEX_FILE_EXT, '');

		var filePathArray = util.getFilePathArray(filePath);

		var treeLocation = _.reduce(filePathArray, function(result, item) {
			if (item === 'index') {
				return result;
			}

			result.push('children');
			result.push(item);

			return result;
		}, ['index']).join('.');

		return treeLocation;
	},

	setActive: function(indexPage, url) {
		var pageURL = indexPage.location || indexPage.url;

		if ((pageURL === url) || (pageURL !== '/' && url.indexOf(pageURL) === 0)) {
			indexPage.active = true;
		}

		_.forEach(indexPage.children, function(child) {
			util.setActive(child, url);
		});
	},

	sortByWeight: function(children) {
		return _.sortBy(children, ['weight', 'title']);
	},

	sortChildren: function(indexPage) {
		if (indexPage.children) {
			indexPage.children = util.sortByWeight(indexPage.children);

			_.forEach(indexPage.children, function(item) {
				util.sortChildren(item);
			});
		}
	}
};

module.exports = util;
