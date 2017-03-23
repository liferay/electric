'use strict';

var fs = require('fs');

module.exports = function() {
	var callback = this.async();

	fs.readFile(this.resource + '.js', {
		encoding: 'utf8'
	}, callback);
};
