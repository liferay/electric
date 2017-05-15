---
description: "Creating pages in soy and markdown."
icon: "menu-content"
layout: "docsVOne"
title: "Pages"
weight: 2
---

<article id="front_matter">

## Front Matter

All files in the `pages` directory must have the following front matter declared
at the beginning of the file.

```
---
title: "Page Title"
description: "Description."
---
```

The `title` property will be used for auto-generated navigation elements and as
the page's `<title>`.

Both the `title` and `description` properties will be used for search
functionality.

</article>

<article id="soy_files">

## Soy

All files ending with the `.soy` extension will be rendered as soy templates.

```soy
---
description: "Page description."
title: "Page"
---

&#123;namespace page&#125;

/**
 *
 */
&#123;template .render&#125;
    <span>Hello, World!</span>
&#123;/template&#125;
```

> Note: all `namespace` properties must be unique across all files within
the `src` directory, and every soy file must define a `.render` template.

### Site/Page Data

Every page is passed a `site` and `page` param.

The `page` param represents the front matter of the current file.

```soy
{$page.title}
{$page.description}
```

The `site` param contains project meta data such
as `site.title` and `site.repo`. It also contains the structure of the entire
site which can be used to generate navigation elements. This structure data is
defined as the `site.index` property representing the index page of the project.

```soy
{$site.title}
{$site.index}
```

This data is pulled from the `dist/site.json` file. Additional properties can be
added to this data by editing the `src/site.json` file.

</article>

<article id="markdown_files">

## Markdown

Markdown files are intended for easier writing of documentation and content,
these files are rendered to HTML and then wrapped in a `soy` template and
rendered along all `soy` pages.

The `namespace` is also auto-generated based on the file path, so it does not
need to be declared at the top of the file.

```markdown
---
description: "Page description."
layout: "docs"
title: "Page"
---

# Hello, World!
```

See [google's documentation](https://developers.google.com/closure/templates/docs/commands#specialcharacters) for more info.

</article>
