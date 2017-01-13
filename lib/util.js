'use strict';

var _ = require('lodash');
var path = require('path');
var stripHtml = require('striptags');
var stripMarkdown = require('remove-markdown');

var REGEX_FILE_EXT = /\.[\w]+$/;

var REGEX_NAMESPACE = /{namespace\s([a-zA-Z]+)}/;

var REGEX_SOY = /\/\*\*[\s\S]+\*\/|{.*}/g;

var REGEX_WHITESPACE = /[\s]+/g;

var util = {
	configureBlog: function(indexPage) {
		var children = indexPage.children;

		if (indexPage.type === 'blog') {
			children = util.sortByDate(children);

			indexPage.children = children;
			indexPage.redirect = children[0].url;
		}
		else if (children) {
			_.forEach(children, function(item) {
				util.configureBlog(item);
			});
		}
	},

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

	getPageByURL: function(indexPage, url) {
		var page;

		if (indexPage.url === url) {
			page = indexPage;
		}

		if (!page) {
			_.some(indexPage.children, function(item) {
				page = util.getPage(item, url);

				return page;
			});
		}

		return page;
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

		delete indexPage.content;

		_.forEach(indexPage.children, function(child) {
			util.setActive(child, url);
		});
	},

	sortByDate: function(children) {
		return children.sort(function(a, b) {
			a = Date.parse(a.date);
			b = Date.parse(b.date);

			if (a < b) {
				return -1;
			}
			else if (a > b) {
				return 1;
			}

			return 0;
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
	},

	stripCode: function(file) {
		var content = stripHtml(file.contents.toString());

		if (path.extname(file.path) === '.md') {
			content = stripMarkdown(content);
		}
		else {
			content = content.replace(REGEX_SOY, '');
		}

		content = content.replace(REGEX_WHITESPACE, ' ');

		return content;
	}
};

module.exports = util;
