'use strict';

var _ = require('lodash');
var fm = require('front-matter');
var fs = require('fs');
var Remarkable = require('remarkable');
var path = require('path');
var through = require('through2');

var util = require('../util');

var md = new Remarkable();

function markdown(options) {
	options = options || {};

	md.set(_.defaults(options.markdownOptions, {
		html: true
	}));

	var soywebMarkdownTemplate = _.template(fs.readFileSync(path.join(__dirname, '../templates/soyweb-markdown.tpl')));

	return through.obj(function(file, enc, cb) {
		if (file.isNull()) {
			return cb(null, file);
		}

		if (file.isBuffer()) {
			var fileContents = file.contents.toString('utf8');

			var fmContent = fm(fileContents);

			var attributes = fmContent.attributes;

			fmContent.frontmatter += '\nsrcFilePath: ' + util.getSrcFilePath(file.path, options.pathSrc);

			file.contents = new Buffer(soywebMarkdownTemplate({
				content: md.render(fmContent.body),
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