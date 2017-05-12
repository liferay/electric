'use strict';

let fs = require('fs');
let path = require('path');
let template = require('lodash').template;

function getTemplate(name) {
	return template(
		fs.readFileSync(path.join(__dirname, './templates/' + name + '.tpl'))
	);
}

module.exports = getTemplate;
