'use strict';

import Soy from 'metal-soy';
import {ElectricReadingProgress} from 'electric-base-components';

import templates from './ElectricReadingProgress.soy';

Soy.register(ElectricReadingProgress, templates);

export default ElectricReadingProgress;
