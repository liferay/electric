// SPDX-FileCopyrightText: © 2017 Liferay International Ltd. <https://liferay.com>
//
// SPDX-License-Identifier: BSD-3-Clause

'use strict';

const fs = require('fs');
const path = require('path');
const template = require('lodash').template;

function getTemplate(name) {
	return template(
		fs.readFileSync(path.join(__dirname, './templates/' + name + '.tpl'))
	);
}

module.exports = getTemplate;
