'use strict';

var gulp = require('gulp');
var path = require('path');
var test = require('ava');

var runSequence = require('run-sequence').use(gulp);

var registerTasks = require('../lib/index').registerTasks;
var sitePath = path.join(__dirname, 'fixture/sites/static-site');

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

test('it should register tasks', function(t) {
	var tasks = gulp.tasks;

	t.truthy(tasks.clean);
	t.truthy(tasks['front-matter']);
	t.truthy(tasks.generate);
	t.truthy(tasks.metal);
	t.truthy(tasks.soyweb);
});
