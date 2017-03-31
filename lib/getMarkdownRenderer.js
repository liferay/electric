'use strict';

var _ = require('lodash');
var Remarkable = require('remarkable');

var markdownRenderer;

function getMarkdownRenderer(options) {
	if (!markdownRenderer) {
		markdownRenderer = new Remarkable();

		var fence = markdownRenderer.renderer.rules.fence;

		markdownRenderer.renderer.rules.fence = function(tokens, idx) {
			var token = tokens[idx];

			if (token.type !== 'fence') {
				return fence.apply(this, arguments);
			}

			var lang = token.params || 'text';

			return '{call ElectricCode.render}{param code kind="text"}{literal}' + _.trimEnd(token.content) + '{/literal}{/param}{param mode: \'' + lang + '\' /}{/call}';
		};

		if (_.isFunction(options.markdownRenderer)) {
			markdownRenderer = options.markdownRenderer(markdownRenderer);
		}
		else if (!_.isUndefined(options.markdownRenderer)) {
			markdownRenderer = options.markdownRenderer;
		}

		markdownRenderer.set(_.defaults(options.markdownOptions, {
			html: true
		}));
	}

	return markdownRenderer;
}

module.exports = getMarkdownRenderer;