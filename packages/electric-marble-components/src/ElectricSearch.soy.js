/* jshint ignore:start */
import Component from 'metal-component';
import Soy from 'metal-soy';
var templates;
goog.loadModule(function(exports) {

// This file was automatically generated from ElectricSearch.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace ElectricSearch.
 * @public
 */

goog.module('ElectricSearch.incrementaldom');

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
      'class', 'search');
    $form(opt_data, null, opt_ijData);
    $results(opt_data, null, opt_ijData);
  ie_close('div');
}
exports.render = $render;
if (goog.DEBUG) {
  $render.soyTemplateName = 'ElectricSearch.render';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {void}
 * @suppress {checkTypes}
 */
function $form(opt_data, opt_ignored, opt_ijData) {
  opt_data = opt_data || {};
  ie_open('form', null, null,
      'class', 'docs-home-top-form',
      'action', opt_data.action,
      'method', 'GET',
      'enctype', 'multipart/form-data');
    ie_open('div', null, null,
        'class', 'row');
      ie_open('div', null, null,
          'class', 'col-md-7 col-md-offset-3 col-xs-16');
        ie_open('div', null, null,
            'class', 'form-group');
          ie_open('div', null, null,
              'class', 'input-inner-addon input-inner-addon-right');
            ie_open('input', null, null,
                'autocomplete', 'off',
                'class', 'form-control',
                'name', 'q',
                'onInput', 'handleInput_',
                'placeholder', opt_data.placeholder,
                'value', opt_data.query,
                'type', 'text');
            ie_close('input');
            ie_void('span', null, null,
                'class', 'input-inner-icon-helper icon-16-magnifier');
          ie_close('div');
        ie_close('div');
      ie_close('div');
      ie_open('div', null, null,
          'class', 'col-md-3 col-xs-16');
        ie_open('button', null, null,
            'class', 'btn btn-accent btn-block',
            'type', 'submit');
          itext('Search');
        ie_close('button');
      ie_close('div');
    ie_close('div');
  ie_close('form');
}
exports.form = $form;
if (goog.DEBUG) {
  $form.soyTemplateName = 'ElectricSearch.form';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {void}
 * @suppress {checkTypes}
 */
function $results(opt_data, opt_ignored, opt_ijData) {
  opt_data = opt_data || {};
  ie_open('div', null, null,
      'class', 'search-result-container');
    if (opt_data.query) {
      ie_open('p', null, null,
          'class', 'search-result-summary');
        itext('Showing ');
        var dyn18 = opt_data.results.length;
        if (typeof dyn18 == 'function') dyn18(); else if (dyn18 != null) itext(dyn18);
        itext(' results for ');
        ie_open('strong');
          itext('"');
          var dyn19 = opt_data.query;
          if (typeof dyn19 == 'function') dyn19(); else if (dyn19 != null) itext(dyn19);
          itext('"');
        ie_close('strong');
      ie_close('p');
    }
    if (opt_data.results) {
      var resultList313 = opt_data.results;
      var resultListLen313 = resultList313.length;
      for (var resultIndex313 = 0; resultIndex313 < resultListLen313; resultIndex313++) {
        var resultData313 = resultList313[resultIndex313];
        ie_open('div', null, null,
            'class', 'search-result');
          if (resultData313.icon) {
            ie_open('div', null, null,
                'class', 'search-result-icon');
              ie_void('span', null, null,
                  'class', 'icon-16-' + resultData313.icon);
            ie_close('div');
          }
          ie_open('a', null, null,
              'class', 'search-result-link',
              'href', resultData313.url);
            var dyn20 = resultData313.title;
            if (typeof dyn20 == 'function') dyn20(); else if (dyn20 != null) itext(dyn20);
          ie_close('a');
          ie_open('p', null, null,
              'class', 'search-result-text');
            var dyn21 = resultData313.description;
            if (typeof dyn21 == 'function') dyn21(); else if (dyn21 != null) itext(dyn21);
          ie_close('p');
        ie_close('div');
      }
    }
  ie_close('div');
}
exports.results = $results;
if (goog.DEBUG) {
  $results.soyTemplateName = 'ElectricSearch.results';
}

exports.render.params = ["action","placeholder","query","results"];
exports.render.types = {"action":"any","placeholder":"any","query":"any","results":"any"};
exports.form.params = ["action","placeholder","query"];
exports.form.types = {"action":"any","placeholder":"any","query":"any"};
exports.results.params = ["results","query"];
exports.results.types = {"results":"any","query":"any"};
templates = exports;
return exports;

});

class ElectricSearch extends Component {}
Soy.register(ElectricSearch, templates);
export { ElectricSearch, templates };
export default templates;
/* jshint ignore:end */
