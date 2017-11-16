'use strict';

import Toggler from 'metal-toggler';
import Soy from 'metal-soy';
import ElectricNavigationBase from 'electric-base-components';

import templates from './ElectricNavigation.soy';

class ElectricNavigation extends ElectricNavigationBase {
  attached() {
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