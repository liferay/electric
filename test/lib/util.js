'use strict';

let fs = require('fs');
let path = require('path');
let test = require('ava');
let Vinyl = require('vinyl');

let util = require('../../lib/util');

let initCwd = process.cwd();

test.before(function() {
	process.chdir(path.join(__dirname, '../fixtures/sites/front-matter-site'));
});

test.after.always(function() {
	process.chdir(initCwd);
});

test('it should modify json object if type field is equal to blogs', function(
	t
) {
	let indexPage = {
		children: {
			'markdown-post': {
				title: 'Markdown Post',
				description:
					'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
				date: 'February 02, 2017',
				url: '/blog/markdown-post.html'
			},
			'soy-post': {
				title: 'Soy Post',
				description: 'Voluptas laboriosam qui dolor et cumque tempore.',
				date: 'January 12, 2017',
				url: '/blog/soy-post.html'
			}
		},
		type: 'blog',
		url: '/blog'
	};

	util.configureBlog(indexPage);

	t.deepEqual(indexPage, {
		children: {
			'markdown-post': {
				title: 'Markdown Post',
				description:
					'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
				date: 'February 02, 2017',
				url: '/blog/markdown-post.html'
			},
			'soy-post': {
				title: 'Soy Post',
				description: 'Voluptas laboriosam qui dolor et cumque tempore.',
				date: 'January 12, 2017',
				url: '/blog/soy-post.html'
			}
		},
		type: 'blog',
		url: '/blog',
		childIds: ['markdown-post', 'soy-post'],
		redirect: '/blog/markdown-post.html'
	});
});

test('it should generate namespace based on key', function(t) {
	let bar = util.generateNamespace('foo');

	t.deepEqual(util.generateNamespace('foo'), bar);
});

test('it should resolve file path and return array', function(t) {
	let cwd = process.cwd();

	t.deepEqual(util.getFilePathArray(path.join(cwd, 'src/pages/index.soy')), [
		'index.soy'
	]);
	t.deepEqual(
		util.getFilePathArray(path.join(cwd, 'src/pages/child/index.soy')),
		['child', 'index.soy']
	);
	t.deepEqual(
		util.getFilePathArray(path.join(cwd, 'src/pages/child/other.md')),
		['child', 'other.md']
	);

	t.deepEqual(
		util.getFilePathArray(
			path.join(cwd, 'temp/pages/index.soy'),
			'temp/pages'
		),
		['index.soy']
	);
	t.deepEqual(
		util.getFilePathArray(
			path.join(cwd, 'temp/pages/child/index.soy'),
			'temp/pages'
		),
		['child', 'index.soy']
	);
	t.deepEqual(
		util.getFilePathArray(
			path.join(cwd, 'temp/pages/child/other.md'),
			'temp/pages'
		),
		['child', 'other.md']
	);
});

test('it should get namespace from file contents', function(t) {
	let namespace = util.getNamespaceFromContents({
		contents: {
			toString: function() {
				return '\n{namespace MyComponent}\n\n';
			}
		}
	});

	t.is(namespace, 'MyComponent');
});

test('it should retrive the page id from a filePath', function(t) {
	let cwd = process.cwd();

	t.is(util.getPageId(path.join(cwd, 'src/pages/docs/index.soy')), 'docs');
	t.is(util.getPageId(path.join(cwd, 'src/pages/docs/index.md')), 'docs');
	t.is(util.getPageId(path.join(cwd, 'src/pages/docs/index.html')), 'docs');
});

test('it should retrieve url from file path', function(t) {
	let cwd = process.cwd();

	t.is(util.getPageURL(path.join(cwd, 'src/pages/docs/index.soy')), '/docs');
	t.is(
		util.getPageURL(path.join(cwd, 'src/pages/docs/child.soy')),
		'/docs/child.html'
	);
	t.is(
		util.getPageURL(path.join(cwd, 'src/pages/docs/child.md')),
		'/docs/child.html'
	);
});

