'use strict';

var runTask = require('../runTask');
var configExists = require('../configExists');

module.exports = {
	desc: 'Builds site and and deploys dist files to git branch.',
	name: 'deploy',
	run: function(options, callback) {
		if (configExists()) {
			runTask('deploy', null, {
				env: options.env
			}, function() {
				callback();
			});
		}
	}
};
