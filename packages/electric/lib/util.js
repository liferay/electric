'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const resolve = require('resolve');
const sourceStream = require('vinyl-source-stream');
const stripHtml = require('striptags');
const stripMarkdown = require('remove-markdown');

let watching = false;

const namespaceMap = {};

const REGEX_FILE_EXT = /\.[\w]+$/;

const REGEX_NAMESPACE = /{namespace\s([a-zA-Z]+)}/;

const REGEX_REF = /[\\/]api[\\/]([^\\/]+)[\\/]/;

const REGEX_SOY = /\/\*\*[\s\S]+\*\/|{.*}/g;

const REGEX_WHITESPACE = /[\s]+/g;

const util = {
	configureBlog: function(indexPage) {
		util.forEachType(indexPage, 'blog', function(page) {
			const children = page.children;

			page.childIds = util.sortByDate(children);
		});
	},

	configureTopbar: function(siteData) {
		let topbar = [];
		let page = {};

		siteData.index.childIds.forEach(function(childId) {
			page = siteData.index.children[childId];

			if (!page.hidden) {
				topbar.push({
					href: page.redirect || page.url,
					label: page.title,
					selected: page.active,
					target: page.target,
					type: page.type,
					variant: page.topbarVariant
				});
			}
		});

		siteData.topbar = topbar;
	},

	forEachType: function(indexPage, type, modifier) {
		const children = indexPage.children;

		if (indexPage.type === type) {
			modifier(indexPage);
		} else if (children) {
			_.forEach(children, function(item) {
				util.forEachType(item, type, modifier);
			});
		}
	},

	generateNamespace: function(key) {
		let namespace = namespaceMap[key];

		if (!namespace) {
			namespace = '';
			const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

			for (let i = 0; i < 5; i++) {
				namespace += characters.charAt(
					Math.floor(Math.random() * characters.length)
				);
			}

			namespaceMap[key] = namespace;
		}

		return namespace;
	},

	getFilePathArray: function(filePath, basePath) {
		basePath = basePath !== undefined ? basePath : 'src/pages';

		filePath = path.relative(path.join(process.cwd(), basePath), filePath);

		return filePath.split(path.sep);
	},

	getNamespaceFromContents: function(file) {
		return file.contents.toString().match(REGEX_NAMESPACE)[1];
	},

	getPageByURL: function(indexPage, url) {
		let page;

		if (indexPage.location && indexPage.location === url) {
			page = indexPage;
		} else if (!indexPage.customURL && indexPage.url === url) {
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
		let id = path.basename(filePath, path.extname(filePath));

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

		const filePathArray = util.getFilePathArray(filePath, basePath);

		let pageURL = filePathArray.join('/');

		if (path.basename(pageURL, path.extname(pageURL)) === 'index') {
			pageURL = path.dirname(pageURL);
		}

		pageURL = '/' + pageURL.replace(REGEX_FILE_EXT, '.html');

		if (pageURL.indexOf('.html') === -1) {
			pageURL += '/';
		}

		return pageURL;
	},

	getRefFromPath: function(filePath) {
		let ref;

		const match = filePath.match(REGEX_REF);

		if (match) {
			ref = match[1];
		}

		return ref;
	},

	getSiteData: function(rootPath) {
		return JSON.parse(
			fs.readFileSync(path.join(process.cwd(), rootPath, 'site.json'))
		);
	},

	getSrcFilePath: function(filePath, srcPath) {
		return util
			.getFilePathArray(filePath, '')
			.join('/')
			.replace('.temp', srcPath);
	},

	getTreeLocation: function(filePath) {
		filePath = filePath.replace(REGEX_FILE_EXT, '');

		const filePathArray = util.getFilePathArray(filePath);

		const treeLocation = _.reduce(
			filePathArray,
			function(result, item) {
				if (item === 'index') {
					return result;
				}

				result.push('children');
				result.push(item);

				return result;
			},
			['index']
		).join('.');

		return treeLocation;
	},

	isWatching: function() {
		return watching;
	},

	resolveMetalSoyPaths: function(components) {
		const cwd = process.cwd();

		return _.map(components, function(component) {
			const resolved = resolve.sync(component + '/package.json', {
				basedir: cwd
			});

			return path.join(resolved, '../src/**/*.soy');
		});
	},

	setActive: function(indexPage, url) {
		const pageURL = indexPage.location || indexPage.url;

		if (pageURL === url || (pageURL !== '/' && url.indexOf(pageURL) === 0)) {
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
			} else if (a < b) {
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
		let content = stripHtml(file.contents.toString());

		if (path.extname(file.path) === '.md') {
			content = stripMarkdown(content);
		} else {
			content = content.replace(REGEX_SOY, '');
		}

		content = content.replace(REGEX_WHITESPACE, ' ');

		return content;
	},

	synthSrc: function(filename) {
		const src = sourceStream(filename);

		src.end('');

		return src;
	},

	watch: function() {
		watching = true;
	}
};

module.exports = util;
