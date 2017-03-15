'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var resolve = require('resolve');
var sourceStream = require('vinyl-source-stream');
var stripHtml = require('striptags');
var stripMarkdown = require('remove-markdown');

var watching = false;

var namespaceMap = {};

var REGEX_FILE_EXT = /\.[\w]+$/;

var REGEX_NAMESPACE = /{namespace\s([a-zA-Z]+)}/;

var REGEX_SOY = /\/\*\*[\s\S]+\*\/|{.*}/g;

var REGEX_WHITESPACE = /[\s]+/g;

var util = {
	configureBlog: function(indexPage) {
		var children = indexPage.children;

		if (indexPage.type === 'blog') {
			indexPage.childIds = util.sortByDate(children);

			indexPage.redirect = children[indexPage.childIds[0]].url;
		}
		else if (children) {
			_.forEach(children, function(item) {
				util.configureBlog(item);
			});
		}
	},

	generateNamespace: function(key) {
		var namespace = namespaceMap[key];

		if (!namespace) {
			namespace = '';
			var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

			for (var i = 0; i < 5; i++) {
				namespace += characters.charAt(Math.floor(Math.random() * characters.length));
			}

			namespaceMap[key] = namespace;
		}

		return namespace;
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

		if (indexPage.location && indexPage.location === url) {
			page = indexPage;
		}
		else if (!indexPage.location && indexPage.url === url) {
			page = indexPage;
		}

		if (!page) {
			_.some(indexPage.children, function(item) {
				page = util.getPageByURL(item, url);

				return page;
			});
		}

		return page;
	},

	getPageId: function(filePath) {
		var id = path.basename(filePath, path.extname(filePath));

		// TODO: let root index page be index
		if (id === 'index') {
			id = path.basename(path.dirname(filePath));
		}

		return id;
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

	getSiteData: function(rootPath) {
		return JSON.parse(fs.readFileSync(path.join(process.cwd(), rootPath, 'site.json')));
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

	isWatching: function() {
		return watching;
	},

	resolveMetalSoyPaths: function(components) {
		var cwd = process.cwd();

		return _.map(components, function(component) {
			var resolved = resolve.sync(component + '/package.json', {
				basedir: cwd
			});

			return path.join(resolved, '../src/**/*.soy')
		});
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
		return _.keys(children).sort(function(a, b) {
			a = children[a];
			b = children[b];

			a = Date.parse(a.date);
			b = Date.parse(b.date);

			if (a > b) {
				return -1;
			}
			else if (a < b) {
				return 1;
			}

			return 0;
		});
	},

	sortByWeight: function(children) {
		return _.map(_.sortBy(children, ['weight', 'title']), function(child) {
			return child.id;
		});
	},

	sortChildren: function(indexPage) {
		if (indexPage.children) {
			indexPage.childIds = util.sortByWeight(indexPage.children);

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
	},

	synthSrc: function(filename) {
		var src = sourceStream(filename);

		src.end('');

		return src;
	},

	watch: function() {
		watching = true;
	}
};

module.exports = util;
