'use strict';

var del = require('del');
var gulp = require('gulp');
var gutil = require('gulp-util');
var os = require('os');
var path = require('path');
var test = require('ava');

var runSequence = require('run-sequence').use(gulp);

var registerTasks = require('../../../lib/index').registerTasks;
var sitePath = path.join(__dirname, '../../fixture/sites/static-site');

var initCwd = process.cwd();
var tempDir = path.join(os.tmpdir(), 'metal');

test.cb.before(function(t) {
	gulp.src(path.join(sitePath, '**/*'))
		.pipe(gulp.dest(tempDir))
		.on('end', function() {
			process.chdir(tempDir);

			registerTasks({
				gulp: gulp
			});

			t.end();
		});
});

test.cb.after(function(t) {
	process.chdir(initCwd);

	del([path.join(tempDir, '**/*')], {
		force: true
	}).then(function() {
		t.end();
	});
});

test.cb('it should bundle metal components', function(t) {
	runSequence('front-matter', 'metal', function() {
		gulp.src('dist/js/**/*')
			.pipe(gutil.buffer(function(err, files) {
				var bundle = files[0];
				var bundleMap = files[1];

				t.is(path.basename(bundle.path), 'bundle.js');
				t.is(path.basename(bundleMap.path), 'bundle.js.map');

				var bundleContent = bundle.contents.toString();

				t.true(bundleContent.indexOf("this['metal']['pageIndex'] = pageIndex;") > -1);
				t.true(bundleContent.indexOf("this['metal']['pageChildIndex'] = pageChildIndex;") > -1);

				t.end();
			}));
	});
});
