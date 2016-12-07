'use strict';

const connect = require('gulp-connect');
const ghPages = require('gulp-gh-pages');
const gulp = require('gulp');
const hljs = require('highlight.js');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const ssg = require('metal-ssg');

ssg.registerTasks({
	gulp: gulp,
	plugins: ['metal-ssg-components'],
	markdownOptions: {
		highlight: function (str, lang) {
			if (lang && hljs.getLanguage(lang)) {
				try {
					str = hljs.highlight(lang, str).value;
				}
				catch (err) {}
			}

			try {
				str = hljs.highlightAuto(str).value;
			}
			catch (err) {}

			if (str && lang === 'soy') {
				str = str.replace(/\n/g, '<br>');
			}

			return str;
		}
	}
});

// CSS -------------------------------------------------------------------------

gulp.task('css', () => {
	return gulp.src('src/styles/**/*.scss')
		.pipe(sass({includePaths: ['node_modules']}))
		.pipe(gulp.dest('dist/styles'));
});

// Fonts -----------------------------------------------------------------------

gulp.task('fonts', () => {
	return gulp.src('node_modules/westyle/build/fonts/**')
		.pipe(gulp.dest('dist/fonts'));
});

// Server ----------------------------------------------------------------------

gulp.task('server', () => {
	connect.server({
		root: 'dist',
		port: 8888
	});
});

// Deploy ----------------------------------------------------------------------

gulp.task('wedeploy', () => {
	return gulp.src('src/container.json')
		.pipe(gulp.dest('dist'));
});

gulp.task('deploy', ['default'], () => {
	return gulp.src('dist/**/*')
		.pipe(ghPages({
			branch: 'wedeploy'
		}));
});

// Watch -----------------------------------------------------------------------

gulp.task('watch', () => {
	gulp.watch('src/styles/**/*.scss', ['css']);
	gulp.watch('src/**/*.+(md|soy|js|fm)', ['generate']);
});

// Build -----------------------------------------------------------------------

gulp.task('build', (callback) => {
	runSequence('generate', ['css', 'fonts', 'wedeploy'], callback);
});

gulp.task('default', (callback) => {
	runSequence('build', 'server', 'watch', callback);
});
