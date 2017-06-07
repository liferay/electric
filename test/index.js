'use strict';

let gulp = require('gulp');
let path = require('path');
let test = require('ava');

let runSequence = require('run-sequence').use(gulp);

let registerTasks = require('../lib/index').registerTasks;

test.before(function() {
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
	let tasks = gulp.tasks;

	t.truthy(tasks.clean);
	t.truthy(tasks['front-matter']);
	t.truthy(tasks.metal);
	t.truthy(tasks.soyweb);
});
