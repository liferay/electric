'use strict';

import {isServerSide} from 'metal';
import Affix from 'metal-affix';
import Component from 'metal-component';
import core from 'metal';
import dom from 'metal-dom';
import ReadingProgress from 'metal-reading-progress';

class ElectricReadingProgress extends Component {
	attached() {
		if (isServerSide()) {
			return;
		}

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

			const articleIds = [].reduce.call(articles, (result, article) => {
				if (article.querySelector(titleSelector)) {
					result.push(`#${article.id}`);
				}

				return result;
			}, []);

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
