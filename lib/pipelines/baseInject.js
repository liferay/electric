'use strict';

let _ = require('lodash');
let combiner = require('stream-combiner');
let gulp = require('gulp');
let inject = require('gulp-inject');
let path = require('path');
let series = require('stream-series');

function baseInject(options) {
	let util = options.util;
	let pathDest = options.pathDest;

	let siteData = require(path.join(process.cwd(), pathDest, 'site.json'));

	let bundleSrc =
		options.bundleSrc ||
		util.synthSrc(
			path.join(process.cwd(), pathDest, 'js/bundles/shared.electric.js')
		);
	let vendorSrc = gulp.src(
		path.join(process.cwd(), pathDest, 'vendor/**/*'),
		{
			read: false
		}
	);

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
				let data = {
					codeMirror: false,
					googleAnalytics: siteData.googleAnalytics
				}

				if (options.codeMirror) {
					data.codeMirror = {
						theme: options.codeMirrorTheme
					};
				}

				return _.template(file.contents.toString())(data);
			}
		})
	);
}

module.exports = baseInject;
