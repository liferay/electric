// SPDX-FileCopyrightText: © 2017 Liferay International Ltd. <https://liferay.com>
//
// SPDX-License-Identifier: BSD-3-Clause

'use strict';

import Soy from 'metal-soy';
import {ElectricNavigation} from 'electric-base-components';

import templates from './ElectricNavigation.soy.js';

Soy.register(ElectricNavigation, templates);

export default ElectricNavigation;
