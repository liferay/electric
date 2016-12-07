---
description: "Creating pages in soy and markdown."
layout: "docs"
title: "Pages"
weight: 5
---

<article id="article1">

## Front Matter

All files in the `pages` directory must have the following front matter declared
at the beginning of the file.

{literal}

```
---
title: "Page Title"
description: "Description."
---
```

{/literal}

The `title` property will be used for auto-generated navigation elements and as
the page's `<title>`.

Both the `title` and `description` properties will be used for search
functionality.

</article>

<article id="article2">

## Soy

All files ending with the `.soy` extension will be rendered as soy templates.

```soy
---
description: "Page description."
title: "Page"
---

{lb}namespace page{rb}

/**
 *
 */
{lb}template .render{rb}
    <span>Hello, World!</span>
{lb}/template{rb}
```

> Note: all `namespace` properties must be unique across all files within
the `src` directory, and every soy file must define a `.render` template.

### Site/Page Data

Every page is passed a `site` and `page` param.

The `page` param represents the front matter of the current file.

{literal}

```
{$page.title}
{$page.description}
```

{/literal}

The `site` param contains project meta data such
as `site.title` and `site.repo`. It also contains the structure of the entire
site which can be used to generate navigation elements. This structure data is
defined as the `site.index` property representing the index page of the project.

{literal}

```
{$site.title}
{$site.index}
```

{/literal}

This data is pulled from the `dist/site.json` file. Additional properties can be
added to this data by editing the `src/site.json` file.

</article>

<article id="article3">

## Markdown

Markdown files are intended for easier writing of documentation and content,
these files are rendered to HTML and then wrapped in a `soy` template and
rendered along all `soy` pages.

{literal}

```
---
description: "Page description."
layout: "docs"
title: "Page"
---

# Hello, World!
```

{/literal}

It's important to note that because markdown files are wrapped in soy templates,
that some content may need to be sanitized of `soy` related syntax (such as
curly braces).

```soy
---
description: "Page description."
layout: "docs"
title: "Page"
---

# Hello, World!

{lb}literal{rb}

<script type="text/javascript">
	var example = function() {lb}
		return 'Example js';
	{rb}
</script>

{lb}/literal{rb}
```

See [google's documentation](https://developers.google.com/closure/templates/docs/commands#specialcharacters) for more info.

</article>
