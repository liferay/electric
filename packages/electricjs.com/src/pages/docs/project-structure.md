---
description: "Basic project structure and boilerplate."
layout: "docs"
title: "Project Structure"
weight: 3
---

<article id="article1">

## Structure

Here is a basic example of a `metal-ssg` project.

{literal}

```bash
|--gulpfile.js (registers tasks)
|--src/
   |--layouts/
      |--base.soy (required base template)
   |--pages/
      |--index.soy (required index page)
      |--docs/
         |--index.soy
         |--create.soy (soy rendered to html)
         |--deploy.md (markdown rendered to html)
         |--parent/
            |--index.md
            |--child.md
```

{/literal}

### Layouts

The file structure of `layouts` is flexible, as `soy` uses the `namespace` of
every file as an identifier.

All layout files must be a `soy` template.

See [layouts](/docs/layouts.html) for more information.

### Pages

Every file in `pages` with a `.soy` or `.md` extension is rendered to HTML
during the `generate` task.

The file structure of `pages` determines the urls of your pages. For the above
example, the `child.md` file will be located at `/docs/parent/child.html` after
generating.

Pages named `index` will be located at the path of it's parent directory,
so `pages/docs/index.soy` will be available at `/docs/`.

See [pages](/docs/pages.html) for more information.

</article>
