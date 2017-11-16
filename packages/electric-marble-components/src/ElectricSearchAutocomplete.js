'use strict';

import Soy from 'metal-soy';
import {ElectricSearchAutocomplete} from 'electric-base-components';

import templates from './ElectricSearchAutocomplete.soy';

Soy.register(ElectricSearchAutocomplete, templates);

export default ElectricSearchAutocomplete;
