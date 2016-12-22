'use strict';

var fs = require('fs-extra');
var gulp = require('gulp');
var path = require('path');
var test = require('ava');

var runSequence = require('run-sequence').use(gulp);

var registerTasks = require('../../../lib/index').registerTasks;
var sitePath = path.join(__dirname, '../../fixture/sites/front-matter-site');

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

test.cb('it should generate site.json file that matches pages folder structure', function(t) {
	runSequence('front-matter', function() {
		var config = {encoding: 'utf8'};
		var siteData = fs.readFileSync(path.join(sitePath, 'site.json'), config);
		var targetSiteData = fs.readFileSync(path.join(sitePath, 'dist/site.json'), config);

		t.is(siteData, targetSiteData);

		t.end();
	});
});
