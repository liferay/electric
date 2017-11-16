'use strict';

import Clipboard from 'metal-clipboard';
import Component from 'metal-component';
import Tooltip from 'metal-tooltip';

class ElectricCode extends Component {
	attached() {
		const selector = '.code-container .btn-copy';

		if (!window.electricClipboardTooltip) {
			window.electricClipboardTooltip = new Tooltip({
				delay: [300, 150],
				elementClasses: 'fade',
				events: {
					visibleChanged: function(event) {
						if (event.newVal) {
							this.title = 'Copy';
						}
					}
				},
				selector: selector,
				title: 'Copy',
				visible: false
			});
		}

		if (!window.electricClipboard) {
			window.electricClipboard = new Clipboard({
				selector: selector,
				text: delegateTarget => {
					window.electricClipboardTooltip.title = 'Copied';
					return delegateTarget.parentNode.querySelector('pre .code').innerText;
				}
			});
		}
	}
};

export default ElectricCode;
