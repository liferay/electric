'use strict';

import Soy from 'metal-soy';
import {ElectricReadingProgress} from 'electric-base-components';

import templates from './ElectricReadingProgress.soy.js';

Soy.register(ElectricReadingProgress, templates);

export default ElectricReadingProgress;
