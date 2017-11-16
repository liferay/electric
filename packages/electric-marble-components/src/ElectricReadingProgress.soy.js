/* jshint ignore:start */
import Component from 'metal-component';
import Soy from 'metal-soy';
var templates;
goog.loadModule(function(exports) {

// This file was automatically generated from ElectricReadingProgress.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace ElectricReadingProgress.
 * @public
 */

goog.module('ElectricReadingProgress.incrementaldom');

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
  opt_data = opt_data || {};
  ie_open('div', null, null,
      'class', 'affix-top' + (opt_data.elementClasses ? ' ' + opt_data.elementClasses : ''));
    ie_void('div', null, null,
        'ref', 'readingContainer');
  ie_close('div');
}
exports.render = $render;
if (goog.DEBUG) {
  $render.soyTemplateName = 'ElectricReadingProgress.render';
}

exports.render.params = ["elementClasses"];
exports.render.types = {"elementClasses":"any"};
templates = exports;
return exports;

});

class ElectricReadingProgress extends Component {}
Soy.register(ElectricReadingProgress, templates);
export { ElectricReadingProgress, templates };
export default templates;
/* jshint ignore:end */
