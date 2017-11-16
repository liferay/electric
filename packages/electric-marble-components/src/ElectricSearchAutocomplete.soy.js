/* jshint ignore:start */
import Component from 'metal-component';
import Soy from 'metal-soy';
var templates;
goog.loadModule(function(exports) {

// This file was automatically generated from ElectricSearchAutocomplete.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace ElectricSearchAutocomplete.
 * @public
 */

goog.module('ElectricSearchAutocomplete.incrementaldom');

/** @suppress {extraRequire} */
var soy = goog.require('soy');
/** @suppress {extraRequire} */
var soydata = goog.require('soydata');
/** @suppress {extraRequire} */
goog.require('goog.i18n.bidi');
/** @suppress {extraRequire} */
goog.require('goog.asserts');
/** @suppress {extraRequire} */
goog.require('goog.string');
var IncrementalDom = goog.require('incrementaldom');
var ie_open = IncrementalDom.elementOpen;
var ie_close = IncrementalDom.elementClose;
var ie_void = IncrementalDom.elementVoid;
var ie_open_start = IncrementalDom.elementOpenStart;
var ie_open_end = IncrementalDom.elementOpenEnd;
var itext = IncrementalDom.text;
var iattr = IncrementalDom.attr;


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {void}
 * @suppress {checkTypes}
 */
function $render(opt_data, opt_ignored, opt_ijData) {
  var $$temp;
  opt_data = opt_data || {};
  ie_open('div', null, null,
      'class', 'page-autocomplete');
    ie_open('div', null, null,
        'class', 'form-group');
      ie_open('div', null, null,
          'class', 'input-inner-addon input-inner-addon-right');
        ie_open('input', null, null,
            'autocomplete', 'off',
            'class', 'form-control',
            'name', 'q',
            'placeholder', ($$temp = opt_data.placeholder) == null ? '' : $$temp,
            'ref', 'input',
            'required', '',
            'type', 'text');
        ie_close('input');
        ie_void('span', null, null,
            'class', 'input-inner-icon-helper icon-16-magnifier');
      ie_close('div');
    ie_close('div');
  ie_close('div');
}
exports.render = $render;
if (goog.DEBUG) {
  $render.soyTemplateName = 'ElectricSearchAutocomplete.render';
}

exports.render.params = ["placeholder"];
exports.render.types = {"placeholder":"any"};
templates = exports;
return exports;

});

class ElectricSearchAutocomplete extends Component {}
Soy.register(ElectricSearchAutocomplete, templates);
export { ElectricSearchAutocomplete, templates };
export default templates;
/* jshint ignore:end */
