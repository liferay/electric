<%= content %>

/**
 *
 */
{template .soyweb}
	{call base.render data="all"}
		{param content kind="html"}
			{call .render data="all" /}
		{/param}
	{/call}
{/template}
