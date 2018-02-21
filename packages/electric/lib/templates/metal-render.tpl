<div id="pageComponent">
	{$content}
</div>

{if $page.componentName}
	<script src="{$site.basePath}/js/bundles/{$page.componentName}.js"></script>
{/if}

<script>
	var data = '{$serialized}';

	if (typeof electric !== 'undefined') {lb}
		electric.init(data);
	{rb}
	else {lb}
		document.addEventListener('DOMContentLoaded', function() {lb}
			electric.init(data);
		{rb});
	{rb}
</script>
