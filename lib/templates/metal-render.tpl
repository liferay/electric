<div id="pageComponent">
	{$content}
</div>

{if $page.componentName}
	<script src="${basePath}/js/bundles/{$page.componentName}.js"></script>
{/if}

<script>
	var data = JSON.parse({$serialized});

	if (window.electricPageComponent) {lb}
		window.electricPageComponent.dispose();
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

		if (page) {lb}
			window.electricPageComponent = pageComponent.default.render(pageComponent.default, {lb}
				element: '#pageComponent > *',
				page: page,
				site: data.site
			{rb});
		{rb}

		if (window.runCodeMirror) {lb}
			runCodeMirror();
		{rb}
	{rb}
</script>
