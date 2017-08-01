'use strict';

let combiner = require('stream-combiner');
let data = require('gulp-data');
let path = require('path');
let replace = require('gulp-token-replace');

let util = require('../util');

function tokenReplace(options) {
	let siteData = require(path.join(process.cwd(), options.pathDest, 'site.json'));

	let config = {
		prefix: '@',
		preserveUnknownTokens: true,
		suffix: '@',
		tokens: {
			site: siteData
		}
	};

	return combiner(
		data(function(file) {
			let page = util.getPageByURL(
				siteData.index, util.getPageURL(file.path));

			config.tokens.page = page;
		}),
		replace(config)
	);
}

module.exports = tokenReplace;
