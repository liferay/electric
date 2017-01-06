'use strict';

import Component from 'metal-component';
import Soy from 'metal-soy';
import Toggler from 'metal-toggler';

import templates from './SideBar.soy';

class SideBar extends Component {
	attached() {
		new Toggler({
			content: '.sidebar-toggler-content',
			header: '.sidebar-header'
		});
	}
};

Soy.register(SideBar, templates);

export default SideBar;
