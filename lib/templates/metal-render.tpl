<div id="pageComponent">
	{$content}
</div>

<script src="/js/bundles/{$page.componentName}.js"></script>

<script>
	var data = JSON.parse({$serialized});

	if (window.electricPageComponent) {lb}
		window.prevElectricPageComponent = window.electricPageComponent;
	{rb}

	var getByPath = function(obj, path) {lb}
		path = path.split('.');

		for (var i = 0; i < path.length; i++) {lb}
			obj = obj[path[i]];
		{rb};

		return obj;
	{rb};

	if (window.pageComponent) {lb}
		var page = getByPath(data.site, data.pageLocation);

		window.electricPageComponent = pageComponent.default.render(pageComponent.default, {lb}
			element: '#pageComponent',
			page: page,
			site: data.site
		{rb});
	{rb}
</script>
