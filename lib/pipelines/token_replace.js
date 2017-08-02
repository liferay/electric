'use strict';

const combiner = require('stream-combiner');
const data = require('gulp-data');
const path = require('path');
const replace = require('gulp-token-replace');

const util = require('../util');

function tokenReplace(options) {
	const siteData = require(path.join(process.cwd(), options.pathDest, 'site.json'));

	const config = {
		prefix: '@',
		preserveUnknownTokens: true,
		suffix: '@',
		tokens: {
			site: siteData
		}
	};

	return combiner(
		data(function(file) {
			const page = util.getPageByURL(
				siteData.index, util.getPageURL(file.path));

			config.tokens.page = page;
		}),
		replace(config)
	);
}

module.exports = tokenReplace;
