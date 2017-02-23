'use strict';

var _ = require('lodash');
var through = require('through2');

var util = require('../util');

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

			var url = util.getPageURL(file.path);

			if (!file.frontMatter.url) {
				file.frontMatter.url = url;
			}
			else {
				file.frontMatter.location = url;
			}
		}

		cb(null, file);
	});
}

module.exports = metaData;