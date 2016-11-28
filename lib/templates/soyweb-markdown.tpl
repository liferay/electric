<% if (frontMatter) { %>---
<%= frontMatter %>
---<% } %>

{namespace <%= namespace %>}

/**
 *
 */
{template .render}
	{call <%= layout %>.render data="all"}
		{param content kind="html"}
			<%= content %>
		{/param}
	{/call}
{/template}
