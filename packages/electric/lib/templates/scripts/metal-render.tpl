(function() {
	function electricInit(json) {
		var data = JSON.parse(json);

		if (window.electricPageComponent) {
			window.electricPageComponent.dispose();
		}

		var getByPath = function(obj, path) {
			path = path.split('.');

			for (var i = 0; i < path.length; i++) {
				obj = obj[path[i]];
			};

			return obj;
		};

		if (window.pageComponent) {
			var page = getByPath(data.site, data.pageLocation);

			if (page) {
				window.electricPageComponent = pageComponent.default.render(pageComponent.default, {
					element: '#pageComponent > *',
					page: page,
					site: data.site
				});
			}

			if (window.runCodeMirror) {
				runCodeMirror();
			}
		}
	}

	window.electricInit = electricInit;
})();