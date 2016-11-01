'use strict';

var fs = require('fs-extra');
var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var test = require('ava');

var runSequence = require('run-sequence').use(gulp);

var registerTasks = require('../lib/index').registerTasks;
var sitePath = path.join(__dirname, 'fixture/sites/static-site');

test.before(function(t) {
	process.chdir(sitePath);

	registerTasks({
		gulp: gulp
	});

	var tasks = gulp.tasks;

	t.truthy(tasks.clean);
	t.truthy(tasks['front-matter']);
	t.truthy(tasks.generate);
	t.truthy(tasks.metal);
	t.truthy(tasks.soyweb);
});

test.cb.after.always(function(t) {
	runSequence('clean', function() {
		t.end();
	});
});

test.cb('it should generate site.json file that matches pages folder structure', function(t) {
	runSequence('front-matter', function() {
		var config = {encoding: 'utf8'};
		var siteData = fs.readFileSync(path.join(sitePath, 'site.json'), config);
		var targetSiteData = fs.readFileSync(path.join(sitePath, 'dist/site.json'), config);

		t.is(siteData, targetSiteData);

		t.end();
	});
});

test.cb('it should compile soyweb templates', function(t) {
	runSequence('front-matter', 'soyweb', function() {
		gulp.src('dist/**/*.html')
			.pipe(gutil.buffer(function(err, files) {
				t.is(path.relative(files[0].base, files[0].path), 'index.html');
				t.is(path.relative(files[1].base, files[1].path), 'child/index.html');
				t.is(files[0].contents.length, 552);
				t.is(files[1].contents.length, 651);

				t.end();
			}));
	});
});
