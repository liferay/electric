'use strict';

const _ = require('lodash');
const fs = require('fs-extra');
const gutil = require('gulp-util');
const path = require('path');
const RSS = require('rss');
const url = require('url');

const ARRAY = _.isArray;
const BOOLEAN = _.isBoolean;
const NUMBER = _.isNumber;
const OBJECT = _.isPlainObject;
const STRING = _.isString;

const blogOptionTypes = {
	author: STRING,
	categories: ARRAY,
	custom_elements: ARRAY,
	date: STRING,
	description: STRING,
	enclosure: OBJECT,
	guid: STRING,
	lat: NUMBER,
	long: NUMBER,
	title: STRING,
	url: STRING
};

const feedOptionTypes = {
	categories: ARRAY,
	copyright: STRING,
	custom_elements: ARRAY,
	custom_namespaces: OBJECT,
	description: STRING,
	docs: STRING,
	enabled: BOOLEAN,
	feed_url: STRING,
	generator: STRING,
	hub: STRING,
	image_url: STRING,
	language: STRING,
	managingEditor: STRING,
	pubDate: STRING,
	site_url: STRING,
	title: STRING,
	ttl: NUMBER,
	webMaster: STRING
};

function createRss(site, page, options) {
	const blogs = page.children;
	const pageData = _.pick(page, _.keys(feedOptionTypes));
	const rssOptions = options.rss;

	const siteUrl = rssOptions.site_url;

	let feedUrl = path.join(siteUrl, page.url, 'rss.xml');

	if (pageData.feed_url) {
		feedUrl = path.join(siteUrl, pageData.feed_url);
	}

	const computedOptions = {
		feed_url: feedUrl,
		title: pageData.title || rssOptions.title || site.title
	};

	_.assign(rssOptions, pageData, computedOptions);

	const feed = new RSS(validate(rssOptions, feedOptionTypes));

	mapBlogItems(blogs, siteUrl, feed);

	const dest = page.dest || options.rss.dest || 'blog/rss';
	const dir = path.resolve(options.pathDest, dest);
	const file = path.resolve(dir, 'blog.xml');
	const xml = feed.xml({
		indent: true
	});

	fs.ensureDirSync(dir);
	fs.writeFile(file, xml);
}

function mapBlogItems(blogs, siteUrl, feed) {
	_.each(blogs, function(blog) {
		const blogData = _.pick(blog, _.keys(blogOptionTypes));
		const image = blog.image;

		_.assign(blogData, {
			url: url.resolve(siteUrl, blog.url)
		});

		if (image && _.isString(image)) {
			_.assign(
				blogData,
				{
					enclosure: {
						url: image
					}
				}
			);
		}

		if (blogData.title || blogData.description) {
			feed.item(validate(blogData, blogOptionTypes));
		} else {
			gutil.log(
				gutil.colors.yellow(`${blog.id} blog not generated; must add either a`),
				gutil.colors.cyan('title'),
				gutil.colors.yellow('or'),
				gutil.colors.cyan('description'),
				gutil.colors.bold.yellow('option to the blog\'s frontmatter')
			);
		}
	});
}

function validate(options, expectedOptions) {
	let validator;

	return _.reduce(options, function(result, value, key) {
		if (_.isUndefined(value)) {
			return result;
		}

		validator = expectedOptions[key];

		if (!validator || !validator(value)) {
			gutil.log(
				gutil.colors.yellow('RSS option'),
				gutil.colors.bold.yellow(key),
				gutil.colors.yellow('must be data type of'),
				gutil.colors.bold.yellow(validator.name.slice(2))
			);
		} else {
			result[key] = value;
		}
		return result;
	}, {});
}

module.exports = createRss;
