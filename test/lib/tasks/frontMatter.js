'use strict';

let fs = require('fs-extra');
let gulp = require('gulp');
let path = require('path');
let test = require('ava');

let runSequence = require('run-sequence').use(gulp);

let registerTasks = require('../../../lib/index').registerTasks;
let sitePath = path.join(__dirname, '../../fixture/sites/front-matter-site');

test.before(function() {
	process.chdir(sitePath);

	registerTasks({
		gulp: gulp
	});
});

test.cb.after.always(function(t) {
	runSequence('clean', function() {
		t.end();
	});
});

test.cb(
	'it should generate site.json file that matches pages folder structure',
	function(t) {
		runSequence('front-matter', function() {
			let config = {encoding: 'utf8'};
			let siteData = fs.readFileSync(path.join(sitePath, 'site.json'), config);
			let targetSiteData = fs.readFileSync(
				path.join(sitePath, 'dist/site.json'),
				config
			);

			t.is(siteData, targetSiteData);

			t.end();
		});
	}
);
