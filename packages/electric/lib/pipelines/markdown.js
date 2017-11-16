'use strict';

const fm = require('front-matter');
const through = require('through2');

const getMarkdownRenderer = require('../get_markdown_renderer');
const getTemplate = require('../get_template');
const util = require('../util');

function markdown(options) {
	options = options || {};

	const markdownRenderer = getMarkdownRenderer(options);
	const markdownTemplate = getTemplate('markdown');

	return through.obj(function(file, enc, cb) {
		if (file.isNull()) {
			return cb(null, file);
		}

		if (file.isBuffer()) {
			const fmContent = fm(file.contents.toString('utf8'));

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
