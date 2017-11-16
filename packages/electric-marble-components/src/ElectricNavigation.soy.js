/* jshint ignore:start */
import Component from 'metal-component';
import Soy from 'metal-soy';
var templates;
goog.loadModule(function(exports) {

// This file was automatically generated from ElectricNavigation.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace ElectricNavigation.
 * @hassoydeltemplate {ElectricNavigation.anchor.idom}
 * @hassoydelcall {ElectricNavigation.anchor.idom}
 * @public
 */

goog.module('ElectricNavigation.incrementaldom');

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
  var localAnchorVariant__soy207 = ($$temp = opt_data.anchorVariant) == null ? 'basic' : $$temp;
  var localCurrentDepth__soy208 = ($$temp = opt_data.currentDepth) == null ? 0 : $$temp;
  var localListItemActiveClasses__soy209 = ($$temp = opt_data.listItemActiveClasses) == null ? 'active' : $$temp;
  if (opt_data.section.children) {
    ie_open('nav', null, null,
        'class', ($$temp = opt_data.elementClasses) == null ? '' : $$temp);
      if (opt_data.depth && opt_data.depth == 1) {
        ie_open('button', null, null,
            'class', ($$temp = opt_data.togglerClasses) == null ? '' : $$temp);
          var dyn15 = ($$temp = opt_data.togglerLabel) == null ? 'Menu' : $$temp;
          if (typeof dyn15 == 'function') dyn15(); else if (dyn15 != null) itext(dyn15);
        ie_close('button');
      }
      ie_open('ul', null, null,
          'class', ($$temp = opt_data.listClasses) == null ? '' : $$temp);
        var childIdList251 = opt_data.section.childIds;
        var childIdListLen251 = childIdList251.length;
        for (var childIdIndex251 = 0; childIdIndex251 < childIdListLen251; childIdIndex251++) {
          var childIdData251 = childIdList251[childIdIndex251];
          var page__soy225 = opt_data.section.children[childIdData251];
          if (! page__soy225.hidden) {
            ie_open('li', null, null,
                'class', (($$temp = opt_data.listItemClasses) == null ? '' : $$temp) + (page__soy225.active ? ' ' + localListItemActiveClasses__soy209 : ''));
              soy.$$getDelegateFn(soy.$$getDelTemplateId('ElectricNavigation.anchor.idom'), localAnchorVariant__soy207, false)(soy.$$assignDefaults({index: childIdIndex251, page: page__soy225}, opt_data), null, opt_ijData);
              if (! opt_data.depth || localCurrentDepth__soy208 + 1 < opt_data.depth) {
                $render({anchorVariant: localAnchorVariant__soy207, currentDepth: localCurrentDepth__soy208 + 1, currentURL: opt_data.currentURL, depth: opt_data.depth, elementClasses: opt_data.elementClasses, linkClasses: opt_data.linkClasses, listClasses: opt_data.listClasses, listItemActiveClasses: opt_data.listItemActiveClasses, listItemClasses: opt_data.listItemClasses, togglerClasses: opt_data.togglerClasses, togglerLabel: opt_data.togglerLabel, section: page__soy225}, null, opt_ijData);
              }
            ie_close('li');
          }
        }
      ie_close('ul');
    ie_close('nav');
  }
}
exports.render = $render;
if (goog.DEBUG) {
  $render.soyTemplateName = 'ElectricNavigation.render';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {void}
 * @suppress {checkTypes}
 */
function __deltemplate_s254_b83841ac(opt_data, opt_ignored, opt_ijData) {
  var $$temp;
  if (opt_data.page.url || opt_data.page.redirect) {
    ie_open('a', null, null,
        'class', ($$temp = opt_data.linkClasses) == null ? '' : $$temp,
        'href', ($$temp = opt_data.page.redirect) == null ? opt_data.page.url : $$temp);
      ie_open('span');
        var dyn16 = ($$temp = opt_data.page.title) == null ? 'Missing' : $$temp;
        if (typeof dyn16 == 'function') dyn16(); else if (dyn16 != null) itext(dyn16);
      ie_close('span');
    ie_close('a');
  } else {
    ie_open('span', null, null,
        'class', ($$temp = opt_data.linkClasses) == null ? '' : $$temp);
      var dyn17 = ($$temp = opt_data.page.title) == null ? 'Missing' : $$temp;
      if (typeof dyn17 == 'function') dyn17(); else if (dyn17 != null) itext(dyn17);
    ie_close('span');
  }
}
exports.__deltemplate_s254_b83841ac = __deltemplate_s254_b83841ac;
if (goog.DEBUG) {
  __deltemplate_s254_b83841ac.soyTemplateName = 'ElectricNavigation.__deltemplate_s254_b83841ac';
}
soy.$$registerDelegateFn(soy.$$getDelTemplateId('ElectricNavigation.anchor.idom'), 'basic', 0, __deltemplate_s254_b83841ac);

exports.render.params = ["section","anchorVariant","currentDepth","currentURL","depth","elementClasses","linkClasses","listClasses","listItemActiveClasses","listItemClasses","togglerClasses","togglerLabel"];
exports.render.types = {"section":"any","anchorVariant":"any","currentDepth":"any","currentURL":"any","depth":"any","elementClasses":"any","linkClasses":"any","listClasses":"any","listItemActiveClasses":"any","listItemClasses":"any","togglerClasses":"any","togglerLabel":"any"};
templates = exports;
return exports;

});

class ElectricNavigation extends Component {}
Soy.register(ElectricNavigation, templates);
export { ElectricNavigation, templates };
export default templates;
/* jshint ignore:end */
