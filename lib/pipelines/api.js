'use strict';

const _ = require('lodash');
const fs = require('fs');
const gutil = require('gulp-util');
const path = require('path');
const through = require('through2');

const apiSoywebTemplate = _.template(
	fs.readFileSync(path.join(__dirname, '../templates/api-soyweb.tpl'))
);

/**
 * Gulp plugin that consumes array of JSDoc entities and outputs soy templates
 * for each entity.
 */
function api(project, options) {
	const cwd = process.cwd();
	const layout = options.apiConfig.layout;

	return through.obj(function(file, enc, cb) {
		if (file.isNull()) {
			return cb(null, file);
		}

		if (file.isBuffer()) {
			let stream = this; // eslint-disable-line

			let apiData = JSON.parse(file.contents.toString());

			apiData = nestClassMembers(apiData);

			normalizeApiData(apiData, project);

			stream.push(
				new gutil.File({
					base: '',
					contents: new Buffer(
						apiSoywebTemplate({
							layout: layout,
							namespace: getRandomString()
						})
					),
					cwd: cwd,
					path: 'index.soy'
				})
			);

			apiData.forEach(function(item) {
				stream.push(creatVinylFile(item, layout));
			});

			file.contents = new Buffer(JSON.stringify(apiData, null, '\t'));
		}

		cb(null, file);
	});
}

/**
 * Creates vinyl file using data from JSDoc entitiy
 */
function creatVinylFile(item, layout) {
	return new gutil.File({
		base: '',
		contents: new Buffer(
			apiSoywebTemplate({
				layout: layout,
				namespace:
					_.camelCase(_.deburr(item.context.file) + '_' + item.name) +
						getRandomString()
			})
		),
		cwd: process.cwd(),
		path: item.name + '.soy'
	});
}

/**
 * Nests memebers of classes that aren't nested by default. When a class doesn't
 * have a JSDoc comment block the methods/properties are not nested by default.
 */
function nestClassMembers(apiData) {
	let classes = [];
	const members = [];

	apiData.forEach(function(item) {
		if (item.kind === 'class') {
			item.name = item.memberof || item.name;

			classes.push(item);
		} else {
			members.push(item);
		}
	});

	classes.forEach(function(item) {
		for (let i = members.length - 1; i >= 0; i--) {
			const member = members[i];

			if (member.memberof && member.memberof === item.name) {
				if (member.scope === 'instance') {
					item.members.instance.push(member);
				} else {
					item.members.static.push(member);
				}
				members.splice(i, 1);
			}
		}
	});

	if (members.length) {
		classes = classes.concat(members);
	}

	return classes;
}

/**
 * Runs on every JSDoc entity and recursively runs on every member to normalize
 * and simplify data for easier soy template consumption.
 */
function normalizeApiData(apiData, project) {
	apiData.forEach(function(item) {
		resolveContext(item, project);

		if (item.augments) {
			resolveAugmentation(item.augments, apiData);
		}

		if (item.tags) {
			resolveTags(item);
		}

		if (item.members) {
			resolveMemberGroups(item);

			normalizeApiData(item.members.instance, project);
			normalizeApiData(item.members.static, project);
		}
	});
}

/**
 * Attempts to create a link to other entities.
 */
function resolveAugmentation(augments, apiData) {
	augments.forEach(function(augmentation) {
		augmentation.title = _.upperFirst(augmentation.title);
		augmentation.link = _.find(apiData, function(item) {
			return item.name === augmentation.name;
		});
	});
}

/**
 * Resolves full file path to shorter repository path for linking to Github.
 */
function resolveContext(item, project) {
	const filePath = item.context.file;

	const ref = project.ref + '/';

	item.context.file = filePath.substring(
		filePath.indexOf(ref) + ref.length,
		filePath.length
	);
}

/**
 * Separates instance members into methods and properties for easier soy
 * template consumption.
 */
function resolveMemberGroups(item) {
	item.members.methods = [];
	item.members.properties = [];

	item.members.instance.forEach(function(member) {
		if (member.kind === 'class' || member.kind === 'function') {
			item.members.methods.push(member);
		} else if (!member.kind) {
			item.members.properties.push(member);
		}
	});
}

/**
 * Resolves tag type and value.
 */
function resolveTags(item) {
	item.tags.forEach(function(tag) {
		if (tag.title === 'type') {
			item.type = resolveType(tag);
		} else if (tag.title === 'default') {
			item.default = tag.description;
		}
	});
}

/**
 * Resolves type from tag.
 */
function resolveType(tag) {
	let value;

	if (tag.name) {
		value = tag.name;
	} else if (tag.expression) {
		value = resolveType(tag.expression);
	} else if (tag.type) {
		value = resolveType(tag.type);
	}

	return value;
}

/**
 * Temporary workaround for when namespaces are unintentionally duplicated.
 */
function getRandomString() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

	for (let i = 0; i < 5; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
}

module.exports = api;
