'use strict';

const _ = require('lodash');
const ARRAY = [];
const fs = require('fs-extra');
const NUMBER = 0;
const OBJECT = {};
const path = require('path');
const RSS = require('rss');
const STRING = '';
const url = require('url');

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

const createRSS = (data, opts) => {
	const siteData = _.cloneDeep(data);
	const options = _.cloneDeep(opts);
	const blogs = siteData.index.children.blog.children;
	const feedInfo = options.rss;
	const domain = feedInfo.domain;
	const image = feedInfo.image_url;
	let imageURL;

	if (feedInfo.image_url) {
		imageURL = url.resolve(`${domain}/images/${image}`, image);
	}

	const defaultFeedOptions = {
		feed_url: `${options.rss.domain}/blog/rss/blog.xml`,
		image_url: imageURL,
		site_url: options.rss.domain,
		title: feedInfo.title || siteData.title
	};

	_.assign(defaultFeedOptions, feedInfo);

	const feed = new RSS(validate(defaultFeedOptions, feedOptionTypes));

	mapBlogItems(blogs, domain, feed);

	const dir = path.resolve(options.pathDest, 'blog/rss');
	const file = path.resolve(dir, 'blog.xml');
	const xml = feed.xml({indent: true});

	fs.ensureDirSync(dir);
	fs.writeFile(file, xml);
};

const mapBlogItems = (blogs, domain, feed) => {
	_.each(blogs, (blogInfo) => {
		const image = blogInfo.image;
		let enclosure;

		if (blogInfo.image) {
			enclosure = {
				url: url.resolve(`${domain}/${image}`, image)
			};
		}

		const blogDefaultOptions = {
			date: blogInfo.date,
			description: blogInfo.description,
			guid: blogInfo.guid,
			title: blogInfo.title,
			url: `${domain}${blogInfo.url}`,
			enclosure
		};

		_.assign(blogInfo, blogDefaultOptions);

		feed.item(validate(blogInfo, blogOptionTypes));
	});
};

const trueTypeOf = (obj) => (
	({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
);

const validate = (actualOptions, expectedOptions) => {
	const validatedObj = {};

	_.forOwn(expectedOptions, (value, key) => {
		const actualType = trueTypeOf(actualOptions[key]);
		const expectedType = trueTypeOf(value);

		if (actualType !== expectedType && actualType !== 'undefined') {
			console.log(`RSS option ${key} must be a data type of ${expectedType}`);
		} else if (actualType !== 'undefined') {
			_.assign(validatedObj, {[key]: actualOptions[key]});
		}
	});

	return validatedObj;
};

module.exports = createRSS;
