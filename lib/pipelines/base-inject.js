'use strict';

var _ = require('lodash');
var combiner = require('stream-combiner');
var gulp = require('gulp');
var inject = require('gulp-inject');
var path = require('path');
var series = require('stream-series');

function baseInject(options) {
	var util = options.util;
	var pathDest = options.pathDest;

	var siteData = require(path.join(process.cwd(), pathDest, 'site.json'));

	var bundleSrc = options.bundleSrc || util.synthSrc(path.join(process.cwd(), pathDest, 'js/bundle.js'));
	var vendorSrc = options.vendorSrc || gulp.src(path.join(process.cwd(), pathDest, 'vendor/**/*'), {
		read: false
	});

	return combiner(
		inject(series(bundleSrc, vendorSrc), {
			ignorePath: pathDest
		}),
		inject(gulp.src(path.join(__dirname, '../templates/metal-render.tpl')), {
			starttag: '<!-- inject:metal:js -->',
			transform: function(filePath, file) {
				return file.contents.toString();
			}
		}),
		inject(gulp.src(path.join(__dirname, '../templates/vendor.tpl')), {
			starttag: '<!-- inject:vendor:js -->',
			transform: function(filePath, file) {
				return _.template(file.contents.toString())({
					codeMirror: {
						theme: options.codeMirrorTheme
					},
					googleAnalytics: siteData.googleAnalytics
				});
			}
		})
	);
}

module.exports = baseInject;