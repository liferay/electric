'use strict';

let fs = require('fs-extra');
let gulp = require('gulp');
let path = require('path');

let runSequence = require('run-sequence').use(gulp);

let registerTasks = require('../../index').registerTasks;
let sitePath = path.join(__dirname, '../../../test/fixtures/sites/front-matter-site');

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
			let config = {encoding: 'utf8'};
			let siteData = fs.readFileSync(
				path.join(sitePath, 'dist/site.json'),
				config
			);

			expect(siteData).toMatchSnapshot();

			done();
		});
	}
);
