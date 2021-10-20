// SPDX-FileCopyrightText: © 2016 Liferay International Ltd. <https://liferay.com>
//
// SPDX-License-Identifier: BSD-3-Clause

'use strict';

const fs = require('fs-extra');
const gulp = require('gulp');
const path = require('path');

const runSequence = require('run-sequence').use(gulp);

const registerTasks = require('../../index').registerTasks;
const sitePath = path.join(__dirname, '../../../test/fixtures/sites/front-matter-site');

beforeAll(() => {
	process.chdir(sitePath);

	registerTasks({
		gulp: gulp
	});
});

afterAll(done => {
	runSequence('clean', function() {
		done();
	});
});

test('it should generate site.json file that matches pages folder structure',
	done => {
		runSequence('front-matter', function() {
			const config = {encoding: 'utf8'};
			const siteData = fs.readFileSync(
				path.join(sitePath, 'dist/site.json'),
				config
			);

			expect(siteData).toMatchSnapshot();

			done();
		});
	}
);
