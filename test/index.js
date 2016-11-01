'use strict';

var fs = require('fs-extra');
var gulp = require('gulp');
var path = require('path');
var test = require('ava');

var runSequence = require('run-sequence').use(gulp);

var registerTasks = require('../lib/index').registerTasks;

test.before(function(t) {
	registerTasks({
		gulp: gulp
	});
});

test.cb.afterEach(function(t) {
	runSequence('clean', function() {
		t.end();
	});
});

test('it should require all task files', function(t) {
	var tasks = gulp.tasks;

	t.ok(tasks.clean);
	t.ok(tasks['front-matter']);
	t.ok(tasks.generate);
	t.ok(tasks.metal);
	t.ok(tasks.soyweb);
});

test.cb('it should generate site.json file that matches pages folder structure', function(t) {
	var sitePath = path.join(__dirname, 'fixture/sites/static-site');

	process.chdir(sitePath);

	runSequence('front-matter', function() {
		var config = {encoding: 'utf8'};
		var siteData = fs.readFileSync(path.join(sitePath, 'site.json'), config);
		var targetSiteData = fs.readFileSync(path.join(sitePath, 'dist/site.json'), config);

		t.is(siteData, targetSiteData);

		t.end();
	});
});
