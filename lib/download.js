'use strict';

var async = require('async');
var fs = require('fs-extra');
var ghDownload = require('github-download');
var path = require('path');

function projectDownload(project, cb) {
	async.each(project.refs, function(ref, done) {
		var pathDest = path.join(process.cwd(), 'temp', 'project', ref);

		fs.ensureDirSync(pathDest);

		ghDownload({
			ref: ref,
			repo: project.repo,
			user: project.user
		}, pathDest)
			.on('error', function(err) {
				done(err);
			})
			.on('end', function() {
				done();
			});
	}, cb);
}

module.exports = projectDownload;
