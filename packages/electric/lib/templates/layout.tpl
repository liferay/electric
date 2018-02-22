<% if (frontMatter) { %>---
<%= frontMatter %>
---<% } %>

{namespace <%= namespace %>}

/**
 */
{template .render}
	{@param page: ?}
	{@param site: ?}

	{call <%= layout %>.render data="all"}
		{param content kind="html"}
			<%= content %>
			<input type="hidden" value="{$page.title}">
			<input type="hidden" value="{$site.title}">
		{/param}
	{/call}
{/template}
