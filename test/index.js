var gulp = require('gulp');
var test = require('ava');

var registerTasks = require('../lib/index');

test('it should require all task files', function(t) {
	registerTasks({
		gulp: gulp
	});
});
