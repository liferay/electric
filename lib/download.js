'use strict';

const async = require('async');
const fs = require('fs-extra');
const ghDownload = require('github-download');
const path = require('path');

function projectDownload(project, cb) {
	async.each(
		project.refs,
		function(ref, done) {
			const pathDest = path.join(process.cwd(), '.temp', 'project', ref);

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
