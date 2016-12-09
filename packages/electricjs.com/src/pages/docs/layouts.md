---
description: "Documentation on base layout and sub layouts."
layout: "docs"
title: "Layouts"
weight: 4
---

<article id="base">

## Base Layout

All projects must have a `layouts/base.soy` file. This file is responsible for
the HTML boilerplate of your site. Every page will be rendered with this layout.

```soy
{lb}namespace base{rb}

/**
 * @param content
 * @param page
 * @param serialized
 * @param site
 */
{lb}template .render private="true"{rb}
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta content="minimum-scale=1.0, width=device-width" name="viewport">
        <meta name="description" content="{lb}$page.description ?: ''{rb}">

        <title>{lb}$page.title{rb} - {lb}$site.title{rb}</title>
    </head>
    <body>
        <!-- inject:metal:js -->
            <div>
                {lb}$content{rb}
            </div>
        <!-- endinject -->
    </body>
</html>
{lb}/template{rb}
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
{lb}namespace docs{rb}

/**
 * @param content
 * @param elementClasses
 * @param page
 * @param site
 */
{lb}template .render{rb}
    <div class="{lb}$elementClasses ?: 'main'{rb}">
        <div class="topper">
            <h1>{lb}$site.title{rb}</h1>
        </div>

        <div class="content">
            <h2>{lb}$page.title{rb}</h2>

            {lb}$content{rb}
        </div>
    </div>
{lb}/template{rb}
```

This template can be implemented by both `soy` and `markdown` files. The
following example implements the `docs` layout.

### `soy` example.

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
    {lb}call docs.render data="all"{rb}
        {lb}param content kind="html{rb}
            <span>Hello, World!</span>
        {lb}/param{rb}
    {lb}/call{rb}
{lb}/template{rb}
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

See the section on [configuration](http://localhost:8888/docs/tasks.html#configuration) for
info on configuring the markdown engine.

</article>
