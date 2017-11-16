'use strict';

import Tabs from 'metal-tabs';
import dom from 'metal-dom';
import State from 'metal-state';

/**
 * Class the identity sibling rendered "Code Mirror" components on the
 * page and make them tab navigable.
 */
class ElectricCodeTabs extends State {
  constructor(opt) {
    super(opt);

    let tabGroupsData = [];
    let elements = Array.prototype.slice.call(document.querySelectorAll('.' + this.className));
    elements.forEach(element => {
      tabGroupsData.push({
        label: this.getTabLabelFromElement_(element),
        element: element
      });
      if (!element.nextElementSibling || !dom.hasClass(element.nextElementSibling, this.className)) {
        if(tabGroupsData.length > 1) {
          this.renderTabs_(tabGroupsData);
        }
        tabGroupsData = [];
      }
    });
  }

  /**
   * Extracts the tab label from a given code mirror element.
   * @param  {element} element
   * @return {string} The title from the element or the matched map value.
   * @private
   */
  getTabLabelFromElement_(element) {
    let tabLabel = element.querySelector('.code').dataset.mode;
    return this.dictionary[tabLabel] || tabLabel;
  }

  /**
   * Hides a given element by adding the hide CSS class.
   * @param  {element} element
   * @private
   */
  hide_(element) {
    dom.addClasses(element, 'hide');
  }

  /**
   * Hides all code mirror elements related to a tab navigation.
   * @param  {Array<element>} tabs
   * @private
   */
  hideAll_(tabs) {
    tabs.forEach((tab) => {
      this.hide_(tab.element);
    });
  }

  /**
   * Renders a tab navigations for a given tab content group.
   * @param  {Array<Object>} data
   * @private
   */
  renderTabs_(data) {
    let container = dom.buildFragment('<div class="tabContainer"></div>');
    let tabsComponent = new Tabs({
      elementClasses: 'nav-code-tabs',
      tabs: data
    }, container);

    tabsComponent.on('changeRequest', event => {
      let currentTab = event.state.tab;
      this.hideAll_(tabsComponent.tabs);
      this.show_(tabsComponent.tabs[currentTab].element);
    });

    this.hideAll_(tabsComponent.tabs);
    this.show_(tabsComponent.tabs[0].element);

    data[0].element.parentNode.insertBefore(container, data[0].element);
  }

  /**
   * Shows a given code mirror element by removing the hide CSS class.
   * @param  {Array<Object>} data
   */
  show_(element) {
    dom.removeClasses(element, 'hide');
  }
}

/**
 * State definition.
 * @type {!Object}
 * @static
 */
ElectricCodeTabs.STATE = {
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

window.ElectricCodeTabs = ElectricCodeTabs;

export default ElectricCodeTabs;
