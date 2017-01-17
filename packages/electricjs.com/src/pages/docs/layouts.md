---
description: "Documentation on base layout and sub layouts."
icon: "code-file"
layout: "docs"
title: "Layouts"
weight: 4
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
&lt;!DOCTYPE html&gt;
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta content="minimum-scale=1.0, width=device-width" name="viewport">
        <meta name="description" content="{$page.description ?: ''}">

        <title>&#123;$page.title&#125; - &#123;$site.title&#125;</title>
    </head>
    <body>
        &lt;!-- inject:metal:js --&gt;
            <div>
                &#123;$content&#125;
            </div>
        &lt;!-- endinject --&gt;
    </body>
</html>
&#123;/template&#125;
```

This layout can be editted to fit the needs of your project, but it must
use `base` as the `namespace`, and it must include
the `{lb}$content{rb}` variable which renders the content of each page.

### Metal Component Invocation

The `<!-- inject:metal:js -->` and `<!-- endinject -->` are not just comments,
during the `generate` task they are replaced with the necessary code for
automatically invoking Metal components that have been implemented in your
project's `soy` files.

> Note: these tags only needed to be included in the `base` template.

The injected code is what implements the `serialized` param that is defined at
the start of the template. `serialized` is stringified meta data that Metal
consumes to render each page.

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
        {param content kind="html}
            <span>Hello, World!</span>
        {/param}
    {/call}
&#123;/template&#125;
```

Sub layouts are rendered using soy's [call command](https://developers.google.com/closure/templates/docs/commands#call).

The `data="all"` property needs to be set if the layout in question needs to
implement any of the global params (`site` or `page`).

### `markdown` example.

Markdown implementation doesn't require any `soy` code, rather it leverages the
front matter `layout` property to determine the layout.

```
---
description: "Page description."
layout: "docs"
title: "Page"
---

# Hello, World!

```

By specifying `layout: "docs"`, the generator will look for a soy template in
the layouts directory with the `docs` namespace.

See the section on [configuration](/docs/tasks.html#configuration) for
info on configuring the markdown engine.

</article>
