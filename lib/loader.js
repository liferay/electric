'use strict';

const fs = require('fs');

module.exports = function() {
	const callback = this.async();

	fs.readFile(
		this.resource + '.js',
		{
			encoding: 'utf8'
		},
		callback
	);
};
