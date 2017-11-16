'use strict';

module.exports = function(generator, options, callback) {
	var env = require('yeoman-environment').createEnv();

	env.lookup(function() {
		env.run(generator, options, callback);
	});
};
