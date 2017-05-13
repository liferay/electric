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
let tempDir = path.join(os.tmpdir(), 'metal');

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

test.cb('it should bundle metal components', function(t) {
	runSequence('front-matter', 'metal', function() {
		gulp.src('dist/js/**/*').pipe(
			gutil.buffer(function(err, files) {
				let bundle = files[0];
				let bundleMap = files[1];

				t.is(path.basename(bundle.path), 'bundle.js');
				t.is(path.basename(bundleMap.path), 'bundle.js.map');

				let bundleContent = bundle.contents.toString();

				t.true(
					bundleContent.indexOf('this[\'metal\'][\'pageIndex\'] = pageIndex;') >
						-1
				);
				t.true(
					bundleContent.indexOf(
						'this[\'metal\'][\'pageChildIndex\'] = pageChildIndex;'
					) > -1
				);

				t.end();
			})
		);
	});
});
