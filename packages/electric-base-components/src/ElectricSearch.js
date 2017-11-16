'use strict';

import core from 'metal';

import ElectricSearchBase from './ElectricSearchBase';

class ElectricSearch extends ElectricSearchBase {
	attached() {
		ElectricSearchBase.prototype.attached.apply(this);

		const queryString = window.location.search;
		const queryIndex = queryString.indexOf('q=');

		if (queryIndex !== -1) {
			this.query = queryString.substr(queryIndex + 2);
		}
	}

	handleInput_(event) {
		const {target} = event;

		this.query = target.value;
	}
};

ElectricSearch.STATE = {
	maxResults: {
		value: Infinity
	}
};

export default ElectricSearch;
