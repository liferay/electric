'use strict';

var runTask = require('../runTask');
var configExists = require('../configExists');

module.exports = {
	desc: 'Starts development server for local testing.',
	name: 'server',
	run: function(options) {
		if (configExists()) {
			runTask('server', null, {
				port: options.port
			});
		}
	}
};
