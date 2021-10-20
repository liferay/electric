// SPDX-FileCopyrightText: © 2017 Liferay International Ltd. <https://liferay.com>
//
// SPDX-License-Identifier: BSD-3-Clause

'use strict';

import {isServerSide} from 'metal';
import Component from 'metal-component';
import Soy from 'metal-soy';

import templates from './SocialButtons.soy.js';

class SocialButtons extends Component {
	attached() {
		if (isServerSide()) {
			return;
		}
	}

	rendered() {
		this.siteUrl = window.location.origin;
	}
};

Soy.register(SocialButtons, templates);

export default SocialButtons;
