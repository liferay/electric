'use strict';

var runGenerator = require('../runGenerator');

module.exports = {
	desc: 'Initializes a new electric project.',
	name: 'init',
	run: function(options, callback) {
		runGenerator('electric:app', options, function() {
			callback();
		});
	}
};
