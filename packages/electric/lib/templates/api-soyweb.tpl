{namespace <%= namespace %>}

/**
 *
 */
{template .render}
	{call <%= layout %>.render data="all"}
		{param content kind="html"}
			{call ElectricApi.render data="all" /}
		{/param}
		{param elementClasses: 'docs' /}
	{/call}
{/template}
