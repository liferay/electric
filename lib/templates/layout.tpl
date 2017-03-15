<% if (frontMatter) { %>---
<%= frontMatter %>
---<% } %>

{namespace <%= namespace %>}

/**
 * @param page
 * @param site
 */
{template .render}
	{call <%= layout %>.render data="all"}
		{param content kind="html"}
			<%= content %>
			<input type="hidden" value="{$page.title}">
			<input type="hidden" value="{$site.title}">
		{/param}
	{/call}
{/template}
