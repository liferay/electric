'use strict';

import Affix from 'metal-affix';
import Component from 'metal-component';
import core from 'metal';
import dom from 'metal-dom';
import ReadingProgress from 'metal-reading-progress';

class ElectricReadingProgress extends Component {
	attached() {
		this.renderReadingProgress_();
	}

	renderReadingProgress_() {
		const {
			articleContainer,
			articleSelector,
			element,
			offsetBottom,
			offsetTop,
			titleSelector
		} = this;

		if (articleContainer) {
			const articles = articleContainer.querySelectorAll(articleSelector);

			const articleIds = [].map.call(articles, article => {
				return `#${article.id}`;
			});

			this.progress = new ReadingProgress({
				items: articleIds,
				titleSelector: titleSelector,
				trackerConfig: {
					activeClass: 'reading',
					completedClass: 'read'
				}
			}, this.refs.readingContainer);

			this.affix = new Affix({
				element: element,
				offsetBottom: offsetBottom,
				offsetTop: offsetTop
			});
		}
	}

	disposed() {
		const {affix, progress} = this;

		if (affix) {
			affix.dispose();
		}

		if (progress) {
			progress.dispose();
		}
	}
};

ElectricReadingProgress.STATE = {
	articleContainer: {
		setter: dom.toElement,
		value: '.docs-guide'
	},

	articleSelector: {
		validator: core.isString,
		value: 'article'
	},

	offsetBottom: {
		validator: core.isNumber
	},

	offsetTop: {
		validator: core.isNumber,
		value: 230
	},

	titleSelector: {
		validator: core.isString,
		value: 'h2'
	}
};

export default ElectricReadingProgress;
