'use strict';

let _ = require('lodash');
let Remarkable = require('remarkable');

let markdownRenderer;

function getMarkdownRenderer(options) {
	if (!markdownRenderer) {
		markdownRenderer = new Remarkable();

		let fence = markdownRenderer.renderer.rules.fence;

		markdownRenderer.renderer.rules.fence = function(tokens, idx) {
			let token = tokens[idx];

			if (token.type !== 'fence') {
				return fence.apply(this, arguments);
			}

			let lang = token.params || 'text';

			return (
				'{call ElectricCode.render}{param code kind="text"}{literal}' +
				_.trimEnd(token.content) +
				"{/literal}{/param}{param mode: '" +
				lang +
				"' /}{/call}"
			);
		};

		if (_.isFunction(options.markdownRenderer)) {
			markdownRenderer = options.markdownRenderer(markdownRenderer);
		} else if (!_.isUndefined(options.markdownRenderer)) {
			markdownRenderer = options.markdownRenderer;
		}

		markdownRenderer.set(
			_.defaults(options.markdownOptions, {
				html: true
			})
		);
	}

	return markdownRenderer;
}

module.exports = getMarkdownRenderer;
