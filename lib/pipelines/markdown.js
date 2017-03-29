'use strict';

var _ = require('lodash');
var fm = require('front-matter');
var Remarkable = require('remarkable');
var through = require('through2');

var getTemplate = require('../getTemplate');
var util = require('../util');

var md = new Remarkable();

var fence = md.renderer.rules.fence;

md.renderer.rules.fence = function(tokens, idx) {
	var token = tokens[idx];

	if (token.type !== 'fence') {
		return fence.apply(this, arguments);
	}

	var lang = token.params || 'text';

	return '{call ElectricCode.render}{param code kind="text"}{literal}' + _.trimEnd(token.content) + '{/literal}{/param}{param mode: \'' + lang + '\' /}{/call}';
};

function markdown(options) {
	options = options || {};

	if (_.isFunction(options.markdownRenderer)) {
		md = options.markdownRenderer(md);
	}
	else if (!_.isUndefined(options.markdownRenderer)) {
		md = options.markdownRenderer;
	}

	md.set(_.defaults(options.markdownOptions, {
		html: true
	}));

	var markdownTemplate = getTemplate('markdown');

	return through.obj(function(file, enc, cb) {
		if (file.isNull()) {
			return cb(null, file);
		}

		if (file.isBuffer()) {
			var fmContent = fm(file.contents.toString('utf8'));

			fmContent.frontmatter += '\nsrcFilePath: ' + util.getSrcFilePath(file.path, options.pathSrc);

			file.contents = new Buffer(markdownTemplate({
				content: md.render(fmContent.body),
				frontMatter: fmContent.frontmatter
			}));

			file.path = file.path.replace('.md', '.html');
		}

		cb(null, file);
	});
}

module.exports = markdown;