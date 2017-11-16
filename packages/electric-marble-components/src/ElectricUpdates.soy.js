/* jshint ignore:start */
import Component from 'metal-component';
import Soy from 'metal-soy';
var templates;
goog.loadModule(function(exports) {

// This file was automatically generated from ElectricUpdates.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace ElectricUpdates.
 * @hassoydeltemplate {ElectricUpdates.feature.idom}
 * @hassoydelcall {ElectricUpdates.feature.idom}
 * @public
 */

goog.module('ElectricUpdates.incrementaldom');

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
      'class', 'updates');
    ie_open('div', null, null,
        'class', 'container');
      $updates(opt_data, null, opt_ijData);
    ie_close('div');
  ie_close('div');
}
exports.render = $render;
if (goog.DEBUG) {
  $render.soyTemplateName = 'ElectricUpdates.render';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {void}
 * @suppress {checkTypes}
 */
function $updates(opt_data, opt_ignored, opt_ijData) {
  ie_open('div', null, null,
      'class', 'row');
    ie_open('div', null, null,
        'class', 'col-lg-10 col-lg-offset-3 col-md-16 col-md-offset-0');
      if (opt_data.updates) {
        var updateList338 = opt_data.updates;
        var updateListLen338 = updateList338.length;
        for (var updateIndex338 = 0; updateIndex338 < updateListLen338; updateIndex338++) {
          var updateData338 = updateList338[updateIndex338];
          ie_open('section', null, null,
              'class', 'update');
            ie_open('div', null, null,
                'class', 'row update-row');
              ie_open('div', null, null,
                  'class', 'col-sm-3 ' + (updateData338.major ? 'major' : 'minor') + '-update update-timeline');
                ie_open('div', null, null,
                    'class', 'update-point');
                  var dyn22 = updateData338.version;
                  if (typeof dyn22 == 'function') dyn22(); else if (dyn22 != null) itext(dyn22);
                ie_close('div');
              ie_close('div');
              ie_open('div', null, null,
                  'class', 'col-sm-13 update-features');
                $features(soy.$$assignDefaults({features: updateData338.features}, opt_data), null, opt_ijData);
              ie_close('div');
            ie_close('div');
          ie_close('section');
        }
      }
    ie_close('div');
  ie_close('div');
}
exports.updates = $updates;
if (goog.DEBUG) {
  $updates.soyTemplateName = 'ElectricUpdates.updates';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {void}
 * @suppress {checkTypes}
 */
function $features(opt_data, opt_ignored, opt_ijData) {
  var $$temp;
  var localFeatureVariant__soy342 = ($$temp = opt_data.featureVariant) == null ? 'basic' : $$temp;
  ie_open('div', null, null,
      'class', 'row');
    var featureList346 = opt_data.features;
    var featureListLen346 = featureList346.length;
    for (var featureIndex346 = 0; featureIndex346 < featureListLen346; featureIndex346++) {
      var featureData346 = featureList346[featureIndex346];
      soy.$$getDelegateFn(soy.$$getDelTemplateId('ElectricUpdates.feature.idom'), localFeatureVariant__soy342, false)(soy.$$assignDefaults({feature: featureData346}, opt_data), null, opt_ijData);
    }
  ie_close('div');
}
exports.features = $features;
if (goog.DEBUG) {
  $features.soyTemplateName = 'ElectricUpdates.features';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {void}
 * @suppress {checkTypes}
 */
function __deltemplate_s349_5080d024(opt_data, opt_ignored, opt_ijData) {
  ie_open('div', null, null,
      'class', 'col-xs-16 col-sm-8 update-feature');
    ie_open('div', null, null,
        'class', 'feature-topper');
      if (opt_data.feature.icon) {
        ie_void('span', null, null,
            'class', 'feature-icon icon-16-' + opt_data.feature.icon);
      }
      ie_open('h1', null, null,
          'class', 'feature-header');
        var dyn23 = opt_data.feature.title;
        if (typeof dyn23 == 'function') dyn23(); else if (dyn23 != null) itext(dyn23);
      ie_close('h1');
    ie_close('div');
    ie_open('div', null, null,
        'class', 'feature-content');
      ie_open('p', null, null,
          'class', 'feature-lead');
        var dyn24 = opt_data.feature.description;
        if (typeof dyn24 == 'function') dyn24(); else if (dyn24 != null) itext(dyn24);
      ie_close('p');
      if (opt_data.feature.url) {
        ie_open('div', null, null,
            'class', 'read-more');
          ie_open('a', null, null,
              'href', opt_data.feature.url);
            itext('Read more\u2026');
          ie_close('a');
        ie_close('div');
      }
    ie_close('div');
  ie_close('div');
}
exports.__deltemplate_s349_5080d024 = __deltemplate_s349_5080d024;
if (goog.DEBUG) {
  __deltemplate_s349_5080d024.soyTemplateName = 'ElectricUpdates.__deltemplate_s349_5080d024';
}
soy.$$registerDelegateFn(soy.$$getDelTemplateId('ElectricUpdates.feature.idom'), 'basic', 0, __deltemplate_s349_5080d024);

exports.render.params = ["featureVariant","updates"];
exports.render.types = {"featureVariant":"any","updates":"any"};
exports.updates.params = ["featureVariant","updates"];
exports.updates.types = {"featureVariant":"any","updates":"any"};
exports.features.params = ["featureVariant","features"];
exports.features.types = {"featureVariant":"any","features":"any"};
templates = exports;
return exports;

});

class ElectricUpdates extends Component {}
Soy.register(ElectricUpdates, templates);
export { ElectricUpdates, templates };
export default templates;
/* jshint ignore:end */
