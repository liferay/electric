'use strict';

let async = require('async');
let fs = require('fs-extra');
let ghDownload = require('github-download');
let path = require('path');

function projectDownload(project, cb) {
	async.each(
		project.refs,
		function(ref, done) {
			let pathDest = path.join(process.cwd(), 'temp', 'project', ref);

			fs.ensureDirSync(pathDest);

			ghDownload(
				{
					ref: ref,
					repo: project.repo,
					user: project.user
				},
				pathDest
			)
				.on('error', function(err) {
					done(err);
				})
				.on('end', function() {
					done();
				});
		},
		cb
	);
}

module.exports = projectDownload;
