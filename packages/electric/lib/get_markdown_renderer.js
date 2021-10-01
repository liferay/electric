// SPDX-FileCopyrightText: © 2017 Liferay International Ltd. <https://liferay.com>
//
// SPDX-License-Identifier: BSD-3-Clause

'use strict';

const _ = require('lodash');
const Remarkable = require('remarkable');

let markdownRenderer;

function getMarkdownRenderer(options) {
	if (!markdownRenderer) {
		markdownRenderer = new Remarkable();

		const fence = markdownRenderer.renderer.rules.fence;

		markdownRenderer.renderer.rules.fence = function(tokens, idx) {
			const token = tokens[idx];

			if (token.type !== 'fence') {
				return fence.apply(this, arguments);
			}

			const lang = token.params || 'text';

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
