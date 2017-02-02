<div id="pageComponent">
	{$content}
</div>

<script>
	var data = JSON.parse({$serialized});

	metal.Component.render(metal[data.page.componentName], {lb}
		element: '#pageComponent',
		page: data.page,
		site: data.site
	{rb});
</script>
