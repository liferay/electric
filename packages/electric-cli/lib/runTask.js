// SPDX-FileCopyrightText: © 2017 Liferay International Ltd. <https://liferay.com>
//
// SPDX-License-Identifier: BSD-3-Clause

'use strict';

module.exports = function(task, subTasks, options, callback) {
	var runSequence = require('run-sequence');
	var electric = require('electric');
	var gulp = require('gulp');

	var logger = require('./logger');

	logger(gulp);
	runSequence.use(gulp);

	options = Object.assign({
		gulp: gulp,
		uglifyBundle: task === 'deploy'
	}, options)

	electric.registerTasks(options);

	var sequenceArgs = [task];
	if (subTasks) {
		sequenceArgs.push(subTasks);
	}
	if (callback) {
		sequenceArgs.push(callback);
	}

	runSequence.apply(null, sequenceArgs);
};
