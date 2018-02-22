'use strict';

import Soy from 'metal-soy';
import {ElectricCode} from 'electric-base-components';

import templates from './ElectricCode.soy.js';

Soy.register(ElectricCode, templates);

export default ElectricCode;
