/* jshint ignore:start */
import Component from 'metal-component';
import Soy from 'metal-soy';
var templates;
goog.loadModule(function(exports) {

// This file was automatically generated from ElectricCode.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace ElectricCode.
 * @public
 */

goog.module('ElectricCode.incrementaldom');

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
  ie_open('div', null, null,
      'class', 'code-container' + (opt_data.elementClasses ? ' ' + opt_data.elementClasses : ''));
    ie_open('button', null, null,
        'class', 'btn btn-sm btn-copy');
      ie_void('span', null, null,
          'class', 'icon-12-overlap');
    ie_close('button');
    ie_open('pre');
      ie_open('code', null, null,
          'class', 'code',
          'data-mode', opt_data.mode,
          'ref', 'code');
        var dyn14 = opt_data.code;
        if (typeof dyn14 == 'function') dyn14(); else if (dyn14 != null) itext(dyn14);
      ie_close('code');
    ie_close('pre');
  ie_close('div');
}
exports.render = $render;
if (goog.DEBUG) {
  $render.soyTemplateName = 'ElectricCode.render';
}

exports.render.params = ["code","mode","elementClasses"];
exports.render.types = {"code":"any","mode":"any","elementClasses":"any"};
templates = exports;
return exports;

});

class ElectricCode extends Component {}
Soy.register(ElectricCode, templates);
export { ElectricCode, templates };
export default templates;
/* jshint ignore:end */