test('it should get the ref based on filepath', function(t) {
	let REGEX_REF = /\/api\/(.*)\//;

	t.is(util.getRefFromPath('/api/foo/'), 'foo');
	t.is(util.getRefFromPath('/api/foo/bar'), 'foo');
	t.is(util.getRefFromPath('/api/foo/bar/'), 'foo/bar');
});

test('it should return a JSON object of site data', function(t) {
	let cwd = process.cwd();

	let siteJSON = require(path.join(cwd, 'site.json'));

	let siteData = JSON.parse(JSON.stringify(siteJSON));

	t.deepEqual(util.getSiteData(''), siteData);
});

test('it should get src file path resolved from root of project', function(
	t
) {
	let cwd = process.cwd();

	t.is(
		util.getSrcFilePath(path.join(cwd, 'src/pages/docs/index.soy')),
		'src/pages/docs/index.soy'
	);
	t.is(
		util.getSrcFilePath(path.join(cwd, 'src/pages/docs/child.soy')),
		'src/pages/docs/child.soy'
	);
	t.is(
		util.getSrcFilePath(path.join(cwd, 'src/pages/docs/child.md')),
		'src/pages/docs/child.md'
	);
});

test('it should tree dot notated location of page', function(t) {
	let cwd = process.cwd();

	t.is(
		util.getTreeLocation(path.join(cwd, 'src/pages/docs/index.soy')),
		'index.children.docs'
	);
	t.is(
		util.getTreeLocation(path.join(cwd, 'src/pages/docs/child.soy')),
		'index.children.docs.children.child'
	);
	t.is(
		util.getTreeLocation(path.join(cwd, 'src/pages/docs/child.md')),
		'index.children.docs.children.child'
	);
});

test('it should set active state on appropriate pages', function(t) {
	let siteJSON = require(path.join(process.cwd(), 'site.json'));

	let siteData = JSON.parse(JSON.stringify(siteJSON));

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

test('it should sort JSON object by date and return string array', function(t) {
	let children = {
		'soy-post': {
			title: 'Soy Post',
			date: 'January 12, 2017'
		},
		'markdown-post': {
			title: 'Markdown Post',
			date: 'December 10, 2017'
		},
		'example-post': {
			title: 'Example Post',
			date: 'May 10, 2017'
		}
	};

	t.deepEqual(util.sortByDate(children), [
		'markdown-post',
		'example-post',
		'soy-post'
	]);
});

test('it should sort by weight and then by title', function(t) {
	let children = [
		{
			title: 'AAA',
			weight: 3,
			id: 0
		},
		{
			title: 'BBB',
			weight: 1,
			id: 1
		},
		{
			title: 'AAA',
			weight: 2,
			id: 2
		},
		{
			title: 'AAA',
			weight: 1,
			id: 3
		}
	];

	t.deepEqual(util.sortByWeight(children), [3, 1, 2, 0]);
});

test('it should pass', function(t) {
	let siteJSON = require(path.join(process.cwd(), 'site.json'));

	util.sortChildren(siteJSON.index);

	t.snapshot(siteJSON);
});

test('it should return a string from markdown or soy file', function(t) {
	t.is(util.stripCode(new Vinyl(
		{
			path: 'index.md',
 			contents: new Buffer(
				'<article id="1"># bar</article>'
			)
		}
	)).trim(), 'bar');
	t.is(util.stripCode(new Vinyl(
		{
			path: 'index.soy',
 			contents: new Buffer(
				'{namespace foo} \n /** \n * @param contents \n */ \n {template .render} \n<div>\n<h1>bar{$contents}</h1> \n </div> \n {/template}'
			)
		}
	)).trim(), 'bar');
});

test('it should return true after watch is called and false before', function(t) {
	t.falsy(util.isWatching());

	util.watch();

	t.truthy(util.isWatching());
});
