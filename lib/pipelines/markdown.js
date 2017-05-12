'use strict';

let fm = require('front-matter');
let through = require('through2');

let getMarkdownRenderer = require('../getMarkdownRenderer');
let getTemplate = require('../getTemplate');
let util = require('../util');

function markdown(options) {
	options = options || {};

	let markdownRenderer = getMarkdownRenderer(options);
	let markdownTemplate = getTemplate('markdown');

	return through.obj(function(file, enc, cb) {
		if (file.isNull()) {
			return cb(null, file);
		}

		if (file.isBuffer()) {
			let fmContent = fm(file.contents.toString('utf8'));

			fmContent.frontmatter +=
				'\nsrcFilePath: ' + util.getSrcFilePath(file.path, options.pathSrc);

			file.contents = new Buffer(
				markdownTemplate({
					content: markdownRenderer.render(fmContent.body),
					frontMatter: fmContent.frontmatter
				})
			);

			file.path = file.path.replace('.md', '.html');
		}

		cb(null, file);
	});
}

module.exports = markdown;
