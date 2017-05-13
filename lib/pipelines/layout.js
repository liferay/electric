'use strict';

let _ = require('lodash');
let fm = require('front-matter');
let through = require('through2');

let getTemplate = require('../getTemplate');
let util = require('../util');

function layout(options) {
	options = options || {};

	let layoutTemplate = getTemplate('layout');

	return through.obj(function(file, enc, cb) {
		if (file.isNull()) {
			return cb(null, file);
		}

		if (file.isBuffer()) {
			let fileContents = file.contents.toString('utf8');

			let fmContent = fm(fileContents);

			let attributes = fmContent.attributes;

			if (attributes.layout) {
				if (!attributes.srcFilePath) {
					fmContent.frontmatter +=
						'\nsrcFilePath: ' +
						util.getSrcFilePath(file.path, options.pathSrc);
				}

				file.contents = new Buffer(
					layoutTemplate({
						content: fmContent.body,
						frontMatter: options.remove ? null : fmContent.frontmatter,
						layout: attributes.layout,
						namespace: attributes.namespace ||
							util.generateNamespace(_.camelCase(util.getPageURL(file.path)))
					})
				);

				file.path = file.path.replace('.html', '.soy');
			}
		}

		cb(null, file);
	});
}

module.exports = layout;
