'use strict';

const _ = require('lodash');
const through = require('through2');

const util = require('../util');

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

			const url = util.getPageURL(file.path);

			file.frontMatter.location = url;

			if (!file.frontMatter.url) {
				file.frontMatter.url = url;

				if (options.basePath) {
					file.frontMatter.url = options.basePath + file.frontMatter.url;
				}
			} else {
				file.frontMatter.customURL = true;
			}
		}

		cb(null, file);
	});
}

module.exports = metaData;
