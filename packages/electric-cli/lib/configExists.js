var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

module.exports = function() {
	var configPath = path.join(process.cwd(), 'electric.config.js');

	if (fs.existsSync(configPath)) {
		return true;
	}
	
	console.log(chalk.red('Error: ') + 'A "electric.config.js" file should exist in the current directory for this command to run');
};