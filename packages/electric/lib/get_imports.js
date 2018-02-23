'use strict';

const _ = require('lodash');
const fs = require('fs-extra');
const globby = require('globby');
const path = require('path');

const TEMP_DIR_SITE = '.temp/task/metal/site';

let resolvedImports;

function getImports(metalComponents) {
	if (resolvedImports) {
		return resolvedImports;
	}

	const cwd = process.cwd();

	const partials = _.map(
		globby.sync(
			path.join(TEMP_DIR_SITE, '+(components|layouts|partials)/**/*.soy')
		),
		function(filePath) {
			const jsFilePath =
				path.join(
					path.dirname(filePath),
					path.basename(filePath, path.extname(filePath))
				) + '.js';

			if (fs.existsSync(jsFilePath)) {
				filePath = jsFilePath;
			} else if (path.extname(filePath) === '.soy') {
				filePath += '.js';
			}

			return path.join(cwd, filePath).split(path.sep).join('/');
		}
	);

	resolvedImports = metalComponents.concat(partials);

	return resolvedImports;
}

module.exports = getImports;
