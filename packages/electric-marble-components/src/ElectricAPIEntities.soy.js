/* jshint ignore:start */
import Component from 'metal-component';
import Soy from 'metal-soy';
var templates;
goog.loadModule(function(exports) {

// This file was automatically generated from ElectricAPIEntities.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace ElectricAPIEntities.
 * @public
 */

goog.module('ElectricAPIEntities.incrementaldom');

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
  ie_open('div');
    if (opt_data.entityData) {
      $entity(opt_data, null, opt_ijData);
    }
  ie_close('div');
}
exports.render = $render;
if (goog.DEBUG) {
  $render.soyTemplateName = 'ElectricAPIEntities.render';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {void}
 * @suppress {checkTypes}
 */
function $augments(opt_data, opt_ignored, opt_ijData) {
  ie_open('div', null, null,
      'class', 'entity-augments');
    var augmentationList24 = opt_data.augments;
    var augmentationListLen24 = augmentationList24.length;
    for (var augmentationIndex24 = 0; augmentationIndex24 < augmentationListLen24; augmentationIndex24++) {
      var augmentationData24 = augmentationList24[augmentationIndex24];
      ie_open('span');
        var dyn0 = augmentationData24.title;
        if (typeof dyn0 == 'function') dyn0(); else if (dyn0 != null) itext(dyn0);
        itext(' ');
      ie_close('span');
      if (augmentationData24.link) {
        ie_open('a', null, null,
            'href', '/api/' + augmentationData24.link + '.html');
          var dyn1 = augmentationData24.name;
          if (typeof dyn1 == 'function') dyn1(); else if (dyn1 != null) itext(dyn1);
        ie_close('a');
      } else {
        ie_open('code');
          var dyn2 = augmentationData24.name;
          if (typeof dyn2 == 'function') dyn2(); else if (dyn2 != null) itext(dyn2);
        ie_close('code');
      }
    }
  ie_close('div');
}
exports.augments = $augments;
if (goog.DEBUG) {
  $augments.soyTemplateName = 'ElectricAPIEntities.augments';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {void}
 * @suppress {checkTypes}
 */
function $default(opt_data, opt_ignored, opt_ijData) {
  ie_open('div', null, null,
      'class', 'entity-default');
    ie_open('span');
      itext('Default: ');
      ie_open('code');
        var dyn3 = opt_data['default'];
        if (typeof dyn3 == 'function') dyn3(); else if (dyn3 != null) itext(dyn3);
      ie_close('code');
    ie_close('span');
  ie_close('div');
}
exports.default = $default;
if (goog.DEBUG) {
  $default.soyTemplateName = 'ElectricAPIEntities.default';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {void}
 * @suppress {checkTypes}
 */
function $description(opt_data, opt_ignored, opt_ijData) {
  if (opt_data.description.type == 'html' || opt_data.description.type == 'text') {
    var dyn4 = opt_data.description.value;
    if (typeof dyn4 == 'function') dyn4(); else if (dyn4 != null) itext(dyn4);
  } else if (opt_data.description.type == 'inlineCode') {
    ie_open('code');
      var dyn5 = opt_data.description.value;
      if (typeof dyn5 == 'function') dyn5(); else if (dyn5 != null) itext(dyn5);
    ie_close('code');
  } else if (opt_data.description.children) {
    var childList42 = opt_data.description.children;
    var childListLen42 = childList42.length;
    for (var childIndex42 = 0; childIndex42 < childListLen42; childIndex42++) {
      var childData42 = childList42[childIndex42];
      $description({description: childData42}, null, opt_ijData);
    }
  }
}
exports.description = $description;
if (goog.DEBUG) {
  $description.soyTemplateName = 'ElectricAPIEntities.description';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {void}
 * @suppress {checkTypes}
 */
function $entity(opt_data, opt_ignored, opt_ijData) {
  ie_open('section', null, null,
      'class', 'card entity',
      'data-access', opt_data.entityData.access ? opt_data.entityData.access : 'public',
      'id', opt_data.entityData.name);
    $entityHeader(opt_data, null, opt_ijData);
    if (opt_data.entityData.augments) {
      $augments({augments: opt_data.entityData.augments}, null, opt_ijData);
    }
    if (opt_data.entityData.description) {
      ie_open('div', null, null,
          'class', 'entity-description');
        $description({description: opt_data.entityData.description}, null, opt_ijData);
      ie_close('div');
    }
    if (opt_data.entityData['default']) {
      $default({default: opt_data.entityData['default']}, null, opt_ijData);
    }
    if (opt_data.entityData.params) {
      $params({params: opt_data.entityData.params}, null, opt_ijData);
    }
    if (opt_data.entityData.returns) {
      $returns({returns: opt_data.entityData.returns}, null, opt_ijData);
    }
    if (opt_data.entityData.members) {
      $members(soy.$$assignDefaults({members: opt_data.entityData.members}, opt_data), null, opt_ijData);
    }
  ie_close('section');
}
exports.entity = $entity;
if (goog.DEBUG) {
  $entity.soyTemplateName = 'ElectricAPIEntities.entity';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {void}
 * @suppress {checkTypes}
 */
function $entityHeader(opt_data, opt_ignored, opt_ijData) {
  ie_open('div', null, null,
      'class', 'entity-header');
    $entityName(opt_data, null, opt_ijData);
    var loc__soy81 = opt_data.entityData.context.loc;
    var filePath__soy82 = opt_data.entityData.context.file + '#L' + loc__soy81.start.line + (loc__soy81.end.line != loc__soy81.start.line ? '-L' + loc__soy81.end.line : '');
    ie_open('a', null, null,
        'class', 'entity-link',
        'href', 'https://github.com/' + opt_data.project.user + '/' + opt_data.project.repo + '/tree/' + opt_data.project.ref + '/' + filePath__soy82);
      var dyn6 = filePath__soy82;
      if (typeof dyn6 == 'function') dyn6(); else if (dyn6 != null) itext(dyn6);
    ie_close('a');
  ie_close('div');
}
exports.entityHeader = $entityHeader;
if (goog.DEBUG) {
  $entityHeader.soyTemplateName = 'ElectricAPIEntities.entityHeader';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {void}
 * @suppress {checkTypes}
 */
function $entityName(opt_data, opt_ignored, opt_ijData) {
  ie_open('h1', null, null,
      'class', 'entity-name');
    ie_open('a', null, null,
        'href', '#' + opt_data.entityData.name);
      if (opt_data.entityData.access) {
        ie_open('span', null, null,
            'class', 'entity-access');
          var dyn7 = opt_data.entityData.access + ' ';
          if (typeof dyn7 == 'function') dyn7(); else if (dyn7 != null) itext(dyn7);
        ie_close('span');
      }
      var dyn8 = opt_data.entityData.name;
      if (typeof dyn8 == 'function') dyn8(); else if (dyn8 != null) itext(dyn8);
      if (opt_data.entityData.kind == 'function' || opt_data.entityData.name == 'constructor') {
        itext('(');
        if (opt_data.entityData.params) {
          $inlineParams({params: opt_data.entityData.params}, null, opt_ijData);
        }
        itext(')');
      } else if (opt_data.entityData.type) {
        ie_open('span', null, null,
            'class', 'entity-name-type');
          itext(':');
          var dyn9 = opt_data.entityData.type;
          if (typeof dyn9 == 'function') dyn9(); else if (dyn9 != null) itext(dyn9);
        ie_close('span');
      }
    ie_close('a');
  ie_close('h1');
}
exports.entityName = $entityName;
if (goog.DEBUG) {
  $entityName.soyTemplateName = 'ElectricAPIEntities.entityName';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {void}
 * @suppress {checkTypes}
 */
function $inlineParams(opt_data, opt_ignored, opt_ijData) {
  ie_open('span');
    var paramList123 = opt_data.params;
    var paramListLen123 = paramList123.length;
    for (var paramIndex123 = 0; paramIndex123 < paramListLen123; paramIndex123++) {
      var paramData123 = paramList123[paramIndex123];
      var dyn10 = paramData123.name;
      if (typeof dyn10 == 'function') dyn10(); else if (dyn10 != null) itext(dyn10);
      if (! (paramIndex123 == paramListLen123 - 1)) {
        itext(', ');
      }
    }
  ie_close('span');
}
exports.inlineParams = $inlineParams;
if (goog.DEBUG) {
  $inlineParams.soyTemplateName = 'ElectricAPIEntities.inlineParams';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {void}
 * @suppress {checkTypes}
 */
function $members(opt_data, opt_ignored, opt_ijData) {
  ie_open('div', null, null,
      'class', 'entity-members');
    if (opt_data.members.properties && opt_data.members.properties.length) {
      ie_open('h2');
        itext('Properties:');
      ie_close('h2');
      var propertyList134 = opt_data.members.properties;
      var propertyListLen134 = propertyList134.length;
      for (var propertyIndex134 = 0; propertyIndex134 < propertyListLen134; propertyIndex134++) {
        var propertyData134 = propertyList134[propertyIndex134];
        $entity(soy.$$assignDefaults({entityData: propertyData134, instance: true}, opt_data), null, opt_ijData);
      }
    }
    if (opt_data.members.methods && opt_data.members.methods.length) {
      ie_open('h2');
        itext('Methods:');
      ie_close('h2');
      var methodList142 = opt_data.members.methods;
      var methodListLen142 = methodList142.length;
      for (var methodIndex142 = 0; methodIndex142 < methodListLen142; methodIndex142++) {
        var methodData142 = methodList142[methodIndex142];
        $entity(soy.$$assignDefaults({entityData: methodData142, instance: true}, opt_data), null, opt_ijData);
      }
    }
    if (opt_data.members['static'] && opt_data.members['static'].length) {
      ie_open('h2');
        itext('Static:');
      ie_close('h2');
      var staticMemberList150 = opt_data.members['static'];
      var staticMemberListLen150 = staticMemberList150.length;
      for (var staticMemberIndex150 = 0; staticMemberIndex150 < staticMemberListLen150; staticMemberIndex150++) {
        var staticMemberData150 = staticMemberList150[staticMemberIndex150];
        $entity(soy.$$assignDefaults({entityData: staticMemberData150, static: true}, opt_data), null, opt_ijData);
      }
    }
  ie_close('div');
}
exports.members = $members;
if (goog.DEBUG) {
  $members.soyTemplateName = 'ElectricAPIEntities.members';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {void}
 * @suppress {checkTypes}
 */
function $param(opt_data, opt_ignored, opt_ijData) {
  ie_open('tr');
    ie_open('td');
      var dyn11 = opt_data.param.name;
      if (typeof dyn11 == 'function') dyn11(); else if (dyn11 != null) itext(dyn11);
    ie_close('td');
    ie_open('td');
      if (opt_data.param.type) {
        $type({type: opt_data.param.type}, null, opt_ijData);
      }
    ie_close('td');
    ie_open('td');
      if (opt_data.param.description) {
        $description({description: opt_data.param.description}, null, opt_ijData);
      }
    ie_close('td');
  ie_close('tr');
}
exports.param = $param;
if (goog.DEBUG) {
  $param.soyTemplateName = 'ElectricAPIEntities.param';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {void}
 * @suppress {checkTypes}
 */
function $params(opt_data, opt_ignored, opt_ijData) {
  ie_open('div', null, null,
      'class', 'entity-params');
    ie_open('div', null, null,
        'class', 'datatable');
      ie_open('table', null, null,
          'class', 'table');
        ie_open('thead');
          ie_open('tr');
            ie_open('th');
              itext('Parameter');
            ie_close('th');
            ie_open('th');
              itext('Type');
            ie_close('th');
            ie_open('th');
              itext('Description');
            ie_close('th');
          ie_close('tr');
        ie_close('thead');
        ie_open('tbody');
          var paramList171 = opt_data.params;
          var paramListLen171 = paramList171.length;
          for (var paramIndex171 = 0; paramIndex171 < paramListLen171; paramIndex171++) {
            var paramData171 = paramList171[paramIndex171];
            $param({param: paramData171}, null, opt_ijData);
          }
        ie_close('tbody');
      ie_close('table');
    ie_close('div');
  ie_close('div');
}
exports.params = $params;
if (goog.DEBUG) {
  $params.soyTemplateName = 'ElectricAPIEntities.params';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {void}
 * @suppress {checkTypes}
 */
function $returns(opt_data, opt_ignored, opt_ijData) {
  ie_open('div', null, null,
      'class', 'entity-returns');
    var return__soy176 = opt_data.returns[0];
    ie_open('span');
      itext('Returns: ');
      ie_open('code');
        $type({type: return__soy176.type}, null, opt_ijData);
      ie_close('code');
    ie_close('span');
    if (return__soy176.description) {
      ie_open('div');
        $description({description: return__soy176.description}, null, opt_ijData);
      ie_close('div');
    }
  ie_close('div');
}
exports.returns = $returns;
if (goog.DEBUG) {
  $returns.soyTemplateName = 'ElectricAPIEntities.returns';
}


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {void}
 * @suppress {checkTypes}
 */
function $type(opt_data, opt_ignored, opt_ijData) {
  ie_open('span');
    if (opt_data.type.expression) {
      var dyn12 = opt_data.type.expression.name;
      if (typeof dyn12 == 'function') dyn12(); else if (dyn12 != null) itext(dyn12);
    } else {
      var dyn13 = opt_data.type.name;
      if (typeof dyn13 == 'function') dyn13(); else if (dyn13 != null) itext(dyn13);
    }
  ie_close('span');
}
exports.type = $type;
if (goog.DEBUG) {
  $type.soyTemplateName = 'ElectricAPIEntities.type';
}

exports.render.params = ["entityData","project"];
exports.render.types = {"entityData":"any","project":"any"};
exports.augments.params = ["augments"];
exports.augments.types = {"augments":"any"};
exports.default.params = ["default"];
exports.default.types = {"default":"any"};
exports.description.params = ["description"];
exports.description.types = {"description":"any"};
exports.entity.params = ["entityData","project"];
exports.entity.types = {"entityData":"any","project":"any"};
exports.entityHeader.params = ["entityData","project"];
exports.entityHeader.types = {"entityData":"any","project":"any"};
exports.entityName.params = ["entityData"];
exports.entityName.types = {"entityData":"any"};
exports.inlineParams.params = ["params"];
exports.inlineParams.types = {"params":"any"};
exports.members.params = ["members","project"];
exports.members.types = {"members":"any","project":"any"};
exports.param.params = ["param"];
exports.param.types = {"param":"any"};
exports.params.params = ["params"];
exports.params.types = {"params":"any"};
exports.returns.params = ["returns"];
exports.returns.types = {"returns":"any"};
exports.type.params = ["type"];
exports.type.types = {"type":"any"};
templates = exports;
return exports;

});

class ElectricAPIEntities extends Component {}
Soy.register(ElectricAPIEntities, templates);
export { ElectricAPIEntities, templates };
export default templates;
/* jshint ignore:end */
