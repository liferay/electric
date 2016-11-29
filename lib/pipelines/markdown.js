'use strict';

var _ = require('lodash');
var fm = require('front-matter');
var fs = require('fs');
var marked = require('marked');
var path = require('path');
var through = require('through2');

var util = require('../util');

function markdown(options) {
	options = options || {};

	var markedOptions = options.markedOptions;

	if (markedOptions) {
		marked.setOptions(markedOptions);
	}

	var soywebMarkdownTemplate = _.template(fs.readFileSync(path.join(__dirname, '../templates/soyweb-markdown.tpl')));

	return through.obj(function(file, enc, cb) {
		if (file.isNull()) {
			return cb(null, file);
		}

		if (file.isBuffer()) {
			var fileContents = file.contents.toString('utf8');

			var fmContent = fm(fileContents);

			var attributes = fmContent.attributes;

			file.contents = new Buffer(soywebMarkdownTemplate({
				content: marked(fmContent.body),
				frontMatter: options.remove ? null : fmContent.frontmatter,
				layout: attributes.layout || 'main',
				namespace: _.camelCase(util.getPageURL(file.path)),
				soyweb: options.soyweb
			}));

			file.path = file.path.replace('.md', '.soy');
		}

		cb(null, file);
	});
}

module.exports = markdown;