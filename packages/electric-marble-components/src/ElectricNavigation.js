// SPDX-FileCopyrightText: © 2017 Liferay International Ltd. <https://liferay.com>
//
// SPDX-License-Identifier: BSD-3-Clause

'use strict';

import Toggler from 'metal-toggler';
import Soy from 'metal-soy';
import ElectricNavigationBase from 'electric-base-components';
import {isServerSide} from 'metal';

import templates from './ElectricNavigation.soy.js';

class ElectricNavigation extends ElectricNavigationBase {
  attached() {
  	if (isServerSide()) {
      return;
    }

    this.toggler = new Toggler({
      content: `.${this.listClasses}`,
      header: `.${this.togglerClasses}`,
      expandedClasses: 'topbar-list-expanded'
    });
  }

  disposed() {
    let toggler = this.toggler;

    if (toggler) {
      toggler.dispose();
    }
  }
}

ElectricNavigation.STATE = {
  listClasses: {},
  togglerClasses: {}
};

Soy.register(ElectricNavigation, templates);

export default ElectricNavigation;
