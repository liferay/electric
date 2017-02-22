'use strict';

import ajax from 'metal-ajax';
import Autocomplete from 'metal-autocomplete';
import Component from 'metal-component';
import core from 'metal';
import { CancellablePromise as Promise } from 'metal-promise';

class ApiAutocomplete extends Component {
	attached() {
		const {input} = this;

		this.autocomplete = new Autocomplete({
			data: this.search_.bind(this),
			format: this.format_.bind(this),
			inputElement: input,
			select: ({url}) => {
				window.location = url;
			}
		});
	}

	disposed() {
		const {autocomplete} = this;

		if (autocomplete) {
			autocomplete.dispose();
		}
	}

	format_(data) {
		let {memberof, name} = data;

		const url = this.formatURL_(data);

		return {
			textPrimary: `<a class="autocomplete-link" href="${url}">
				<div class="autocomplete-result">
					<p class="autocomplete-title">${name}</p>
					<p class="autocomplete-text">${memberof}</p>
				</div>
			</a>`,
			url
		};
	}

	formatURL_(data) {
		const {project} = this;
		const {memberof, name} = data;

		let url = `/api/${project.ref}/${memberof || name}.html`;

		if (memberof && name !== memberof) {
			url += `#${name}`;
		}

		return url;
	}

	matchesQuery_(entity, query) {
		let {name} = entity;

		name = name ? name.toLowerCase() : '';

		return name.indexOf(query) > -1;
	}

	filterResults_(data, query) {
		const {children} = data;

		let results = [];

		data.forEach(entity => {
			if (this.matchesQuery_(entity, query)) {
				results.push(entity);
			}

			if (entity.members) {
				results = results.concat(this.filterResults_(entity.members.instance, query));
				results = results.concat(this.filterResults_(entity.members.static, query));
			}
		});

		return results;
	}

	search_(query) {
		const {dataSource, maxResults} = this;
		const instance = this;

		return Promise.resolve(this.data)
			.then(data => {
				if (data) {
					return data;
				}
				else {
					return ajax.request(dataSource)
				}
			})
			.then(data => {
				if (data.response) {
					data = JSON.parse(data.response);

					instance.data = data;
				}

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

ApiAutocomplete.STATE = {
	data: {
		validator: core.isObject
	},

	dataSource: {
		validator: core.isString
	},

	input: {
		required: true,
		validator: core.isElement
	},

	maxResults: {
		validator: core.isNumber,
		value: 4
	},

	project: {
		required: true,
		validator: core.isObject
	}
};

export default ApiAutocomplete;
