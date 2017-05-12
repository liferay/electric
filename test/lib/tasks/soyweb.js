'use strict';

let del = require('del');
let gulp = require('gulp');
let gutil = require('gulp-util');
let os = require('os');
let path = require('path');
let test = require('ava');

let runSequence = require('run-sequence').use(gulp);

let registerTasks = require('../../../lib/index').registerTasks;
let sitePath = path.join(__dirname, '../../fixture/sites/static-site');

let initCwd = process.cwd();
let tempDir = path.join(os.tmpdir(), 'soyweb');

test.cb.before(function(t) {
	gulp
		.src(path.join(sitePath, '**/*'))
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

test.cb('it should compile soyweb templates', function(t) {
	runSequence('front-matter', 'soyweb', function() {
		gulp.src('dist/**/*.html').pipe(
			gutil.buffer(function(err, files) {
				t.is(path.relative(files[0].base, files[0].path), 'index.html');
				t.is(path.relative(files[1].base, files[1].path), 'child/index.html');
				t.is(files[0].contents.length, 553);
				t.is(files[1].contents.length, 652);

				t.end();
			})
		);
	});
});
