// SPDX-FileCopyrightText: © 2017 Liferay International Ltd. <https://liferay.com>
//
// SPDX-License-Identifier: BSD-3-Clause

'use strict';

import Soy from 'metal-soy';
import {ElectricUpdates} from 'electric-base-components';

import templates from './ElectricUpdates.soy.js';

Soy.register(ElectricUpdates, templates);

export default ElectricUpdates;
