'use strict';

import Component from 'metal-component';
import core from 'metal';

class ElectricUpdates extends Component {
	attached() {
	}
};

ElectricUpdates.STATE = {
	updates: {
		validator: core.isArray,
		value: []
	}
};

export default ElectricUpdates;
