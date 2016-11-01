/**
 * This template will be rendered by SoyWeb when the user loads static.soy.
 * It deliberately includes dummy data so the designer can get a feel for how
 * the task list will appear with real data rather with minimal copy and paste.
 */
{template .soyweb}
	{call base.render data="all"}
		{param content kind="html"}
			{call .render data="all" /}
		{/param}
	{/call}
{/template}
