<div id="pageComponent">
	{$content}
</div>

{if $page.componentName}
	<script src="{$site.basePath}/js/bundles/{$page.componentName}.js"></script>
{/if}

<script src="{$site.basePath}/js/electric/metal-render.js"></script>

<script>
	electricInit('{$serialized}');
</script>
