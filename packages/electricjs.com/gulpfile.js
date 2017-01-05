'use strict';

const connect = require('gulp-connect');
const ghPages = require('gulp-gh-pages');
const gulp = require('gulp');
const hljs = require('highlight.js');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const electric = require('electric');

const REGEX_SOY_ESCAPED_BRACES = /{rb}([\s\S]*?){lb}/g;

const REGEX_SOY_BOOKENDS = /(^[\s\S]*?){lb}|{rb}(?=[^{rb}]*$)([\s\S]*?$)/g;

electric.registerTasks({
	gulp: gulp,
	plugins: ['electric-components'],
	markdownOptions: {
		highlight: function (str, lang) {
			if (lang && hljs.getLanguage(lang)) {
				try {
					str = hljs.highlight(lang, str).value;
				}
				catch (err) {}
			}
			else {
				try {
					str = hljs.highlightAuto(str).value;
				}
				catch (err) {}
			}

			if (lang !== 'soy') {
				str = '{literal}' + str + '{/literal}';
			}
			else {
				str = str.replace(REGEX_SOY_BOOKENDS, function(match, g1, g2) {
					if (g2) {
						return '{rb}{literal}' + g2+ '{/literal}';
					}
					else {
						return '{literal}' + g1 + '{/literal}{lb}';
					}
				});

				str = str.replace(REGEX_SOY_ESCAPED_BRACES, function(match, g1) {
					return '{rb}{literal}' + g1 + '{/literal}{lb}';
				});
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

gulp.task('deploy', ['build'], () => {
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
