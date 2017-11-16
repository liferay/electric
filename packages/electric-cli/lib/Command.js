'use strict';

var yargs = require('yargs');

yargs.demand(1, 1);
var commands = {};

var Command = {
	get: function(name) {
		return commands[name || Command.getName()];
	},

	getArgv: function() {
		return yargs
			.help('help')
			.alias('e', 'env')
			.describe('e', 'Sets which envOptions to use from electric.config.js')
			.alias('p', 'port')
			.describe('p', 'Changes the port number used by server')
			.alias('s', 'skip-bundle')
			.describe('s', 'Skips Javascript bundling for faster compiling (for development use only)')
			.alias('v', 'version')
			.version(function() { return require('../package').version; })
			.argv;
	},

	getName: function() {
		return Command.getArgv()._[0];
	},

	register: function(command) {
		commands[command.name] = command;
		yargs.command(command.name, command.desc, command.yargs);
	}
};

module.exports = Command;
