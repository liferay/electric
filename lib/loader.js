'use strict';

let fs = require('fs');

module.exports = function() {
	let callback = this.async();

	fs.readFile(
		this.resource + '.js',
		{
			encoding: 'utf8'
		},
		callback
	);
};
