'use strict';

var runTask = require('../runTask');
var configExists = require('../configExists');

module.exports = {
	desc: 'Watches for changes to src files.',
	name: 'watch',
	run: function(options) {
		if (configExists()) {
			runTask('watch', null, {
				env: options.env
			});
		}
	}
};
