{namespace <%= namespace %>}

/**
 *
 */
{template .soyweb}
	{call base.render data="all"}
		{param content kind="html"}
			{call <%= layout %>.render data="all"}
				{param content kind="html"}
					{call ElectricApi.render data="all" /}
				{/param}
				{param elementClasses: 'docs' /}
			{/call}
		{/param}
	{/call}
{/template}
