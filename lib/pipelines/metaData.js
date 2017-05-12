'use strict';

let _ = require('lodash');
let through = require('through2');

let util = require('../util');

function metaData(options) {
	options = options || {};

	return through.obj(function(file, enc, cb) {
		if (file.isNull()) {
			return cb(null, file);
		}

		if (file.isBuffer()) {
			_.assign(file.frontMatter, {
				content: util.stripCode(file),
				srcFilePath: util.getSrcFilePath(file.path)
			});

			if (!file.frontMatter.id) {
				file.frontMatter.id = util.getPageId(file.path);
			}

			let url = util.getPageURL(file.path);

			if (!file.frontMatter.url) {
				file.frontMatter.url = url;
			} else {
				file.frontMatter.location = url;
			}
		}

		cb(null, file);
	});
}

module.exports = metaData;
