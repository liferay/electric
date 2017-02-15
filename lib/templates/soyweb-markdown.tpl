<% if (frontMatter) { %>---
<%= frontMatter %>
---<% } %>

{namespace <%= namespace %>}

/**
 * @param? page
 * @param? site
 */
{template .render}
	{call <%= layout %>.render data="all"}
		{param content kind="html"}
			<%= content %>
		{/param}
	{/call}
{/template}
