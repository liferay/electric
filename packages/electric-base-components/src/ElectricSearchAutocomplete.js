'use strict';

import Autocomplete from 'metal-autocomplete';
import core from 'metal';

import ElectricSearchBase from './ElectricSearchBase';

class ElectricSearchAutocomplete extends ElectricSearchBase {
	attached() {
		const {element} = this;

		const {input} = this.refs;

		if (input) {
			this.autocomplete = new Autocomplete({
				autoBestAlign: false,
				data: this.search_.bind(this),
				format: this.format_.bind(this),
				inputElement: input,
				select: ({url}) => {
					window.location = url;
				}
			});
		}
	}

	format_(data) {
		let {title, description, url} = data;

		if (description && description.length > 100) {
			description = `${description.substr(0, 100)}...`;
		}

		return {
			textPrimary: `<a class="autocomplete-link" href="${url}">
				<div class="autocomplete-result">
					<p class="autocomplete-title">${title}</p>
					<p class="autocomplete-text">${description}</p>
				</div>
			</a>`,
			url: url
		};
	}

	disposed() {
		const {autocomplete} = this;

		if (autocomplete) {
			autocomplete.dispose();
		}
	}
};

export default ElectricSearchAutocomplete;
