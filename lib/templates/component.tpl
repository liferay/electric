'use strict';

import Component from 'metal-component';
import Soy from 'metal-soy';

import templates from './<%= soyName %>';

class <%= name %> extends Component {
};

Soy.register(<%= name %>, templates);

export default <%= name %>;