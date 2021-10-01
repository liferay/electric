// SPDX-FileCopyrightText: © 2017 Liferay International Ltd. <https://liferay.com>
//
// SPDX-License-Identifier: BSD-3-Clause

'use strict';

import Soy from 'metal-soy';
import {ElectricSearchAutocomplete} from 'electric-base-components';

import templates from './ElectricSearchAutocomplete.soy.js';

Soy.register(ElectricSearchAutocomplete, templates);

export default ElectricSearchAutocomplete;
