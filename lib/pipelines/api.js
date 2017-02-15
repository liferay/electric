'use strict';

var _ = require('lodash');
var fs = require('fs');
var gutil = require('gulp-util');
var path = require('path');
var through = require('through2');

var util = require('../util');

var apiSoywebTemplate = _.template(fs.readFileSync(path.join(__dirname, '../templates/api-soyweb.tpl')));

function api(projects) {
	var cwd = process.cwd();

	return through.obj(function(file, enc, cb) {
		if (file.isNull()) {
			return cb(null, file);
		}

		if (file.isBuffer()) {
			var stream = this;

			var apiData = JSON.parse(file.contents.toString());

			normalizeApiData(apiData, projects);

			stream.push(new gutil.File({
				base: '',
				contents: new Buffer(apiSoywebTemplate({
					namespace: 'indexPage'
				})),
				cwd: cwd,
				path: 'index.soy'
			}));

			apiData.forEach(function(item) {
				stream.push(creatVinylFile(item));
			});

			file.contents = new Buffer(JSON.stringify(apiData, null, '\t'));
		}

		cb(null, file);
	});
}

function creatVinylFile(item) {
	return new gutil.File({
		base: '',
		contents: new Buffer(apiSoywebTemplate({
			namespace: _.camelCase(_.deburr(item.context.file) + '_' + item.name)
		})),
		cwd: process.cwd(),
		path: item.name + '.soy'
	})
}

function normalizeApiData(apiData, projects) {
	apiData.forEach(function(item, index) {
		resolveContext(item, projects);

		if (item.augments) {
			resolveAugmentation(item.augments, apiData);
		}

		if (item.tags) {
			resolveTags(item);
		}

		if (item.members) {
			resolveMemberGroups(item);

			normalizeApiData(item.members.instance, projects);
			normalizeApiData(item.members.static, projects);
		}
	});
}

function resolveAugmentation(augments, apiData) {
	augments.forEach(function(augmentation) {
		augmentation.title = _.upperFirst(augmentation.title);
		augmentation.link = _.find(apiData, function(item) {
			return item.name === augmentation.name;
		});
	});
}

function resolveContext(item, projects) {
	var filePath = item.context.file;

	var project = _.find(projects, function(project) {
		return filePath.indexOf(project.name) > -1;
	});

	var name = project.name + '/';

	item.context.file = filePath.substring(
		filePath.indexOf(name) + name.length,
		filePath.length
	);

	item.repo = project.repo;
}

function resolveMemberGroups(item) {
	var instanceMembers = item.members.instance;

	item.members.methods = [];
	item.members.properties = [];

	item.members.instance.forEach(function(member) {
		var type;

		if (member.kind === 'class' || member.kind === 'function') {
			item.members.methods.push(member);
		}
		else if (!member.kind) {
			item.members.properties.push(member);
		}
	});
}

function resolveTags(item) {
	item.tags.forEach(function(tag) {
		if (tag.title === 'type') {
			item.type = resolveType(tag);
		}
		else if (tag.title === 'default') {
			item.default = tag.description;
		}
	});
}

function resolveType(tag) {
	var value;

	if (tag.name) {
		value = tag.name;
	}
	else if (tag.expression) {
		value = resolveType(tag.expression);
	}
	else if (tag.type) {
		value = resolveType(tag.type);
	}

	return value;
}

module.exports = api;