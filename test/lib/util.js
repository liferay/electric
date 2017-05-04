'use strict';

var path = require('path');
var test = require('ava');

var util = require('../../lib/util');

var initCwd = process.cwd();

test.before(function() {
	process.chdir(path.join(__dirname, '../fixture/sites/front-matter-site'));
});

test.after.always(function() {
	process.chdir(initCwd);
});

test('it should resolve file path and return array', function(t) {
	var cwd = process.cwd();

	t.deepEqual(util.getFilePathArray(path.join(cwd, 'src/pages/index.soy')), ['index.soy']);
	t.deepEqual(util.getFilePathArray(path.join(cwd, 'src/pages/child/index.soy')), ['child', 'index.soy']);
	t.deepEqual(util.getFilePathArray(path.join(cwd, 'src/pages/child/other.md')), ['child', 'other.md']);

	t.deepEqual(util.getFilePathArray(path.join(cwd, 'temp/pages/index.soy'), 'temp/pages'), ['index.soy']);
	t.deepEqual(util.getFilePathArray(path.join(cwd, 'temp/pages/child/index.soy'), 'temp/pages'), ['child', 'index.soy']);
	t.deepEqual(util.getFilePathArray(path.join(cwd, 'temp/pages/child/other.md'), 'temp/pages'), ['child', 'other.md']);
});

test('it should get namespace from file contents', function(t) {
	var namespace = util.getNamespaceFromContents({
		contents: {
			toString: function() {
				return '\n{namespace MyComponent}\n\n';
			}
		}
	});

	t.is(namespace, 'MyComponent');
});

test('it should retrieve url from file path', function(t) {
	var cwd = process.cwd();

	t.is(util.getPageURL(path.join(cwd, 'src/pages/docs/index.soy')), '/docs');
	t.is(util.getPageURL(path.join(cwd, 'src/pages/docs/child.soy')), '/docs/child.html');
	t.is(util.getPageURL(path.join(cwd, 'src/pages/docs/child.md')), '/docs/child.html');
});

test('it should get src file path resolved from root of project', function(t) {
	var cwd = process.cwd();

	t.is(util.getSrcFilePath(path.join(cwd, 'src/pages/docs/index.soy')), 'src/pages/docs/index.soy');
	t.is(util.getSrcFilePath(path.join(cwd, 'src/pages/docs/child.soy')), 'src/pages/docs/child.soy');
	t.is(util.getSrcFilePath(path.join(cwd, 'src/pages/docs/child.md')), 'src/pages/docs/child.md');
});

test('it should tree dot notated location of page', function(t) {
	var cwd = process.cwd();

	t.is(util.getTreeLocation(path.join(cwd, 'src/pages/docs/index.soy')), 'index.children.docs');
	t.is(util.getTreeLocation(path.join(cwd, 'src/pages/docs/child.soy')), 'index.children.docs.children.child');
	t.is(util.getTreeLocation(path.join(cwd, 'src/pages/docs/child.md')), 'index.children.docs.children.child');
});

test('it should set active state on appropriate pages', function(t) {
	var siteJSON = require(path.join(process.cwd(), 'site.json'));

	var siteData = JSON.parse(JSON.stringify(siteJSON));

	util.setActive(siteData.index, '/page2.html');

	t.falsy(siteData.index.children[0].active);
	t.falsy(siteData.index.children[1].active);
	t.falsy(siteData.index.children[2].active);
	t.true(siteData.index.children[3].active);

	siteData = JSON.parse(JSON.stringify(siteJSON));

	util.setActive(siteData.index, '/child1/page3.html');

	t.falsy(siteData.index.children[2].active);
	t.true(siteData.index.children[0].active);
	t.true(siteData.index.children[0].children[1].active);
	t.falsy(siteData.index.children[0].children[2].active);
});

test('it should sort by weight and then by title', function(t) {
	var children = [
		{
			title: 'AAA',
			weight: 3
		},
		{
			title: 'BBB',
			weight: 1
		},
		{
			title: 'AAA',
			weight: 2
		},
		{
			title: 'AAA',
			weight: 1
		}
	];

	t.deepEqual(util.sortByWeight(children), [
		{
			title: 'AAA',
			weight: 1
		},
		{
			title: 'BBB',
			weight: 1
		},
		{
			title: 'AAA',
			weight: 2
		},
		{
			title: 'AAA',
			weight: 3
		}
	]);
});

test('it should pass', function(t) {

	var siteJSON = require(path.join(process.cwd(), 'site.json'));
	util.sortChildren(siteJSON.index);

	var sortedJSON = require(path.join(__dirname, '../fixture/json/sorted.json'));
	// the sortedJSON file might not be sorted, so sort it the same way
	// (i.e. the children property should not be the last one)
	util.sortChildren(sortedJSON.index);

	t.deepEqual(siteJSON, sortedJSON);
});
