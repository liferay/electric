'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _metalTabs = require('metal-tabs');

var _metalTabs2 = _interopRequireDefault(_metalTabs);

var _metalDom = require('metal-dom');

var _metalDom2 = _interopRequireDefault(_metalDom);

var _metalState = require('metal-state');

var _metalState2 = _interopRequireDefault(_metalState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class the identity sibling rendered "Code Mirror" components on the
 * page and make them tab navigable.
 */
var CodeTabs = function (_State) {
  _inherits(CodeTabs, _State);

  function CodeTabs(opt) {
    _classCallCheck(this, CodeTabs);

    var _this = _possibleConstructorReturn(this, (CodeTabs.__proto__ || Object.getPrototypeOf(CodeTabs)).call(this, opt));

    var tabGroupsData = [];
    document.querySelectorAll('.' + _this.className).forEach(function (element) {
      tabGroupsData.push({
        label: _this.getTabLabelFromElement_(element),
        element: element
      });
      if (!element.nextElementSibling || !_metalDom2.default.hasClass(element.nextElementSibling, _this.className)) {
        if (tabGroupsData.length > 1) {
          _this.renderTabs_(tabGroupsData);
        }
        tabGroupsData = [];
      }
    });
    return _this;
  }

  /**
   * Extracts the tab label from a given code mirror element.
   * @param  {element} element
   * @return {string} The title from the element or the matched map value.
   * @private
   */


  _createClass(CodeTabs, [{
    key: 'getTabLabelFromElement_',
    value: function getTabLabelFromElement_(element) {
      var tabLabel = element.querySelector('.code').dataset.mode;
      return this.dictionary[tabLabel] || tabLabel;
    }

    /**
     * Hides a given element by adding the hide CSS class.
     * @param  {element} element
     * @private
     */

  }, {
    key: 'hide_',
    value: function hide_(element) {
      _metalDom2.default.addClasses(element, 'hide');
    }

    /**
     * Hides all code mirror elements related to a tab navigation.
     * @param  {Array<element>} tabs
     * @private
     */

  }, {
    key: 'hideAll_',
    value: function hideAll_(tabs) {
      var _this2 = this;

      tabs.forEach(function (tab) {
        _this2.hide_(tab.element);
      });
    }

    /**
     * Renders a tab navigations for a given tab content group.
     * @param  {Array<Object>} data
     * @private
     */

  }, {
    key: 'renderTabs_',
    value: function renderTabs_(data) {
      var _this3 = this;

      var container = _metalDom2.default.buildFragment('<div class="tabContainer"></div>');
      var tabsComponent = new _metalTabs2.default({
        elementClasses: 'nav-code-tabs',
        tabs: data
      }, container);

      tabsComponent.on('changeRequest', function (event) {
        var currentTab = event.state.tab;
        _this3.hideAll_(tabsComponent.tabs);
        _this3.show_(tabsComponent.tabs[currentTab].element);
      });

      this.hideAll_(tabsComponent.tabs);
      this.show_(tabsComponent.tabs[0].element);

      data[0].element.parentNode.insertBefore(container, data[0].element);
    }

    /**
     * Shows a given code mirror element by removing the hide CSS class.
     * @param  {Array<Object>} data
     */

  }, {
    key: 'show_',
    value: function show_(element) {
      _metalDom2.default.removeClasses(element, 'hide');
    }
  }]);

  return CodeTabs;
}(_metalState2.default);

/**
 * State definition.
 * @type {!Object}
 * @static
 */


CodeTabs.STATE = {
  /**
  * The code mirror container CSS class name used for looking for elements and
   * group them to build tabs.
  * @type {string}
  * @default {string}
  */
  className: {
    value: 'code-container'
  },

  /**
  * A dictionary of languages label
  * @type {Object}
  * @default {}
  */
  dictionary: {
    value: {
      'text/html': 'HTML',
      'text/x-java': 'Java',
      'application/json': 'JSON'
    }
  }
};

exports.default = CodeTabs;