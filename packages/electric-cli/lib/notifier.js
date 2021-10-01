// SPDX-FileCopyrightText: © 2017 Liferay International Ltd. <https://liferay.com>
//
// SPDX-License-Identifier: BSD-3-Clause

var updateNotifier = require('update-notifier');
var pkg = require('../package.json');

updateNotifier({pkg}).notify();