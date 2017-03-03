'use strict';

var fs = require('fs');
var path = require('path');
var template = require('lodash').template;

function getTemplate(name) {
	return template(fs.readFileSync(path.join(__dirname, './templates/' + name + '.tpl')));
}

module.exports = getTemplate;