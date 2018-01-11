---
description: "Documentation on base layout and sub layouts."
icon: "code-file"
layout: "docsVOne"
title: "Layouts"
weight: 3
---

<article id="base">

## Base Layout

All projects must have a `layouts/base.soy` file. This file is responsible for
the HTML boilerplate of your site. Every page will be rendered with this layout.

```soy
&#123;namespace base&#125;

/**
 * @param content
 * @param page
 * @param serialized
 * @param site
 */
&#123;template .render private="true"&#125;
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta content="minimum-scale=1.0, width=device-width" name="viewport">
        <meta name="description" content="{$page.description ?: ''}">

        <title>{$page.title} - {$site.title}</title>

        <!-- inject:css -->
        <!-- endinject -->

        <link rel="stylesheet" href="/styles/main.css">

        <!-- inject:js -->
        <!-- endinject -->
    </head>
    <body>
        <!-- inject:metal:js -->
            <div>
                {$content}
            </div>
        <!-- endinject -->

        <!-- inject:codemirror:js -->
        <!-- endinject -->
    </body>
</html>
&#123;/template&#125;
```

This layout can be editted to fit the needs of your project, but it must
use `base` as the `namespace`, and it must include
the `{lb}$content{rb}` variable which renders the content of each page.

### Inject Tags

Inside the `base.soy` template there are multiple inject tags that are used by
electric to import resources and scripts.

#### `inject:css`/`inject:js`

These tags are used to inject `link` and `script` tags for all thirdparty
resources located in `dist/vendor`.

#### `inject:metal:js`

During the `generate` task they are replaced with the necessary code for
automatically invoking Metal components that have been implemented in your
project's `soy` files.

Note: these tags only need to be included in the `base` template.

The injected code is what implements the `serialized` param that is defined at
the start of the template. `serialized` is stringified meta data that Metal
consumes to render each page.

#### `inject:codemirror:js`

CodeMirror is responsible for Electric's built in syntax highlighting. This
script locates all code examples and applies the appropriate syntax
highlighting.

</article>

<article id="sub">

## Sub Layouts

Additional layouts can be created in the `layouts` folder of your project. These
layouts are simply `soy` templates that can be implemented by individual pages.

```soy
&#123;namespace docs&#125;

/**
 * @param content
 * @param elementClasses
 * @param page
 * @param site
 */
&#123;template .render&#125;
    <div class="{$elementClasses ?: 'main'}">
        <div class="topper">
            <h1>{$site.title}</h1>
        </div>

        <div class="content">
            <h2>{$page.title}</h2>

            {$content}
        </div>
    </div>
&#123;/template&#125;
```

This template can be implemented by both `soy` and `markdown` files. The
following example implements the `docs` layout.

### `soy` example.

Sub layouts are rendered using soy's [call command](https://developers.google.com/closure/templates/docs/commands#call).

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
    {call docs.render data="all"}
        {param content kind="html"}
            <span>Hello, World!</span>
        {/param}
    {/call}
&#123;/template&#125;
```

The `data="all"` property needs to be set if the layout in question needs to
implement any of the global params (`site` or `page`).

### `markdown` example.

Markdown implementation doesn't require any `soy` code, rather it leverages the
front matter `layout` property to determine the layout.

```markdown
---
description: "Page description."
layout: "docs"
title: "Page"
---

# Hello, World!
```

By specifying `layout: "docs"`, the generator will look for a soy template in
the layouts directory with the `docs` namespace.

See the section on [configuration](/docs/v1_0/configuration.html#options) for
info on configuring the markdown engine.

</article>
