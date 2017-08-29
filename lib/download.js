'use strict';

const async = require('async');
const fs = require('fs-extra');
const getUri = require('get-uri');
const gutil = require('gulp-util');
const path = require('path');
const StreamZip = require('node-stream-zip');

function projectUnzip(zipPath, pathSrc, pathDest, done) {
	const zip = new StreamZip({
		file: zipPath
	});

	zip.on('error', function(err) {
		gutil.log(gutil.colors.red(`Error: ${err}`));

		zip.close();
	});

	zip.on('ready', function() {
		zip.extract(pathSrc, pathDest, function(err, count) {
			if (err) {
				console.error(err);
			}
			else {
				done();
			}

			zip.close();
		});
	});
}

function projectDownload(project, cb) {
	async.each(
		project.refs,
		function(ref, done) {
			const pathProject = path.join(process.cwd(), '.temp', 'project');

			fs.ensureDirSync(pathProject);

			getUri(
				`https://github.com/${project.user}/${project.repo}/archive/${ref}.zip`,
				function(err, readableStream) {
					if (err) {
						if ('ENOTFOUND' == err.code) {
							gutil.log(
								gutil.colors.red('Error: Tag does not exist.'),
								'The Electric.js config property',
								gutil.colors.magenta('apiConfig.project.refs'),
								'has a value of',
								`'${gutil.colors.cyan(ref)}'.`,
								'But this tag, does not exist in the',
								gutil.colors.cyan(project.user + '/' + project.repo),
								'repo. Please correct in',
								gutil.colors.cyan('electric.config.js') + '.'
							);
						}
					}
					else {
						const cleanRef = ref.replace(/^v/, '');
						const zipPath = path.join(pathProject, `${cleanRef}.zip`);

						let writableStream = fs.createWriteStream(zipPath);

						readableStream.pipe(writableStream);

						writableStream.on('finish', function () {
							const pathUnZip = path.join(pathProject, ref, 'src');

							fs.ensureDirSync(pathUnZip);

							projectUnzip(zipPath, `${project.repo}-${cleanRef}/src/`, pathUnZip, done);
						});

						writableStream.on('error', function (err) {
							console.error(err);
						});
					}
				}
			);
		},
		cb
	);
}

module.exports = projectDownload;
