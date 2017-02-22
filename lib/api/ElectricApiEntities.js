'use strict';

import Component from 'metal-component';
import core from 'metal';
import Soy from 'metal-soy';

import templates from './ElectricApiEntities.soy';

class ElectricApiEntities extends Component {
	handleFilterChange_(event) {
		const {target} = event;
		const {filter} = this;

		const {name} = target;

		filter[name] = !filter[name];

		this.filter = filter;
	}
};

ElectricApiEntities.STATE = {
	entityData: {
		type: core.isObject
	},

	filter: {
		type: core.isObject
	}
};

Soy.register(ElectricApiEntities, templates);

export default ElectricApiEntities;
