'use strict';

import Soy from 'metal-soy';
import {ElectricCode} from 'electric-base-components';

import templates from './ElectricCode.soy';

Soy.register(ElectricCode, templates);

export default ElectricCode;
