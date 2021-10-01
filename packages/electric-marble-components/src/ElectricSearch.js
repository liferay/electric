// SPDX-FileCopyrightText: © 2017 Liferay International Ltd. <https://liferay.com>
//
// SPDX-License-Identifier: BSD-3-Clause

'use strict';

import Soy from 'metal-soy';
import {ElectricSearch} from 'electric-base-components';

import templates from './ElectricSearch.soy.js';

Soy.register(ElectricSearch, templates);

export default ElectricSearch;
