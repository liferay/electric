'use strict';

const _ = require('lodash');
const fm = require('front-matter');
const through = require('through2');

const getTemplate = require('../get_template');
const util = require('../util');

function layout(options) {
	options = options || {};

	const layoutTemplate = getTemplate('layout');

	return through.obj(function(file, enc, cb) {
		if (file.isNull()) {
			return cb(null, file);
		}

		if (file.isBuffer()) {
			const fileContents = file.contents.toString('utf8');

			const fmContent = fm(fileContents);

			const attributes = fmContent.attributes;

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
						namespace:
							attributes.namespace ||
								util.generateNamespace(
									_.camelCase(util.getPageURL(file.path))
								)
					})
				);

				file.path = file.path.replace('.html', '.soy');
			}
		}

		cb(null, file);
	});
}

module.exports = layout;
