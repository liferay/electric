// SPDX-FileCopyrightText: © 2017 Liferay International Ltd. <https://liferay.com>
//
// SPDX-License-Identifier: BSD-3-Clause

'use strict';

import Soy from 'metal-soy';
import {ElectricCode} from 'electric-base-components';

import templates from './ElectricCode.soy.js';

Soy.register(ElectricCode, templates);

export default ElectricCode;
