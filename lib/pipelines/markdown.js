'use strict';

var fm = require('front-matter');
var through = require('through2');

var getMarkdownRenderer = require('../getMarkdownRenderer');
var getTemplate = require('../getTemplate');
var util = require('../util');

function markdown(options) {
	options = options || {};

	var markdownRenderer = getMarkdownRenderer(options);
	var markdownTemplate = getTemplate('markdown');

	return through.obj(function(file, enc, cb) {
		if (file.isNull()) {
			return cb(null, file);
		}

		if (file.isBuffer()) {
			var fmContent = fm(file.contents.toString('utf8'));

			fmContent.frontmatter += '\nsrcFilePath: ' + util.getSrcFilePath(file.path, options.pathSrc);

			file.contents = new Buffer(markdownTemplate({
				content: markdownRenderer.render(fmContent.body),
				frontMatter: fmContent.frontmatter
			}));

			file.path = file.path.replace('.md', '.html');
		}

		cb(null, file);
	});
}

module.exports = markdown;