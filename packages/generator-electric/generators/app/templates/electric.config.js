// SPDX-FileCopyrightText: © 2017 Liferay International Ltd. <https://liferay.com>
//
// SPDX-License-Identifier: BSD-3-Clause

'use strict';

var marble = require('marble');

module.exports = {
	metalComponents: ['electric-marble-components', 'marble-topbar'],
	sassOptions: {
		includePaths: ['node_modules', marble.src]
	},
	vendorSrc: ['node_modules/marble/build/fonts/**']
};
