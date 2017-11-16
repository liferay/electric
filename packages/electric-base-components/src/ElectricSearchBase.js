'use strict';

import ajax from 'metal-ajax';
import Component from 'metal-component';
import core from 'metal';
import { CancellablePromise as Promise } from 'metal-promise';

class ElectricSearchBase extends Component {
	attached() {
		this.on('queryChanged', this.handleQueryChange_.bind(this));
	}

	matchesArrayField_(value, query) {
		return value.some(itemName => {
			return itemName.indexOf(query) > -1;
		});
	}

	matchesQuery_(data, query) {
		const {childrenOnly, excludePath} = this;
		const path = this.path || location.pathname;

		let {hidden, location} = data;

		location = location || data.url;

		if ((childrenOnly && location.indexOf(path) !== 0 && location !== path) ||
			(excludePath && location.indexOf(excludePath) === 0)) {

			return false;
		}

		return !hidden && this.matchesField_(data, query);
	}

	matchesField_(data, query) {
		const {fieldNames} = this;

		return fieldNames.some(fieldName => {
			let value = data[fieldName];

			let matches = false;

			if (!value) {
				return matches;
			}

			if (Array.isArray(value)) {
				matches = this.matchesArrayField_(value, query);
			}
			else if (typeof value === 'string') {
				matches = this.matchesTextField_(value, query);
			}

			return matches;
		});
	}

	matchesTextField_(value, query) {
		value = value.toLowerCase();

		return value.indexOf(query) > -1;
	}

	filterResults_(data, query) {
		const {children, childIds} = data;

		let results = [];

		if (this.matchesQuery_(data, query)) {
			results.push(data);
		}

		if (children) {
			childIds.forEach(childId => {
				const child = children[childId];

				results = results.concat(this.filterResults_(child, query));
			});
		}

		return results;
	}

	handleQueryChange_({newVal}) {
		const instance = this;

		this.search_(newVal)
			.then(results => {
				instance.results = results;
			});
	}

	search_(query) {
		const instance = this;

		return Promise.resolve(this.data)
			.then(data => {
				if (data) {
					return data;
				}
				else {
					return ajax.request(instance.dataURL)
						then(res)
				}
			})
			.then(data => {
				if (data.response) {
					data = JSON.parse(data.response).index;

					instance.data = data;
				}

				const {maxResults} = instance;

				let results = [];

				if (data && query) {
					results = instance.filterResults_(data, query.toLowerCase());

					if (results.length > maxResults) {
						results = results.slice(0, maxResults);
					}
				}

				return results;
			});
	}
};

ElectricSearchBase.STATE = {
	childrenOnly: {
		validator: core.isBoolean,
		value: true
	},

	data: {
		validator: core.isObject
	},

	dataURL: {
		value: '/site.json'
	},

	excludePath: {
		validator: core.isString
	},

	fieldNames: {
		validator: core.isArray,
		value: ['content', 'description', 'tags', 'title']
	},

	maxResults: {
		validator: core.isNumber,
		value: 4
	},

	path: {
		validator: core.isString,
		value: null
	},

	query: {
		validator: core.isString,
		value: ''
	},

	results: {
		validator: core.isArray,
		value: []
	}
};

export default ElectricSearchBase;
