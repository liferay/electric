'use strict';

var _ = require('lodash');
var fm = require('front-matter');
var through = require('through2');

var getTemplate = require('../getTemplate');
var util = require('../util');

function layout(options) {
	options = options || {};

	var layoutTemplate = getTemplate('layout');

	return through.obj(function(file, enc, cb) {
		if (file.isNull()) {
			return cb(null, file);
		}

		if (file.isBuffer()) {
			var fileContents = file.contents.toString('utf8');

			var fmContent = fm(fileContents);

			var attributes = fmContent.attributes;

			if (attributes.layout) {
				if (!attributes.srcFilePath) {
					fmContent.frontmatter += '\nsrcFilePath: ' + util.getSrcFilePath(file.path, options.pathSrc);
				}

				file.contents = new Buffer(layoutTemplate({
					content: fmContent.body,
					frontMatter: options.remove ? null : fmContent.frontmatter,
					layout: attributes.layout,
					namespace: attributes.namespace || util.generateNamespace(_.camelCase(util.getPageURL(file.path)))
				}));

				file.path = file.path.replace('.html', '.soy');
			}
		}

		cb(null, file);
	});
}

module.exports = layout;