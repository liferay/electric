'use strict';

var _ = require('lodash');
var path = require('path');

var REGEX_NAMESPACE = /{namespace\s([a-zA-Z]+)}/;

var util = {
	getFilePathArray: function(filePath) {
		filePath = path.relative(
			path.join(process.cwd(), 'src/pages'),
			filePath
		);

		return filePath.split(path.sep);
	},

	getNamespaceFromContents: function(file) {
		return file.contents.toString().match(REGEX_NAMESPACE)[1];
	},

	getPageURL: function(filePath) {
		var filePathArray = util.getFilePathArray(filePath);

		_.pull(filePathArray, 'index.soy');

		return '/' + filePathArray.join('/').replace('.soy', '.html');
	},

	getTreeLocation: function(filePath) {
		var filePathArray = util.getFilePathArray(filePath);

		var treeLocation = _.reduce(filePathArray, function(result, item, key) {
			if (item === 'index.soy') {
				return result;
			}

			result.push('children');
			result.push(item);

			return result;
		}, ['index']).join('.');

		if (_.endsWith(treeLocation, '.soy')) {
			treeLocation = path.basename(treeLocation, '.soy');
		}

		return treeLocation;
	},

	setActive: function(indexPage, url) {
		var pageURL = indexPage.url;

		if ((pageURL === url) || (pageURL !== '/' && url.indexOf(pageURL) > -1)) {
			indexPage.active = true;
		}

		_.forEach(indexPage.children, function(child, index) {
			util.setActive(child, url);
		});
	},

	sortByWeight: function(children) {
		return _.sortBy(children, ['weight', 'title']);
	},

	sortChildren: function(indexPage) {
		if (indexPage.children) {
			indexPage.children = util.sortByWeight(indexPage.children);

			_.forEach(indexPage.children, function(item, index) {
				util.sortChildren(item);
			});
		}
	}
};

module.exports = util;
