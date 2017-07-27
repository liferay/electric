'use strict';

const _ = require('lodash');
const fs = require('fs-extra');
const gutil = require('gulp-util');
const path = require('path');
const RSS = require('rss');
const url = require('url');

const ARRAY = _.isArray;
const NUMBER = _.isNumber;
const OBJECT = _.isPlainObject;
const STRING = _.isString;

const blogOptionTypes = {
	title: STRING,
	description: STRING,
	url: STRING,
	guid: STRING,
	categories: ARRAY,
	author: STRING,
	date: STRING,
	lat: NUMBER,
	long: NUMBER,
	custom_elements: ARRAY,
	enclosure: OBJECT
};

const feedOptionTypes = {
	categories: ARRAY,
	copyright: STRING,
	custom_elements: ARRAY,
	custom_namespaces: OBJECT,
	description: STRING,
	docs: STRING,
	feed_url: STRING,
	generator: STRING,
	hub: STRING,
	image_url: STRING,
	language: STRING,
	managingEditor: STRING,
	pubDate: STRING,
	title: STRING,
	ttl: NUMBER,
	site_url: STRING,
	webMaster: STRING
};

function createRss(siteData, pageData, options) {
	const blogs = pageData.children;
	const rssOptions = options.rss;

	const site_url = rssOptions.site_url;

	let feedImage;
	let feedUrl = path.join(site_url, pageData.url, 'rss.xml');

	if (pageData.feed_url) {
		feedUrl = path.join(site_url, pageData.feedUrl);
	}

	const defaultFeedOptions = {
		feed_url: feedUrl,
		title: pageData.feedTitle || pageData.title
	};

	_.assign(defaultFeedOptions, rssOptions, pageData);

	const feed = new RSS(validate(defaultFeedOptions, feedOptionTypes));

	mapBlogItems(blogs, site_url, feed);

	const dir = path.resolve(options.pathDest, 'blog/rss');
	const file = path.resolve(dir, 'blog.xml');
	const xml = feed.xml({
		indent: true
	});

	fs.ensureDirSync(dir);
	fs.writeFile(file, xml);
}

function mapBlogItems(blogs, site_url, feed) {
	_.each(blogs, function(blog) {
		const image = blog.image;
		let enclosure;

		if (image) {
			enclosure = {
				url: url.resolve(`${site_url}/${image}`, image)
			};
		}

		const blogDefaultOptions = {
			date: blog.date,
			description: blog.description,
			guid: blog.guid,
			title: blog.title,
			url: `${site_url}${blog.url}`,
			enclosure
		};

		_.assign(blog, blogDefaultOptions);

		feed.item(validate(blog, blogOptionTypes));
	});
}

function validate(options, expectedOptions) {
	return _.reduce(options, function(result, value, key) {
		if (_.isUndefined(value)) {
			return result;
		}

		const validator = expectedOptions[key];

		if (validator(value)) {
			result[key] = value;
		}
		else {
			gutil.log(
				gutil.colors.yellow('RSS option'),
				gutil.colors.bold.yellow(key),
				gutil.colors.yellow('must be data type of'),
				gutil.colors.bold.yellow(validator.name.slice(2))
			);
		}

		return result;
	}, {});
}

module.exports = createRss;
