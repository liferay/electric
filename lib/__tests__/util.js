'use strict';

let path = require('path');
let Vinyl = require('vinyl');

let util = require('../util');

let initCwd = process.cwd();

beforeAll(() => {
	process.chdir(
		path.join(__dirname, '../../test/fixtures/sites/front-matter-site')
	);
});

afterAll(() => {
	process.chdir(initCwd);
});

test("it should modify JSON object if type field is equal to 'blogs'", () => {
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

	expect(indexPage).toEqual({
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

test('it should generate namespace based on key', () => {
	let bar = util.generateNamespace('foo');

	expect(util.generateNamespace('foo')).toBe(bar);
});

test('it should resolve file path and return array', () => {
	let cwd = process.cwd();

	expect(
		util.getFilePathArray(path.join(cwd, 'src/pages/index.soy'))
	).toEqual(['index.soy']);

	expect(
		util.getFilePathArray(path.join(cwd, 'src/pages/child/index.soy'))
	).toEqual(['child', 'index.soy']);

	expect(
		util.getFilePathArray(path.join(cwd, 'src/pages/child/other.md'))
	).toEqual(['child', 'other.md']);

	expect(
		util.getFilePathArray(
			path.join(cwd, 'temp/pages/index.soy'),
			'temp/pages'
		)
	).toEqual(['index.soy']);

	expect(
		util.getFilePathArray(
			path.join(cwd, 'temp/pages/child/index.soy'),
			'temp/pages'
		)
	).toEqual(['child', 'index.soy']);

	expect(
		util.getFilePathArray(
			path.join(cwd, 'temp/pages/child/other.md'),
			'temp/pages'
		)
	).toEqual(['child', 'other.md']);
});

test('it should get namespace from file contents', () => {
	let namespace = util.getNamespaceFromContents({
		contents: {
			toString: function() {
				return '\n{namespace MyComponent}\n\n';
			}
		}
	});

	expect(namespace).toBe('MyComponent');
});

test('it should return a page based on url', () => {
	let indexPageWithURL = {
		children: {
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

	expect(util.getPageByURL(indexPageWithURL, '/blog')).toEqual({
		children: {
			'soy-post': {
				title: 'Soy Post',
				description: 'Voluptas laboriosam qui dolor et cumque tempore.',
				date: 'January 12, 2017',
				url: '/blog/soy-post.html'
			}
		},
		type: 'blog',
		url: '/blog'
	});

	expect(util.getPageByURL(indexPageWithURL, '/blog/soy-post.html')).toEqual({
		title: 'Soy Post',
		description: 'Voluptas laboriosam qui dolor et cumque tempore.',
		date: 'January 12, 2017',
		url: '/blog/soy-post.html'
	});
});

test('it should retrive the page id from a filePath', () => {
	let cwd = process.cwd();

	expect(util.getPageId(path.join(cwd, 'src/pages/docs/index.soy'))).toBe(
		'docs'
	);
	expect(util.getPageId(path.join(cwd, 'src/pages/docs/index.md'))).toBe(
		'docs'
	);
	expect(util.getPageId(path.join(cwd, 'src/pages/docs/index.html'))).toBe(
		'docs'
	);
});

test('it should retrieve url from file path', () => {
	let cwd = process.cwd();

	expect(util.getPageURL(path.join(cwd, 'src/pages/docs/index.soy'))).toBe(
		'/docs'
	);
	expect(util.getPageURL(path.join(cwd, 'src/pages/docs/child.soy'))).toBe(
		'/docs/child.html'
	);
	expect(util.getPageURL(path.join(cwd, 'src/pages/docs/child.md'))).toBe(
		'/docs/child.html'
	);
});

test('it should get the ref based on filepath', () => {
	expect(util.getRefFromPath('/api/foo/')).toBe('foo');

	expect(util.getRefFromPath('/api/foo/bar')).toBe('foo');
	expect(util.getRefFromPath('/api/foo/bar/')).toBe('foo/bar');
});

test('it should return a JSON object of site data', () => {
	let cwd = process.cwd();

	let siteJSON = require(path.join(cwd, 'site.json'));

	let siteData = JSON.parse(JSON.stringify(siteJSON));

	expect(util.getSiteData('')).toEqual(siteData);
});

test('it should get src file path resolved from root of project', () => {
	let cwd = process.cwd();

	expect(
		util.getSrcFilePath(path.join(cwd, 'src/pages/docs/index.soy'))
	).toBe('src/pages/docs/index.soy');
	expect(
		util.getSrcFilePath(path.join(cwd, 'src/pages/docs/child.soy'))
	).toBe('src/pages/docs/child.soy');
	expect(util.getSrcFilePath(path.join(cwd, 'src/pages/docs/child.md'))).toBe(
		'src/pages/docs/child.md'
	);
});

test('it should tree dot notated location of page', () => {
	let cwd = process.cwd();

	expect(
		util.getTreeLocation(path.join(cwd, 'src/pages/docs/index.soy'))
	).toBe('index.children.docs');
	expect(
		util.getTreeLocation(path.join(cwd, 'src/pages/docs/child.soy'))
	).toBe('index.children.docs.children.child');
	expect(
		util.getTreeLocation(path.join(cwd, 'src/pages/docs/child.md'))
	).toBe('index.children.docs.children.child');
});

test('it should set active state on appropriate pages', () => {
	let siteJSON = require(path.join(process.cwd(), 'site.json'));

	let siteData = JSON.parse(JSON.stringify(siteJSON));

	util.setActive(siteData.index, '/page2.html');

	expect(siteData.index.children[0].active).toBeFalsy();
	expect(siteData.index.children[1].active).toBeFalsy();
	expect(siteData.index.children[2].active).toBeFalsy();
	expect(siteData.index.children[3].active).toBeTruthy();

	siteData = JSON.parse(JSON.stringify(siteJSON));

	util.setActive(siteData.index, '/child1/page3.html');

	expect(siteData.index.children[2].active).toBeFalsy();
	expect(siteData.index.children[0].active).toBeTruthy();
	expect(siteData.index.children[0].children[1].active).toBeTruthy();
	expect(siteData.index.children[0].children[2].active).toBeFalsy();
});

test('it should sort JSON object by date and return string array', () => {
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

	expect(util.sortByDate(children)).toEqual([
		'markdown-post',
		'example-post',
		'soy-post'
	]);
});

test('it should sort by weight and then by title', () => {
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

	expect(util.sortByWeight(children)).toEqual([3, 1, 2, 0]);
});

test('it sort children correctly', () => {
	let siteJSON = require(path.join(process.cwd(), 'site.json'));

	util.sortChildren(siteJSON.index);

	expect(siteJSON).toMatchSnapshot();
});

test('it should return a string from markdown or soy file', () => {
	expect(
		util
			.stripCode(
				new Vinyl({
					path: 'index.md',
					contents: new Buffer('<article id="1"># bar</article>')
				})
			)
			.trim()
	).toBe('bar');

	expect(
		util
			.stripCode(
				new Vinyl({
					path: 'index.soy',
					contents: new Buffer(
						'{namespace foo} \n /** \n * @param contents \n */ \n {template .render} \n<div>\n<h1>bar{$contents}</h1> \n </div> \n {/template}'
					)
				})
			)
			.trim()
	).toBe('bar');
});

test('it should return true after watch is called and false before', () => {
	expect(util.isWatching()).toBeFalsy();

	util.watch();

	expect(util.isWatching()).toBeTruthy();
});
